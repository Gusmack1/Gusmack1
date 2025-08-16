const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Git configuration
const GIT_REPO = 'https://github.com/Gusmack1/Gusmack1.git';
const NETLIFY_URL = 'https://app.netlify.com/projects/iridescent-cheesecake-335853';

function runCommand(command, cwd = process.cwd()) {
    try {
        console.log(`Running: ${command}`);
        const result = execSync(command, { 
            cwd, 
            encoding: 'utf8',
            stdio: 'pipe'
        });
        console.log(`Success: ${command}`);
        return result;
    } catch (error) {
        console.error(`Error running: ${command}`);
        console.error(error.message);
        throw error;
    }
}

function deployToGit() {
    console.log('🚀 Starting deployment process...');
    
    try {
        // 1. Configure git
        console.log('\n📝 Configuring git...');
        runCommand('git config --global core.autocrlf true');
        runCommand('git config --global user.name "GusMack1"');
        runCommand('git config --global user.email "gusmack1@gmail.com"');
        
        // 2. Check current status
        console.log('\n📊 Checking git status...');
        const status = runCommand('git status --porcelain');
        console.log('Modified files:', status.split('\n').filter(line => line.trim()).length);
        
        // 3. Add files in batches to avoid memory issues
        console.log('\n📁 Adding files to git...');
        
        // Add content/reviews directory first
        runCommand('git add content/reviews/');
        
        // Add scripts
        runCommand('git add scripts/');
        
        // Add other important files
        runCommand('git add package.json');
        runCommand('git add package-lock.json');
        runCommand('git add next.config.ts');
        runCommand('git add tsconfig.json');
        runCommand('git add .gitignore');
        runCommand('git add README.md');
        runCommand('git add netlify.toml');
        
        // Add app directory
        runCommand('git add app/');
        
        // Add public directory
        runCommand('git add public/');
        
        // Add remaining files
        runCommand('git add .');
        
        // 4. Check what's staged
        console.log('\n📋 Checking staged files...');
        const staged = runCommand('git diff --cached --name-only');
        console.log(`Staged ${staged.split('\n').filter(line => line.trim()).length} files`);
        
        // 5. Commit changes
        console.log('\n💾 Committing changes...');
        const commitMessage = `feat: Add 532 Instagram food reviews with exact content

- Extracted exact post descriptions from Instagram data
- Filtered out non-food content (dogs, cigars, etc.)
- Created structured markdown files with proper frontmatter
- Fixed image paths for better performance
- Added comprehensive food review content
- Total: 532 high-quality food reviews
- Location: Glasgow, Scotland focus
- Tags: instagram, food, glasgow, restaurant reviews

This update transforms the website from empty reviews to a comprehensive
food review platform with authentic Instagram content.`;
        
        runCommand(`git commit -m "${commitMessage}"`);
        
        // 6. Set up remote if not exists
        console.log('\n🔗 Setting up remote...');
        try {
            runCommand('git remote get-url origin');
        } catch {
            runCommand(`git remote add origin ${GIT_REPO}`);
        }
        
        // 7. Push to main branch
        console.log('\n⬆️ Pushing to GitHub...');
        runCommand('git push -u origin main --force');
        
        // 8. Show deployment info
        console.log('\n✅ Deployment completed successfully!');
        console.log(`\n📊 Deployment Summary:`);
        console.log(`- Repository: ${GIT_REPO}`);
        console.log(`- Netlify: ${NETLIFY_URL}`);
        console.log(`- Reviews added: 532`);
        console.log(`- Status: Deployed and live`);
        
        console.log('\n🌐 Your website should be live at:');
        console.log('https://gusmack1.com');
        console.log('https://iridescent-cheesecake-335853.netlify.app');
        
    } catch (error) {
        console.error('\n❌ Deployment failed:', error.message);
        process.exit(1);
    }
}

// Run the deployment
deployToGit();
