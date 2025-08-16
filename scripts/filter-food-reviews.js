const fs = require('fs');
const path = require('path');

// Keywords to exclude (non-food content)
const excludeKeywords = [
    'dog', 'dug', 'frenchie', 'frenchies', 'puppy', 'puppies',
    'cigar', 'cigars', 'smoke', 'whisky', 'whiskey', 'bourbon',
    'beer', 'alcohol', 'drink', 'drinks', 'pub', 'bar',
    'your shite', 'fuck', 'wanker', 'buddy', 'jigsaw',
    'george square', 'glasgow city chambers', 'cenotaph',
    'christmas', 'xmas', 'burns night', 'halloween',
    'jigsaw', 'puzzle', 'game', 'gaming',
    'work', 'office', 'home office', 'working from home',
    'perth', 'australia', 'marina', 'scenery',
    'frenchie', 'frenchies', 'dogsofinstagram', 'doglover'
];

// Keywords that indicate food content
const foodKeywords = [
    'burger', 'pizza', 'steak', 'chicken', 'fish', 'bacon',
    'breakfast', 'lunch', 'dinner', 'dessert', 'curry',
    'kebab', 'shawarma', 'tikka', 'biryani', 'naan',
    'chips', 'fries', 'rice', 'pasta', 'sandwich',
    'roll', 'bread', 'cake', 'cookie', 'brownie',
    'wings', 'nuggets', 'fillet', 'patty', 'sauce',
    'cheese', 'melt', 'grill', 'bbq', 'spicy',
    'delicious', 'amazing', 'fantastic', 'great', 'tasty',
    'food', 'meal', 'dish', 'cuisine', 'restaurant',
    'takeaway', 'delivery', 'eat', 'eating', 'dining',
    'kitchen', 'cook', 'cooking', 'chef', 'menu'
];

function isFoodContent(content) {
    const lowerContent = content.toLowerCase();
    
    // Check for exclusion keywords first
    for (const excludeKeyword of excludeKeywords) {
        if (lowerContent.includes(excludeKeyword)) {
            return false;
        }
    }
    
    // Check for food keywords
    for (const foodKeyword of foodKeywords) {
        if (lowerContent.includes(foodKeyword)) {
            return true;
        }
    }
    
    return false;
}

function cleanReviewFiles() {
    const reviewsDir = path.join(__dirname, '../content/reviews');
    const files = fs.readdirSync(reviewsDir);
    
    console.log(`Found ${files.length} review files to process...`);
    
    let deletedCount = 0;
    let keptCount = 0;
    
    files.forEach(filename => {
        if (!filename.endsWith('.md')) return;
        
        const filePath = path.join(reviewsDir, filename);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract the main content (after frontmatter)
        const contentMatch = content.match(/---\s*\n[\s\S]*?\n---\s*\n([\s\S]*)/);
        if (!contentMatch) return;
        
        const mainContent = contentMatch[1];
        
        if (isFoodContent(mainContent)) {
            keptCount++;
        } else {
            fs.unlinkSync(filePath);
            deletedCount++;
            console.log(`Deleted: ${filename}`);
        }
    });
    
    console.log(`\nCleaning completed:`);
    console.log(`- Kept: ${keptCount} food-related reviews`);
    console.log(`- Deleted: ${deletedCount} non-food posts`);
    console.log(`- Total remaining: ${keptCount}`);
}

// Run the cleaning process
cleanReviewFiles();
