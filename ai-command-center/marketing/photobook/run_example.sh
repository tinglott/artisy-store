#!/usr/bin/env bash
# Quick demo runner – generates a sample book if images are present

set -e
cd "$(dirname "$0")"

if [ ! -d .venv ]; then
  echo "Creating virtual environment..."
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt
else
  source .venv/bin/activate
fi

mkdir -p output

# Check for images
IMG_COUNT=$(find examples/images -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) 2>/dev/null | wc -l)

if [ "$IMG_COUNT" -eq 0 ]; then
  echo "No sample images found in examples/images/"
  echo "Please copy some .jpg or .png files there, then re-run this script."
  echo ""
  echo "Example:"
  echo "  cp /path/to/your/photos/*.jpg examples/images/"
  echo "  ./run_example.sh"
  exit 0
fi

echo "Found $IMG_COUNT images. Generating sample book..."
python src/photobook.py --config examples/book.yaml

echo ""
echo "Done! Open: output/sample_book.pdf"
