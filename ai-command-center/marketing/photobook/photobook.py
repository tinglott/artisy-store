#!/usr/bin/env python3
"""
PhotoBook Maker - Create beautifully designed PDF photo books from images.

Supports:
- Cover page with title
- Full-page photos
- Caption pages
- 2-up / 3-up / 4-up grids
- Automatic aspect-ratio preservation
- Page numbers, titles, and metadata
- Configurable page size (A4, Letter, landscape, etc.)
- YAML config or simple folder mode

Usage:
  python photobook.py --images ./my_photos --title "Summer 2026" --output book.pdf
  python photobook.py --config book.yaml
"""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path
from typing import List, Optional, Tuple

from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, A5, letter, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch, mm
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    Image,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

# Optional YAML support
try:
    import yaml
    HAS_YAML = True
except ImportError:
    HAS_YAML = False


SUPPORTED_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".tiff", ".tif", ".bmp"}


def get_page_size(name: str, orientation: str = "portrait"):
    sizes = {
        "a4": A4,
        "a5": A5,
        "letter": letter,
    }
    size = sizes.get(name.lower(), A4)
    if orientation.lower() == "landscape":
        return landscape(size)
    return size


def collect_images(folder: Path, recursive: bool = False) -> List[Path]:
    """Collect image files from a folder, sorted by name."""
    if not folder.is_dir():
        raise FileNotFoundError(f"Image folder not found: {folder}")

    images = []
    pattern = "**/*" if recursive else "*"
    for p in sorted(folder.glob(pattern)):
        if p.is_file() and p.suffix.lower() in SUPPORTED_EXTS:
            images.append(p)
    return images


def fit_image(
    path: Path,
    max_w: float,
    max_h: float,
) -> Tuple[float, float]:
    """Return (width, height) that fit inside the box while preserving aspect ratio."""
    with PILImage.open(path) as im:
        w, h = im.size
    aspect = h / float(w)
    target_w = max_w
    target_h = target_w * aspect
    if target_h > max_h:
        target_h = max_h
        target_w = target_h / aspect
    return target_w, target_h


def make_styles():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="BookTitle",
            parent=styles["Title"],
            fontSize=28,
            spaceAfter=20,
            alignment=1,  # center
            textColor=colors.HexColor("#1a1a1a"),
        )
    )
    styles.add(
        ParagraphStyle(
            name="Caption",
            parent=styles["Normal"],
            fontSize=11,
            alignment=1,
            textColor=colors.HexColor("#444444"),
            spaceBefore=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="PageNumber",
            parent=styles["Normal"],
            fontSize=9,
            alignment=1,
            textColor=colors.HexColor("#888888"),
        )
    )
    styles.add(
        ParagraphStyle(
            name="SectionHeader",
            parent=styles["Heading2"],
            fontSize=16,
            spaceBefore=12,
            spaceAfter=12,
            textColor=colors.HexColor("#222222"),
        )
    )
    return styles


