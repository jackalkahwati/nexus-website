#!/bin/bash

echo "Nexus Website Image Optimizer"
echo "============================"
echo "This script will optimize all images in the images directory."
echo "Requires: ImageMagick (convert command)"
echo ""

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick is not installed. Please install it first."
    echo "On macOS: brew install imagemagick"
    echo "On Ubuntu/Debian: sudo apt-get install imagemagick"
    exit 1
fi

# Optimize JPG files
echo "Optimizing JPG files..."
find ./images -name "*.jpg" -type f -exec convert {} -strip -quality 85 -resize "1200x>" {} \;

# Optimize PNG files (except logos which need transparency)
echo "Optimizing PNG files (except logos)..."
find ./images -path "./images/logos" -prune -o -name "*.png" -type f -exec convert {} -strip -quality 85 {} \;

# Special handling for logo files to maintain transparency
echo "Optimizing logo files while preserving transparency..."
find ./images/logos -name "*.png" -type f -exec convert {} -strip -quality 95 {} \;

# Convert eligible images to WebP for modern browsers
echo "Creating WebP versions of images..."
find ./images -name "*.jpg" -o -name "*.png" | while read img; do
  webp_path="${img%.*}.webp"
  convert "$img" -quality 85 "$webp_path"
done

echo ""
echo "Image optimization complete!"
echo "----------------------------"
echo "All images have been optimized and WebP versions have been created."
echo "Don't forget to update your HTML to use the picture element with WebP sources."
echo ""
echo "Example HTML:"
echo "<picture>"
echo "  <source srcset=\"path/to/image.webp\" type=\"image/webp\">"
echo "  <img src=\"path/to/image.jpg\" alt=\"Description\">"
echo "</picture>"