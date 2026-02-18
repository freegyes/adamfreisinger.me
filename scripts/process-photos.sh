#!/usr/bin/env bash
set -euo pipefail

# Process photos for the gallery.
# Usage: ./scripts/process-photos.sh [input-dir]
# Default input: ./photos-input/

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
  # Generate kebab-case ID from filename (strip extension, lowercase, replace spaces/underscores)
  id=$(echo "${filename%.*}" | tr '[:upper:]' '[:lower:]' | sed 's/[_ ]/-/g' | sed 's/[^a-z0-9-]//g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//')

  # Check for duplicates
  if python3 -c "import json,sys; data=json.load(open('$DATA_FILE')); sys.exit(0 if any(p['id']=='$id' for p in data) else 1)" 2>/dev/null; then
    echo "Skipping $filename — ID '$id' already exists in photos.json"
    continue
  fi

  echo "Processing: $filename → $id"

  # Get dimensions before stripping EXIF
  width=$(sips -g pixelWidth "$file" | tail -1 | awk '{print $2}')
  height=$(sips -g pixelHeight "$file" | tail -1 | awk '{print $2}')

  # Convert HEIC to JPG if needed, then strip metadata (preserving ICC profile)
  ext="${filename##*.}"
  ext_lower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')
  dest_file="$OUTPUT_DIR/${id}.jpg"

  if [ "$ext_lower" = "heic" ]; then
    sips -s format jpeg "$file" --out "$dest_file" >/dev/null
  else
    cp "$file" "$dest_file"
  fi

  # Strip only privacy-sensitive metadata, preserve everything photographic
  # (ICC profile, camera/lens model, focal length, aperture, ISO, white balance, etc.)
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
    'src': '/assets/images/photos/${id}.jpg',
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
