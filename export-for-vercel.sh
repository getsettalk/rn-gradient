#!/bin/bash

# Create a temporary directory for the project
mkdir -p temp_export

# Copy all essential files except node_modules, .git, etc.
cp -r src temp_export/
cp -r public temp_export/ 2>/dev/null || :
cp -r client temp_export/
cp -r shared temp_export/
cp package.json package-lock.json vercel.json vite.config.ts tsconfig.json README.md temp_export/ 2>/dev/null || :
cp .gitignore temp_export/ 2>/dev/null || :
cp index.html temp_export/ 2>/dev/null || :
cp theme.json temp_export/ 2>/dev/null || :
cp tailwind.config.ts postcss.config.js temp_export/ 2>/dev/null || :

echo "Files exported to temp_export directory."
echo "Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Push the contents of temp_export to that repository"
echo "3. Follow the Vercel deployment steps in README.md"