class PhotoBookBuilder:
    def __init__(
        self,
        title: str = "My Photo Book",
        author: str = "",
        page_size: str = "a4",
        orientation: str = "portrait",
        margin_mm: float = 15,
        layout: str = "auto",  # auto | full | grid2 | grid3 | grid4
        caption_mode: str = "filename",  # none | filename | custom
    ):
        self.title = title
        self.author = author
        self.page_size = get_page_size(page_size, orientation)
        self.margin = margin_mm * mm
        self.layout = layout
        self.caption_mode = caption_mode
        self.styles = make_styles()
        self.page_w, self.page_h = self.page_size

    def _header_footer(self, canvas_obj, doc):
        canvas_obj.saveState()
        # Footer with page number
        page_num = canvas_obj.getPageNumber()
        if page_num > 1:  # skip cover
            text = f"{self.title}  ·  {page_num - 1}"
            canvas_obj.setFont("Helvetica", 8)
            canvas_obj.setFillColor(colors.HexColor("#999999"))
            canvas_obj.drawCentredString(self.page_w / 2, 10 * mm, text)
        canvas_obj.restoreState()

    def build(self, images: List[Path], output: Path, captions: Optional[dict] = None):
        if not images:
            raise ValueError("No images provided")

        captions = captions or {}
        doc = SimpleDocTemplate(
            str(output),
            pagesize=self.page_size,
            leftMargin=self.margin,
            rightMargin=self.margin,
            topMargin=self.margin,
            bottomMargin=self.margin + 8 * mm,  # room for footer
            title=self.title,
            author=self.author or "PhotoBook Maker",
        )

        story = []

        # ---- Cover ----
        story.append(Spacer(1, 40 * mm))
        story.append(Paragraph(self.title, self.styles["BookTitle"]))
        if self.author:
            story.append(Spacer(1, 8 * mm))
            story.append(Paragraph(self.author, self.styles["Caption"]))
        story.append(Spacer(1, 20 * mm))

        # Cover image (first photo, large)
        cover = images[0]
        max_w = self.page_w - 2 * self.margin - 10 * mm
        max_h = self.page_h * 0.45
        w, h = fit_image(cover, max_w, max_h)
        story.append(Image(str(cover), width=w, height=h, hAlign="CENTER"))
        story.append(PageBreak())

        # ---- Content pages ----
        usable_w = self.page_w - 2 * self.margin
        usable_h = self.page_h - 2 * self.margin - 12 * mm

        if self.layout == "full":
            self._add_full_pages(story, images, usable_w, usable_h, captions)
        elif self.layout.startswith("grid"):
            n = int(self.layout[-1]) if self.layout[-1].isdigit() else 2
            self._add_grid_pages(story, images, usable_w, usable_h, n, captions)
        else:
            # auto: mix of full and grids for variety
            self._add_auto_pages(story, images, usable_w, usable_h, captions)

        doc.build(story, onFirstPage=self._header_footer, onLaterPages=self._header_footer)
        print(f"✓ Created: {output}  ({len(images)} images)")

    def _caption_for(self, path: Path, captions: dict) -> str:
        if self.caption_mode == "none":
            return ""
        if path.name in captions:
            return captions[path.name]
        if self.caption_mode == "filename":
            return path.stem.replace("_", " ").replace("-", " ").title()
        return ""

    def _add_full_pages(self, story, images, usable_w, usable_h, captions):
        for img in images:
            w, h = fit_image(img, usable_w, usable_h * 0.88)
            story.append(Image(str(img), width=w, height=h, hAlign="CENTER"))
            cap = self._caption_for(img, captions)
            if cap:
                story.append(Paragraph(cap, self.styles["Caption"]))
            story.append(PageBreak())

    def _add_grid_pages(self, story, images, usable_w, usable_h, cols, captions):
        gap = 4 * mm
        cell_w = (usable_w - (cols - 1) * gap) / cols
        # Rough cell height – will adjust per row
        rows_per_page = 2 if cols <= 2 else 3
        cell_h = (usable_h - (rows_per_page - 1) * gap) / rows_per_page * 0.9

        batch = []
        for img in images:
            batch.append(img)
            if len(batch) == cols * rows_per_page:
                self._render_grid(story, batch, cols, cell_w, cell_h, gap, captions)
                batch = []
                story.append(PageBreak())
        if batch:
            self._render_grid(story, batch, cols, cell_w, cell_h, gap, captions)

    def _render_grid(self, story, imgs, cols, cell_w, cell_h, gap, captions):
        data = []
        row = []
        for i, img in enumerate(imgs):
            w, h = fit_image(img, cell_w, cell_h)
            cell = Image(str(img), width=w, height=h, hAlign="CENTER")
            row.append(cell)
            if len(row) == cols:
                data.append(row)
                row = []
        if row:
            while len(row) < cols:
                row.append("")
            data.append(row)

        table = Table(data, colWidths=[cell_w] * cols, hAlign="CENTER")
        table.setStyle(
            TableStyle(
                [
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 2),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 2),
                    ("TOPPADDING", (0, 0), (-1, -1), 2),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
                ]
            )
        )
        story.append(table)

    def _add_auto_pages(self, story, images, usable_w, usable_h, captions):
        """Alternate full-page and 2-up spreads for a more book-like feel."""
        i = 0
        n = len(images)
        while i < n:
            # Full page
            img = images[i]
            w, h = fit_image(img, usable_w, usable_h * 0.85)
            story.append(Image(str(img), width=w, height=h, hAlign="CENTER"))
            cap = self._caption_for(img, captions)
            if cap:
                story.append(Paragraph(cap, self.styles["Caption"]))
            story.append(PageBreak())
            i += 1

            # Optional 2-up
            if i + 1 < n:
                pair = images[i : i + 2]
                gap = 6 * mm
                cell_w = (usable_w - gap) / 2
                cell_h = usable_h * 0.75
                data = []
                cells = []
                for p in pair:
                    ww, hh = fit_image(p, cell_w, cell_h)
                    cells.append(Image(str(p), width=ww, height=hh, hAlign="CENTER"))
                data.append(cells)
                t = Table(data, colWidths=[cell_w, cell_w], hAlign="CENTER")
                t.setStyle(
                    TableStyle(
                        [
                            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                            ("LEFTPADDING", (0, 0), (-1, -1), 3),
                            ("RIGHTPADDING", (0, 0), (-1, -1), 3),
                        ]
                    )
                )
                story.append(t)
                story.append(PageBreak())
                i += 2


