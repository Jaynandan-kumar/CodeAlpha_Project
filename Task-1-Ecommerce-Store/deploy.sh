#!/bin/bash

# ShopVerse Vercel Deployment Script
# This script automates the deployment process

echo "🚀 ShopVerse Deployment Script"
echo "================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed"
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if logged in to Vercel
echo "🔐 Checking Vercel authentication..."
vercel whoami
if [ $? -ne 0 ]; then
    echo "❌ Not logged in to Vercel"
    echo "Please run: vercel login"
    exit 1
fi

echo ""
echo "✅ Vercel CLI is ready"
echo ""

# Deploy Backend
echo "📦 Deploying Backend..."
echo "--------------------------------"
cd backend

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found in backend/"
    echo "Please create .env with required environment variables"
    echo "See DEPLOYMENT_GUIDE.md for details"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "Deploying backend to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Backend deployed successfully!"
    BACKEND_URL=$(vercel ls --meta | grep -o 'https://[^ ]*' | head -1)
    echo "Backend URL: $BACKEND_URL"
else
    echo "❌ Backend deployment failed"
    exit 1
fi

cd ..

echo ""
echo "📦 Deploying Frontend..."
echo "--------------------------------"

# Build frontend first
echo "Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo "Deploying frontend to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Frontend deployed successfully!"
    FRONTEND_URL=$(vercel ls --meta | grep -o 'https://[^ ]*' | head -1)
    echo "Frontend URL: $FRONTEND_URL"
else
    echo "❌ Frontend deployment failed"
    exit 1
fi

echo ""
echo "================================"
echo "✅ DEPLOYMENT COMPLETE!"
echo "================================"
echo ""
echo "📍 Production URLs:"
echo "   Frontend: $FRONTEND_URL"
echo "   Backend:  $BACKEND_URL"
echo ""
echo "🔧 Next Steps:"
echo "   1. Set environment variables in Vercel Dashboard"
echo "   2. Update FRONTEND_URL in backend environment"
echo "   3. Redeploy backend: cd backend && vercel --prod"
echo "   4. Test the application"
echo "   5. See DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
echo "🎉 Your ShopVerse e-commerce platform is live!"
