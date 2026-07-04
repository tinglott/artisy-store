"""
Invoice Variance B2B SaaS — FastAPI Backend
Supports PDF, CSV, Excel (.xlsx/.xls), JPG/PNG invoice uploads
"""

import os
import json
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse, FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import tempfile
from typing import Optional
import uuid

from app.extractor import InvoiceExtractor
from app.matcher import InventoryMatcher
from app.po_generator import POGenerator

# Initialize FastAPI
app = FastAPI(
    title="Invoice Variance B2B SaaS",
    description="AI-powered invoice extraction + inventory matching + PO generation",
    version="1.0.0"
)

# CORS — allow all origins for web access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Keys
GITHUB_API_KEY = os.getenv("GITHUB_MODELS_API_KEY", "")
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

# Extractor
extractor = InvoiceExtractor(GITHUB_API_KEY)

# Upload dir
UPLOAD_DIR = Path(tempfile.gettempdir()) / "invoice_variance_uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Static frontend dir
STATIC_DIR = Path(__file__).parent.parent / "static"

# Allowed file extensions
ALLOWED_EXTENSIONS = {".pdf", ".csv", ".xlsx", ".xls", ".jpg", ".jpeg", ".png"}


# ============================================================================
# SERVE FRONTEND
# ============================================================================

@app.get("/", response_class=HTMLResponse)
async def serve_frontend():
    """Serve the main company upload portal."""
    index = STATIC_DIR / "index.html"
    if index.exists():
        return HTMLResponse(content=index.read_text(), status_code=200)
    return HTMLResponse(content="""<html><body style='background:#0d0d0d;color:#gold;font-family:sans-serif;text-align:center;padding:80px'>
    <h1 style='color:#c9a84c'>Invoice Variance AI</h1>
    <p style='color:#aaa'>API is running. Frontend loading...</p>
    <p><a href='/docs' style='color:#c9a84c'>API Documentation →</a></p>
    </body></html>""", status_code=200)

# Serve static assets
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


# ============================================================================
# HEALTH
# ============================================================================

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Invoice Variance B2B SaaS",
        "version": "1.0.0",
        "supported_formats": ["PDF", "CSV", "Excel (.xlsx/.xls)", "Image (JPG/PNG)"]
    }


# ============================================================================
# UPLOAD — Single invoice file
# ============================================================================

