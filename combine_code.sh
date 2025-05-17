#!/bin/bash

# Output file to store all code
output_file="all_code.txt"

# Start fresh
> "$output_file"

# Find all code files and append their content to the output file
find . -type f \( -name "*.js" -o -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.css" -o -name "*.yml" -o -name "*.yaml" -o -name "*.html" -o -name "*.md" -o -name "*.sh" -o -name "*.jsx" \) -print | while read file; do
    echo "===== $file =====" >> "$output_file"
    cat "$file" >> "$output_file"
    echo -e "\n" >> "$output_file"
done

echo "All code has been combined into $output_file."
