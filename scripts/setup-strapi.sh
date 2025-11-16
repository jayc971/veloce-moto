#!/bin/bash

# Veloce Moto - Strapi Setup Script
# This script helps you set up a Strapi backend for Veloce Moto

echo "🚀 Veloce Moto - Strapi Setup"
echo "=============================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the Veloce Moto root directory."
    exit 1
fi

# Move to parent directory to create Strapi project
cd ..

echo "📁 Creating Strapi project in ../veloce-moto-backend"
echo ""

# Check if Strapi backend already exists
if [ -d "veloce-moto-backend" ]; then
    echo "⚠️  Warning: veloce-moto-backend directory already exists."
    read -p "Do you want to delete it and start fresh? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf veloce-moto-backend
        echo "✓ Removed existing directory"
    else
        echo "❌ Setup cancelled"
        exit 1
    fi
fi

# Create Strapi project
echo "📦 Installing Strapi (this may take a few minutes)..."
npx create-strapi-app@latest veloce-moto-backend --quickstart --no-run

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to create Strapi project"
    exit 1
fi

echo ""
echo "✅ Strapi backend created successfully!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Start Strapi backend:"
echo "   cd veloce-moto-backend"
echo "   npm run develop"
echo ""
echo "2. Create admin user at http://localhost:1337/admin"
echo ""
echo "3. Follow the STRAPI_INTEGRATION_GUIDE.md to:"
echo "   - Create Product and Category content types"
echo "   - Configure permissions"
echo "   - Add sample data"
echo ""
echo "4. Create .env.local in your frontend project:"
echo "   cd veloce-moto"
echo "   cp .env.example .env.local"
echo ""
echo "5. Start the frontend:"
echo "   npm run dev"
echo ""
echo "📚 Full guide: veloce-moto/STRAPI_INTEGRATION_GUIDE.md"
echo ""
