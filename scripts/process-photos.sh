#!/usr/bin/env bash
set -euo pipefail

# Process photos for the gallery.
# Usage: ./scripts/process-photos.sh [input-dir]
# Default input: ./photos-input/
#
# For each photo found:
#   - Prompts for a YYYY-MM capture date
#   - Generates ID as YYYY-MM-<OriginalBasename> (original capitalization preserved)
#   - Strips privacy-sensitive EXIF (GPS, serial numbers, etc.)
#   - Appends entry to _data/photos.json with captureDate and active:true
#   - Moves original to photos-input/done/

INPUT_DIR="${1:-./photos-input}"
OUTPUT_DIR="./assets/images/photos"
DATA_FILE="./_data/photos.json"
DONE_DIR="${INPUT_DIR}/done"

# Ensure dependencies
command -v exiftool >/dev/null 2>&1 || { echo "Error: exiftool is required. Install with: brew install exiftool"; exit 1; }
command -v sips >/dev/null 2>&1 || { echo "Error: sips is required (macOS)."; exit 1; }

# Ensure directories exist
mkdir -p "$OUTPUT_DIR" "$DONE_DIR"

# Ensure data file exists
if [ ! -f "$DATA_FILE" ]; then
  echo "[]" > "$DATA_FILE"
fi

# Process each image file
shopt -s nullglob
count=0
files=("$INPUT_DIR"/*.jpg "$INPUT_DIR"/*.jpeg "$INPUT_DIR"/*.png "$INPUT_DIR"/*.JPG "$INPUT_DIR"/*.JPEG "$INPUT_DIR"/*.PNG "$INPUT_DIR"/*.heic "$INPUT_DIR"/*.HEIC)
for file in "${files[@]}"; do
  [ -f "$file" ] || continue

  filename=$(basename "$file")
  # Preserve original capitalization; strip extension only
  basename_noext="${filename%.*}"

  # Prompt for capture date
  while true; do
    read -rp "Capture date for $filename (YYYY-MM): " capture_date
    if [[ "$capture_date" =~ ^[0-9]{4}-[0-9]{2}$ ]]; then
      break
    fi
    echo "  Invalid format. Enter as YYYY-MM (e.g. 2023-08)"
  done

  # Build the ID: YYYY-MM-OriginalBasename (original capitalization)
  id="${capture_date}-${basename_noext}"

  # Duplicate check by ID (exact match)
  if python3 -c "import json,sys; data=json.load(open('$DATA_FILE')); sys.exit(0 if any(p['id']=='$id' for p in data) else 1)" 2>/dev/null; then
    echo "⚠ Skipping $filename — ID '$id' already exists in photos.json"
    continue
  fi

  # Duplicate check by original filename (catches same file added under a different date)
  if python3 -c "
import json, sys
data = json.load(open('$DATA_FILE'))
target = '${basename_noext}'
for p in data:
    parts = p['id'].split('-', 2)
    existing_basename = parts[2] if len(parts) >= 3 else p['id']
    if existing_basename == target:
        print('⚠ Skipping ${filename} — filename already in archive as ' + p['id'], file=sys.stderr)
        sys.exit(0)
sys.exit(1)
" 2>&1; then
    continue
  fi

  echo "Processing: $filename → $id"

  # Get dimensions before stripping EXIF
  width=$(sips -g pixelWidth "$file" | tail -1 | awk '{print $2}')
  height=$(sips -g pixelHeight "$file" | tail -1 | awk '{print $2}')

  # Convert HEIC to JPG if needed; keep original filename for dest
  ext="${filename##*.}"
  ext_lower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')
  dest_file="$OUTPUT_DIR/${basename_noext}.jpg"

  if [ "$ext_lower" = "heic" ]; then
    sips -s format jpeg "$file" --out "$dest_file" >/dev/null
  else
    cp "$file" "$dest_file"
  fi

  # Strip only privacy-sensitive metadata, preserve photographic EXIF
  exiftool -m \
    '-GPS*=' \
    -SerialNumber= \
    -InternalSerialNumber= \
    -LensSerialNumber= \
    -OwnerName= \
    -Artist= \
    -XPAuthor= \
    -Creator= \
    '-By-line=' \
    -Software= \
    -HostComputer= \
    -ImageUniqueID= \
    -OriginalDocumentID= \
    -DocumentID= \
    -InstanceID= \
    -ThumbnailImage= \
    -PreviewImage= \
    -overwrite_original "$dest_file"

  # Append to photos.json
  python3 -c "
import json
with open('$DATA_FILE', 'r') as f:
    data = json.load(f)
data.append({
    'id': '$id',
    'src': '/assets/images/photos/${basename_noext}.jpg',
    'captureDate': '$capture_date',
    'active': True,
    'width': $width,
    'height': $height
})
with open('$DATA_FILE', 'w') as f:
    json.dump(data, f, indent=2)
    f.write('\n')
"

  # Move original to done/
  mv "$file" "$DONE_DIR/"

  count=$((count + 1))
  echo "  ✓ Added $id (${width}×${height})"
done

if [ $count -eq 0 ]; then
  echo "No new photos found in $INPUT_DIR"
else
  echo ""
  echo "Processed $count photo(s). Run 'npm run build' to generate responsive variants."
fi
