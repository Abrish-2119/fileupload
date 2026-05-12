#!/bin/bash

echo "🚀 Deploying File Upload App..."

# Build the React app
echo "📦 Building React app..."
npm run build

# Add all changes
echo "📝 Staging files..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy to production - $(date)"

# Push to production (Heroku)
if command -v heroku &> /dev/null; then
    echo "🌐 Deploying to Heroku..."
    git push heroku main
    
    echo "✅ Deployment complete!"
    echo "🔗 Your app is live at: $(heroku info -s | grep web_url | cut -d= -f2)"
else
    echo "❌ Heroku CLI not found. Please install it first:"
    echo "npm install -g heroku"
fi
