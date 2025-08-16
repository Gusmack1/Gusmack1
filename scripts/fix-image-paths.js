const fs = require('fs');
const path = require('path');

function fixImagePaths() {
    const reviewsDir = path.join(__dirname, '../content/reviews');
    const files = fs.readdirSync(reviewsDir);
    
    console.log(`Fixing image paths in ${files.length} review files...`);
    
    let fixedCount = 0;
    
    files.forEach(filename => {
        if (!filename.endsWith('.md')) return;
        
        const filePath = path.join(reviewsDir, filename);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Extract timestamp from filename
        const timestampMatch = filename.match(/-(\d+)\.md$/);
        if (!timestampMatch) return;
        
        const timestamp = timestampMatch[1];
        
        // Create shorter image paths
        const shortSlug = filename.replace(/-\d+\.md$/, '').substring(0, 30);
        
        // Replace long image paths with shorter ones
        const oldImagePattern = /\/images\/reviews\/[^']+\.jpg/g;
        const newImagePaths = [];
        
        // Generate new image paths
        for (let i = 1; i <= 4; i++) {
            newImagePaths.push(`/images/reviews/${shortSlug}-${timestamp}-${i}.jpg`);
        }
        
        // Replace featured image
        content = content.replace(
            /featuredImage: '[^']+'/,
            `featuredImage: '${newImagePaths[0]}'`
        );
        
        // Replace images array
        const imagesStart = content.indexOf('images:');
        const imagesEnd = content.indexOf('pros:');
        
        if (imagesStart !== -1 && imagesEnd !== -1) {
            const imagesSection = content.substring(imagesStart, imagesEnd);
            const newImagesSection = `images:
${newImagePaths.map(img => `  - '${img}'`).join('\n')}`;
            
            content = content.replace(imagesSection, newImagesSection);
        }
        
        // Write the updated content
        fs.writeFileSync(filePath, content);
        fixedCount++;
    });
    
    console.log(`Fixed image paths in ${fixedCount} files`);
}

// Run the fix
fixImagePaths();