def load_config(path: Path) -> dict:
    if not HAS_YAML:
        raise RuntimeError("PyYAML is required for --config. Install with: pip install pyyaml")
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def main():
    parser = argparse.ArgumentParser(
        description="PhotoBook Maker – create designed PDF photo books from images"
    )
    parser.add_argument("--images", "-i", type=str, help="Folder containing images")
    parser.add_argument("--config", "-c", type=str, help="YAML config file")
    parser.add_argument("--output", "-o", type=str, default="photobook.pdf", help="Output PDF path")
    parser.add_argument("--title", "-t", type=str, default="My Photo Book")
    parser.add_argument("--author", "-a", type=str, default="")
    parser.add_argument("--page-size", choices=["a4", "a5", "letter"], default="a4")
    parser.add_argument("--orientation", choices=["portrait", "landscape"], default="portrait")
    parser.add_argument(
        "--layout",
        choices=["auto", "full", "grid2", "grid3", "grid4"],
        default="auto",
        help="Page layout style",
    )
    parser.add_argument(
        "--captions",
        choices=["none", "filename"],
        default="filename",
        help="How to generate captions",
    )
    parser.add_argument("--recursive", action="store_true", help="Scan subfolders for images")
    parser.add_argument("--margin", type=float, default=15, help="Margin in mm")

    args = parser.parse_args()

    if args.config:
        cfg = load_config(Path(args.config))
        images = collect_images(Path(cfg.get("images", ".")), cfg.get("recursive", False))
        builder = PhotoBookBuilder(
            title=cfg.get("title", "My Photo Book"),
            author=cfg.get("author", ""),
            page_size=cfg.get("page_size", "a4"),
            orientation=cfg.get("orientation", "portrait"),
            margin_mm=cfg.get("margin", 15),
            layout=cfg.get("layout", "auto"),
            caption_mode=cfg.get("captions", "filename"),
        )
        output = Path(cfg.get("output", "photobook.pdf"))
        captions = cfg.get("custom_captions", {})
    else:
        if not args.images:
            parser.error("Either --images or --config is required")
        images = collect_images(Path(args.images), args.recursive)
        builder = PhotoBookBuilder(
            title=args.title,
            author=args.author,
            page_size=args.page_size,
            orientation=args.orientation,
            margin_mm=args.margin,
            layout=args.layout,
            caption_mode=args.captions,
        )
        output = Path(args.output)
        captions = {}

    if not images:
        print("No images found.", file=sys.stderr)
        sys.exit(1)

    output.parent.mkdir(parents=True, exist_ok=True)
    builder.build(images, output, captions)


if __name__ == "__main__":
    main()
