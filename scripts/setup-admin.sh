#!/bin/bash

# Setup Admin User Script
# This script helps you create an admin user for the Hadona Digital Media portfolio

echo "🔧 Setting up Admin User for Hadona Digital Media Portfolio"
echo "============================================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ Error: .env.local file not found!"
  echo "Please create .env.local with your Supabase credentials."
  exit 1
fi

# Load environment variables
export $(grep -v '^#' .env.local | xargs)

# Check if Supabase URL is set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  echo "❌ Error: NEXT_PUBLIC_SUPABASE_URL not found in .env.local"
  exit 1
fi

echo "📧 Enter admin email (default: admin@hadona.id):"
read ADMIN_EMAIL
ADMIN_EMAIL=${ADMIN_EMAIL:-admin@hadona.id}

echo "🔑 Enter admin password (default: Admin@123456):"
read -s ADMIN_PASSWORD
ADMIN_PASSWORD=${ADMIN_PASSWORD:-Admin@123456}

echo ""
echo "Creating admin user..."
echo ""

# Run the TypeScript script
npx tsx scripts/create-admin.ts "$ADMIN_EMAIL" "$ADMIN_PASSWORD"

echo ""
echo "✅ Setup complete! You can now login at:"
echo "   http://localhost:3000/admin/login"
