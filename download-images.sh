#!/bin/bash

# Create directories if they don't exist
mkdir -p images/logos
mkdir -p images/features
mkdir -p images/backgrounds
mkdir -p images/stories

# Download logo
echo "Downloading logo..."
# Replace with a command to download a modern location/navigation logo
# For example, you could use a stock image service or generate one

# Download background image for hero section
echo "Downloading hero background..."
curl -o images/backgrounds/dark-map-bg.jpg "https://images.unsplash.com/photo-1578849278619-e73a158e2e18?q=80&w=2000&auto=format&fit=crop"

# Download feature images
echo "Downloading feature images..."
curl -o images/features/map-view.jpg "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
curl -o images/features/navigation.jpg "https://images.unsplash.com/photo-1581300134629-4e3a20ae61cc?q=80&w=1200&auto=format&fit=crop"
curl -o images/features/search.jpg "https://images.unsplash.com/photo-1508802449184-92a9c2594192?q=80&w=1200&auto=format&fit=crop"
curl -o images/features/data-insights.jpg "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"

# Download client logos (for demonstration - would need real logos in production)
echo "Downloading client logos..."
# These should be replaced with actual client logos in production
# For now we're using placeholder URLs

# Download customer story images
echo "Downloading customer story images..."
curl -o images/stories/automotive.jpg "https://images.unsplash.com/photo-1545674899-10b4e700280a?q=80&w=1200&auto=format&fit=crop"

echo "Image downloading complete. Some images may need to be sourced manually."
echo "For logos, consider using SVG files for better quality."