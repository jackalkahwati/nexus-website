#!/bin/bash

# Update all imports of cn from utils to the new location
find . -type f \( -name "*.tsx" -o -name "*.ts" \) -not -path "./node_modules/*" -not -path "./.next/*" -exec sed -i '' \
  -e 's/import[[:space:]]*{[[:space:]]*cn[[:space:]]*}[[:space:]]*from[[:space:]]*["'\'']\(.*\)\/utils["'\'']/import { cn } from "@\/lib\/cn"/g' \
  -e 's/import[[:space:]]*{[[:space:]]*cn[[:space:]]*,[[:space:]]*.*}[[:space:]]*from[[:space:]]*["'\'']\(.*\)\/utils["'\'']/import { cn } from "@\/lib\/cn"/g' \
  -e 's/import[[:space:]]*{[[:space:]]*.*,[[:space:]]*cn[[:space:]]*}[[:space:]]*from[[:space:]]*["'\'']\(.*\)\/utils["'\'']/import { cn } from "@\/lib\/cn"/g' \
  -e 's/import[[:space:]]*{[[:space:]]*.*,[[:space:]]*cn[[:space:]]*,[[:space:]]*.*}[[:space:]]*from[[:space:]]*["'\'']\(.*\)\/utils["'\'']/import { cn } from "@\/lib\/cn"/g' \
  {} \; 