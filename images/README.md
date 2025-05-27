# Nexus Website Images

This directory contains all the images for the Nexus location intelligence platform website.

## Obtaining Images

There are two ways to obtain the necessary images:

1. **Run the download script**: Execute the `download-images.sh` script in the root directory:
   ```
   bash download-images.sh
   ```
   This will download placeholder images from Unsplash.

2. **Manual replacement**: Replace the placeholder images with professionally designed ones that better match your brand.

## Image Requirements

### Logo (`logo.png`)
- A professional logo that fits with the transportation/location intelligence theme
- Should be visible on dark backgrounds (preferably white or light colored)
- Optimal size: at least 200px width, with transparent background

### Background Images
- `backgrounds/dark-map-bg.jpg`: Dark-themed map background showing navigation points
- Should be at least 1920px wide for full-screen displays

### Feature Images (all should be 16:9 ratio)
- `features/map-view.jpg`: 3D map visualization showing vehicle tracking
- `features/navigation.jpg`: Navigation interface showing routes
- `features/search.jpg`: Address search or location finding interface
- `features/data-insights.jpg`: Data visualization of fleet analytics

### Client Logos
- `logos/logo1.png` through `logos/logo5.png`: Client logos
- Should be white or light colored to be visible on the dark background
- Will be displayed with the CSS filter: `filter: brightness(0) invert(1)`

### Customer Stories
- `stories/automotive.jpg`: Smart city or autonomous vehicle concept image
- `client-logo.png`: Logo of the featured client

## Image Optimization

For production, all images should be:
- Compressed for web (consider using WebP format for modern browsers)
- Properly sized to avoid excessive downloads
- Include proper alt text in the HTML

## Accessibility Considerations

- All images should have appropriate alternative text
- Avoid text within images where possible
- Ensure sufficient contrast for any text overlaying images