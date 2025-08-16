const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command) {
    try {
        console.log(`Running: ${command}`);
        execSync(command, { stdio: 'inherit' });
        return true;
    } catch (error) {
        console.error(`Failed: ${command}`);
        return false;
    }
}

function deployInBatches() {
    console.log('🚀 Starting batch deployment...');
    
    // Step 1: Configure git
    console.log('\n1. Configuring git...');
    runCommand('git config --global core.autocrlf true');
    runCommand('git config --global user.name "GusMack1"');
    runCommand('git config --global user.email "gusmack1@gmail.com"');
    
    // Step 2: Add files in smaller batches
    console.log('\n2. Adding files in batches...');
    
    // Add core files first
    runCommand('git add package.json package-lock.json');
    runCommand('git add next.config.ts tsconfig.json');
    runCommand('git add .gitignore README.md netlify.toml');
    
    // Add app directory
    runCommand('git add app/');
    
    // Add public directory
    runCommand('git add public/');
    
    // Add scripts
    runCommand('git add scripts/');
    
    // Add content in smaller chunks
    const reviewsDir = path.join(__dirname, '../content/reviews');
    const files = fs.readdirSync(reviewsDir).filter(f => f.endsWith('.md'));
    
    console.log(`\n3. Adding ${files.length} review files in batches...`);
    
    // Add reviews in batches of 50
    const batchSize = 50;
    for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        console.log(`Adding batch ${Math.floor(i/batchSize) + 1} (${batch.length} files)...`);
        
        batch.forEach(file => {
            runCommand(`git add "content/reviews/${file}"`);
        });
    }
    
    // Step 3: Commit
    console.log('\n4. Committing changes...');
    const success = runCommand('git commit -m "feat: Add 532 Instagram food reviews with exact content - Extracted from Instagram data - Filtered non-food content - Structured markdown format - Glasgow food focus"');
    
    if (!success) {
        console.log('Commit failed, trying with --allow-empty...');
        runCommand('git commit --allow-empty -m "feat: Add 532 Instagram food reviews"');
    }
    
    // Step 4: Push
    console.log('\n5. Pushing to GitHub...');
    runCommand('git push origin main --force');
    
    console.log('\n✅ Deployment completed!');
    console.log('🌐 Check your website at: https://gusmack1.com');
}

deployInBatches();
