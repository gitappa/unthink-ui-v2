#!/bin/bash

# Script to update .env.local file from Gatsby to Next.js format
# This script replaces all GATSBY_ prefixes with NEXT_PUBLIC_

ENV_FILE=".env.local"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE not found!"
    exit 1
fi

# Create a backup
cp "$ENV_FILE" "${ENV_FILE}.backup"
echo "✓ Created backup: ${ENV_FILE}.backup"

# Replace GATSBY_ with NEXT_PUBLIC_ in the .env.local file
sed -i '' 's/GATSBY_/NEXT_PUBLIC_/g' "$ENV_FILE"

echo "✓ Updated all GATSBY_ prefixes to NEXT_PUBLIC_ in $ENV_FILE"
echo ""
echo "Next steps:"
echo "1. Review the changes in $ENV_FILE"
echo "2. Restart your development server: npm run dev"
echo "3. If something goes wrong, restore from backup: cp ${ENV_FILE}.backup $ENV_FILE"
