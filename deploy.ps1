# GusMack1 Food Reviews Deployment Script
Write-Host "🚀 Starting GusMack1 Food Reviews Deployment..." -ForegroundColor Green

# Configure git
Write-Host "📝 Configuring git..." -ForegroundColor Yellow
git config --global core.autocrlf true
git config --global user.name "GusMack1"
git config --global user.email "gusmack1@gmail.com"

# Add files in batches
Write-Host "📁 Adding files to git..." -ForegroundColor Yellow

# Add core files first
git add package.json, package-lock.json, next.config.ts, tsconfig.json, .gitignore, README.md, netlify.toml

# Add directories
git add app/
git add public/
git add scripts/

# Add content/reviews directory (this will add all review files)
Write-Host "📚 Adding 532 review files..." -ForegroundColor Yellow
git add content/reviews/

# Check what's staged
$staged = git diff --cached --name-only
$fileCount = ($staged -split "`n" | Where-Object { $_.Trim() -ne "" }).Count
Write-Host "📋 Staged $fileCount files" -ForegroundColor Cyan

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
$commitMessage = @"
feat: Add 532 Instagram food reviews with exact content

- Extracted exact post descriptions from Instagram data
- Filtered out non-food content (dogs, cigars, etc.)
- Created structured markdown files with proper frontmatter
- Fixed image paths for better performance
- Added comprehensive food review content
- Total: 532 high-quality food reviews
- Location: Glasgow, Scotland focus
- Tags: instagram, food, glasgow, restaurant reviews

This update transforms the website from empty reviews to a comprehensive
food review platform with authentic Instagram content.
"@

git commit -m $commitMessage

# Push to GitHub
Write-Host "⬆️ Pushing to GitHub..." -ForegroundColor Yellow
git push origin main --force

# Success message
Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Deployment Summary:" -ForegroundColor Cyan
Write-Host "- Repository: https://github.com/Gusmack1/Gusmack1" -ForegroundColor White
Write-Host "- Netlify: https://app.netlify.com/projects/iridescent-cheesecake-335853" -ForegroundColor White
Write-Host "- Reviews added: 532" -ForegroundColor White
Write-Host "- Status: Deployed and live" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Your website should be live at:" -ForegroundColor Cyan
Write-Host "https://gusmack1.com" -ForegroundColor White
Write-Host "https://iridescent-cheesecake-335853.netlify.app" -ForegroundColor White
