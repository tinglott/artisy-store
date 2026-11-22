# PhotoBook Maker

**Create beautiful, print-ready PDF photo books from a folder of images.**

A clean, modern Python tool that turns your photos into a designed photobook with cover, captions, full-page spreads, and multi-image grids.

---

## Features

- **Cover page** with title + hero image
- **Layout modes**:
  - `auto` – alternating full-page + 2-up spreads (most book-like)
  - `full` – one large photo per page
  - `grid2` / `grid3` / `grid4` – multi-photo grids
- Automatic **aspect-ratio preservation**
- Optional **captions** (from filenames or custom)
- Page numbers + running title footer
- Configurable page size (A4 / A5 / Letter) and orientation
- YAML config support for complex books
- Lossless-friendly (works great with high-res JPEGs/PNGs)

---

## Quick Start

### 1. Install dependencies

```bash
cd photobook-maker
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Put your images in a folder

```bash
mkdir -p my_photos
# copy your .jpg / .png files into my_photos/
```

### 3. Generate the book

```bash
python src/photobook.py \
  --images my_photos \
  --title "Summer Adventures 2026" \
  --author "Alex" \
  --layout auto \
  --output output/summer_book.pdf
```

Open `output/summer_book.pdf` — done!

---

## Command-Line Options

| Flag | Description | Default |
|------|-------------|---------|
| `--images`, `-i` | Folder with images | required* |
| `--config`, `-c` | YAML config file | – |
| `--output`, `-o` | Output PDF path | `photobook.pdf` |
| `--title`, `-t` | Book title | `My Photo Book` |
| `--author`, `-a` | Author name | empty |
| `--page-size` | `a4` / `a5` / `letter` | `a4` |
| `--orientation` | `portrait` / `landscape` | `portrait` |
| `--layout` | `auto` / `full` / `grid2` / `grid3` / `grid4` | `auto` |
| `--captions` | `filename` / `none` | `filename` |
| `--margin` | Margin in mm | `15` |
| `--recursive` | Scan subfolders | false |

\* Either `--images` or `--config` is required.

---

## YAML Config (recommended for larger books)

Create `book.yaml`:

```yaml
title: "Japan Trip 2026"
author: "You"
images: "./my_photos"
output: "output/japan_book.pdf"
page_size: a4
orientation: portrait
layout: auto
captions: filename
margin: 18
recursive: false

# Optional custom captions (overrides filename)
custom_captions:
  tokyo_tower.jpg: "Tokyo Tower at sunset"
  fuji_dawn.jpg: "Mount Fuji – early morning light"
```

Then run:

```bash
python src/photobook.py --config book.yaml
```

---

## Workflow Recommendation

1. **Collect & sort** photos (name them chronologically: `001_tokyo.jpg`, `002_kyoto.jpg` …)
2. **Optional**: write short captions in a YAML or just rely on nice filenames
3. **Generate** with `--layout auto` first
4. **Review** the PDF
5. **Re-run** with different layout (`full` or `grid2`) if you want denser pages
6. **Print** at 300 dpi (the tool embeds original resolution — use high-quality source images)

For professional print shops, keep a 3–5 mm bleed in mind and use the larger margin option.

---

## Project Structure

```
photobook-maker/
├── README.md
├── requirements.txt
├── src/
│   └── photobook.py          # main tool
├── examples/
│   ├── book.yaml             # sample config
│   └── images/               # put sample photos here
├── output/                   # generated PDFs land here
└── docs/
    └── WORKFLOW.md           # detailed workflow
```

---

## Tips for Best Design

- Use high-resolution images (at least 2000 px on the long side)
- Prefer consistent orientation within a spread
- `auto` layout gives the most “real book” feel
- For pure photo dumps, use `--layout full --captions none`
- Landscape orientation + `grid2` works beautifully for pairs of photos

---

## License

MIT – free to use, modify, and share.
