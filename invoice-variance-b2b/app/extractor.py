"""
Invoice extraction — supports PDF, CSV, Excel, JPG/PNG images
Uses GitHub Models gpt-4o for AI parsing
"""

import json
import base64
import requests
import os
from typing import Optional
from pathlib import Path


class InvoiceExtractor:
    def __init__(self, github_api_key: str):
        self.github_api_key = github_api_key
        self.github_endpoint = "https://models.inference.ai.azure.com/chat/completions"

    # ------------------------------------------------------------------
    # PUBLIC
    # ------------------------------------------------------------------

    def extract_complete(self, file_path: str) -> dict:
        """
        Master entry point.  Auto-detects format and returns:
        {
          "raw_text": "...",
          "parsed_structured": { invoice_number, vendor_name, items[], ... }
        }
        """
        ext = Path(file_path).suffix.lower()

        if ext == ".pdf":
            raw = self._extract_pdf(file_path)
        elif ext in (".jpg", ".jpeg", ".png", ".webp"):
            raw = self._extract_image(file_path)
        elif ext == ".csv":
            raw = self._extract_csv(file_path)
        elif ext in (".xlsx", ".xls"):
            raw = self._extract_excel(file_path)
        else:
            raw = {"raw_text": f"Unsupported format: {ext}", "method": "none"}

        parsed = self.parse_invoice_text(raw.get("raw_text", ""))
        return {"raw_text": raw.get("raw_text", ""), "parsed_structured": parsed}

    # ------------------------------------------------------------------
    # EXTRACTORS
    # ------------------------------------------------------------------

    def _extract_pdf(self, path: str) -> dict:
        """Extract text from PDF using pypdf (no OCR dependency)."""
        try:
            import pypdf
            reader = pypdf.PdfReader(path)
            text = "\n".join(page.extract_text() or "" for page in reader.pages)
            if text.strip():
                return {"raw_text": text, "method": "pypdf"}
        except ImportError:
            pass
        except Exception as e:
            print(f"pypdf failed: {e}")

        # Fallback: send PDF pages as images via vision API
        return self._extract_pdf_as_images(path)

    def _extract_pdf_as_images(self, path: str) -> dict:
        """Convert PDF pages to images and send to vision API."""
        try:
            from pdf2image import convert_from_path
            images = convert_from_path(path, first_page=1, last_page=3, dpi=150)
            import io
            combined_text = ""
            for i, img in enumerate(images):
                buf = io.BytesIO()
                img.save(buf, format="JPEG", quality=85)
                b64 = base64.b64encode(buf.getvalue()).decode()
                text = self._vision_extract(b64, "image/jpeg")
                combined_text += f"\n--- Page {i+1} ---\n{text}"
            return {"raw_text": combined_text, "method": "pdf_vision"}
        except Exception as e:
            return {"raw_text": f"PDF extraction failed: {e}", "method": "error"}

    def _extract_image(self, path: str) -> dict:
        """Send image to GPT-4o vision for text extraction."""
        with open(path, "rb") as f:
            b64 = base64.b64encode(f.read()).decode()
        ext = Path(path).suffix.lower().strip(".")
        mime = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "webp": "image/webp"}.get(ext, "image/jpeg")
        text = self._vision_extract(b64, mime)
        return {"raw_text": text, "method": "vision"}

    def _vision_extract(self, b64_data: str, mime: str) -> str:
        """Call GPT-4o vision to extract all text from an image."""
        if not self.github_api_key:
            return "No API key — cannot extract from image."
        try:
            response = requests.post(
                self.github_endpoint,
                headers={"Authorization": f"Bearer {self.github_api_key}", "Content-Type": "application/json"},
                json={
                    "model": "gpt-4o",
                    "messages": [{
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Extract ALL text from this invoice image. Preserve structure (tables, line items, totals). Output raw text only."},
                            {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{b64_data}"}}
                        ]
                    }],
                    "max_tokens": 2000
                },
                timeout=45
            )
            return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            return f"Vision extraction error: {e}"

    def _extract_csv(self, path: str) -> dict:
        """Read CSV invoice and convert to text representation."""
        try:
            import csv
            lines = []
            with open(path, newline='', encoding='utf-8-sig') as f:
                reader = csv.reader(f)
                for row in reader:
                    lines.append(", ".join(str(c).strip() for c in row))
            return {"raw_text": "\n".join(lines), "method": "csv"}
        except Exception as e:
            return {"raw_text": f"CSV read error: {e}", "method": "error"}

    def _extract_excel(self, path: str) -> dict:
        """Read Excel invoice and convert to text."""
        try:
            import openpyxl
            wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
            lines = []
            for sheet in wb.worksheets:
                lines.append(f"=== Sheet: {sheet.title} ===")
                for row in sheet.iter_rows(values_only=True):
                    row_vals = [str(c).strip() if c is not None else "" for c in row]
                    if any(row_vals):
                        lines.append(", ".join(row_vals))
            return {"raw_text": "\n".join(lines), "method": "excel"}
        except ImportError:
            # Try xlrd for old .xls
            try:
                import xlrd
                wb = xlrd.open_workbook(path)
                lines = []
                for sheet in wb.sheets():
                    lines.append(f"=== Sheet: {sheet.name} ===")
                    for rx in range(sheet.nrows):
                        lines.append(", ".join(str(sheet.cell_value(rx, cx)) for cx in range(sheet.ncols)))
                return {"raw_text": "\n".join(lines), "method": "excel_xlrd"}
            except Exception as e2:
                return {"raw_text": f"Excel read error: {e2}", "method": "error"}
        except Exception as e:
            return {"raw_text": f"Excel read error: {e}", "method": "error"}

    # ------------------------------------------------------------------
    # AI PARSING
    # ------------------------------------------------------------------

    def parse_invoice_text(self, text: str) -> dict:
        """
        Parse raw invoice text with GPT-4o → structured JSON.
        """
        if not text or not self.github_api_key:
            return self._mock_parsed()

        prompt = f"""Extract structured invoice data from the following text.
Return ONLY valid JSON — no markdown, no explanation — with this exact structure:
{{
  "invoice_number": "string or null",
  "invoice_date": "YYYY-MM-DD or null",
  "vendor_name": "string or null",
  "total_amount": 0.00,
  "items": [
    {{"sku": "string", "name": "string", "quantity": 0, "unit_price": 0.00}}
  ]
}}

Invoice text:
{text[:4000]}"""

        try:
            resp = requests.post(
                self.github_endpoint,
                headers={"Authorization": f"Bearer {self.github_api_key}", "Content-Type": "application/json"},
                json={
                    "model": "gpt-4o",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.1,
                    "max_tokens": 1500
                },
                timeout=30
            )
            content = resp.json()["choices"][0]["message"]["content"].strip()
            # Strip markdown code blocks if present
            if content.startswith("```"):
                content = content.split("```")[1]
                if content.startswith("json"):
                    content = content[4:]
            j_start = content.find("{")
            j_end = content.rfind("}") + 1
            if j_start != -1:
                return json.loads(content[j_start:j_end])
        except Exception as e:
            print(f"parse_invoice_text error: {e}")

        return self._mock_parsed()

    def _mock_parsed(self):
        return {
            "invoice_number": "DEMO-001",
            "invoice_date": "2026-07-04",
            "vendor_name": "Demo Vendor",
            "total_amount": 500.00,
            "items": [
                {"sku": "A001", "name": "Sample Item A", "quantity": 10, "unit_price": 25.00},
                {"sku": "B002", "name": "Sample Item B", "quantity": 5, "unit_price": 50.00}
            ]
        }
