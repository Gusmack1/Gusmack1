@echo off
echo 🚀 Starting GusMack1 Food Reviews Deployment...

echo 📝 Configuring git...
git config --global core.autocrlf true
git config --global user.name "GusMack1"
git config --global user.email "gusmack1@gmail.com"

echo 📁 Adding files to git...
git add .

echo 💾 Committing changes...
git commit -m "feat: Add 532 Instagram food reviews with exact content - Extracted from Instagram data - Filtered non-food content - Structured markdown format - Glasgow food focus"

echo ⬆️ Pushing to GitHub...
git push origin main --force

echo ✅ Deployment completed!
echo 🌐 Check your website at: https://gusmack1.com
pause