@app.post("/api/upload-invoice")
async def upload_invoice(
    file: UploadFile = File(...),
    business_id: Optional[str] = None
):
    """
    Upload an invoice in any supported format.
    Returns extracted structured data.
    Accepted: PDF, CSV, XLSX, XLS, JPG, JPEG, PNG
    """
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Accepted: PDF, CSV, Excel, JPG, PNG"
        )

    temp_path = UPLOAD_DIR / f"{uuid.uuid4().hex}{ext}"
    try:
        contents = await file.read()
        temp_path.write_bytes(contents)

        result = extractor.extract_complete(str(temp_path))
        return {
            "status": "success",
            "file_id": temp_path.stem,
            "filename": file.filename,
            "format": ext.lstrip(".").upper(),
            "extraction": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")
    finally:
        if temp_path.exists():
            temp_path.unlink(missing_ok=True)


# ============================================================================
# FULL PIPELINE — Upload → Extract → Match → Generate PO
# ============================================================================

@app.post("/api/full-pipeline")
async def full_pipeline(
    file: UploadFile = File(...),
    inventory_db: Optional[str] = None,   # JSON string: [{sku, name, quantity, unit_price}]
    business_info: Optional[str] = None   # JSON string: {name, address, email, phone}
):
    """
    One-shot endpoint:
    1. Accept invoice in any format (PDF/CSV/Excel/Image)
    2. AI-extract line items
    3. Cross-reference against provided inventory
    4. Auto-generate PO PDF for missing/short items
    Returns full analysis + PO file path (if PO needed)
    """
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Accepted: PDF, CSV, Excel, JPG, PNG"
        )

    temp_path = UPLOAD_DIR / f"{uuid.uuid4().hex}{ext}"
    try:
        contents = await file.read()
        temp_path.write_bytes(contents)

        # Step 1 — Extract
        extraction = extractor.extract_complete(str(temp_path))
        parsed_data = extraction.get("parsed_structured", {})

        # Step 2 — Match inventory
        inventory_list = []
        if inventory_db:
            try:
                raw_inv = json.loads(inventory_db)
                # Normalize field names: frontend sends {sku, name, quantity, unit_price}
                # matcher expects {sku, item_name, current_quantity, unit_price}
                for item in raw_inv:
                    inventory_list.append({
                        "sku": item.get("sku", ""),
                        "item_name": item.get("item_name") or item.get("name", ""),
                        "current_quantity": item.get("current_quantity") or item.get("quantity", 0),
                        "unit_price": item.get("unit_price", 0),
                        "reorder_quantity": item.get("reorder_quantity", 10)
                    })
            except Exception:
                pass

        matcher = InventoryMatcher(inventory_list)
        extracted_items = parsed_data.get("items", [])
        analysis = matcher.detect_missing_inventory(
            extracted_items,
            parsed_data.get("vendor_name")
        )

        # Step 3 — Generate PO if needed
        po_result = None
        if analysis.get("requires_po") or analysis.get("missing_items"):
            business_dict = {}
            if business_info:
                try:
                    business_dict = json.loads(business_info)
                except Exception:
                    pass

            po_requirements = matcher.generate_po_requirements(analysis, parsed_data)
            if po_requirements.get("po_items"):
                po_gen = POGenerator(business_dict)
                po_path = UPLOAD_DIR / f"PO_{uuid.uuid4().hex}.pdf"
                po_file, po_number = po_gen.generate_po_pdf(
                    po_items=po_requirements["po_items"],
                    po_total=po_requirements["po_total"],
                    vendor_name=po_requirements.get("vendor_name", "Unknown Vendor"),
                    output_path=str(po_path)
                )
                po_result = {
                    "po_number": po_number,
                    "po_file": str(po_path),
                    "po_file_id": po_path.stem,
                    "po_items_count": len(po_requirements["po_items"]),
                    "po_total": po_requirements["po_total"]
                }

        return {
            "status": "success",
            "invoice": parsed_data,
            "inventory_analysis": analysis,
            "purchase_order": po_result
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline failed: {str(e)}")
    finally:
        if temp_path.exists():
            temp_path.unlink(missing_ok=True)


# ============================================================================
# MATCH INVENTORY
# ============================================================================

@app.post("/api/match-inventory")
async def match_inventory_endpoint(payload: dict):
    """
    Match extracted invoice items against inventory.
    Body: { extracted_items: [], inventory_db: [], vendor_name: "" }
    """
    try:
        extracted_items = payload.get("extracted_items", [])
        inventory_db = payload.get("inventory_db", [])
        vendor_name = payload.get("vendor_name")

        matcher = InventoryMatcher(inventory_db)
        analysis = matcher.detect_missing_inventory(extracted_items, vendor_name)
        return {"status": "success", "analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Matching failed: {str(e)}")


# ============================================================================
# GENERATE PO
# ============================================================================

@app.post("/api/generate-po")
async def generate_po_endpoint(payload: dict):
    """
    Generate a PO PDF.
    Body: { po_data: {po_items, po_total, vendor_name}, business_info: {} }
    """
    try:
        po_data = payload.get("po_data", {})
        business_info = payload.get("business_info", {})

        po_gen = POGenerator(business_info)
        output_path = UPLOAD_DIR / f"PO_{uuid.uuid4().hex}.pdf"
        po_file, po_number = po_gen.generate_po_pdf(
            po_items=po_data.get("po_items", []),
            po_total=po_data.get("po_total", 0),
            vendor_name=po_data.get("vendor_name", "Unknown Vendor"),
            output_path=str(output_path)
        )
        return {
            "status": "success",
            "po_number": po_number,
            "po_file_id": output_path.stem,
            "file_ready_for_download": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PO generation failed: {str(e)}")


# ============================================================================
# DOWNLOAD PO
# ============================================================================

@app.get("/api/download-po/{po_id}")
async def download_po(po_id: str):
    """Download generated PO PDF by ID."""
    try:
        matches = list(UPLOAD_DIR.glob(f"*{po_id}*.pdf"))
        if not matches:
            raise HTTPException(status_code=404, detail="PO not found or expired")
        return FileResponse(
            path=str(matches[0]),
            filename=f"PurchaseOrder_{po_id[:8]}.pdf",
            media_type="application/pdf"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
