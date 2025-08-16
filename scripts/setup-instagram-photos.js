const fs = require('fs');
const path = require('path');

// Create directories for photos
const publicDir = path.join(__dirname, '../public/images');
const restaurantsDir = path.join(publicDir, 'restaurants');
const dishesDir = path.join(publicDir, 'dishes');

// Create directories if they don't exist
[publicDir, restaurantsDir, dishesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Instagram data mapping - exact photo filenames to restaurant reviews
const photoMapping = {
  'mahonys-steakhouse-bishopbriggs': {
    photos: [
      '367671275_3440387326225548_7205436968547403869_n_17975674130294912.heic'
    ],
    content: 'The greatest burger of all time, or was it? Only one way to find out. This is the 12oz mahony\'s burger.'
  },
  'dominos-pizza-glasgow': {
    photos: [
      '367671275_3440387326225548_7205436968547403869_n_17975674130294912.heic',
      '361734839_1750369278710901_6925415132522764133_n_17985439460192856.heic',
      '361799762_1022252015621214_8064318593596838578_n_18229909489170529.heic'
    ],
    content: 'Get a piece of this tonight for dinner. Epic pizza from dominos last night. 1x Large 13.5" Half & Half + Thin & Crispy Large 13.5" Mighty Meaty® No Onions No Ham Pineapple Extra Mozzarella Cheese Large 13.5" Meateor™ Green Jalapeños Hotdog Slices Extra Pepperoni Extra Mozzarella Cheese'
  }
};

// Copy photos function
function copyPhotos() {
  const instagramDir = path.join(__dirname, '../instagram-gusmack1-2025-08-15-WIAqpO3X/your_instagram_activity/media');
  
  Object.entries(photoMapping).forEach(([restaurant, data]) => {
    data.photos.forEach((photoFile, index) => {
      const sourcePath = path.join(instagramDir, 'other', photoFile);
      const altSourcePath = path.join(instagramDir, 'posts/202307', photoFile);
      
      let sourceExists = fs.existsSync(sourcePath);
      let actualSourcePath = sourcePath;
      
      if (!sourceExists) {
        sourceExists = fs.existsSync(altSourcePath);
        actualSourcePath = altSourcePath;
      }
      
      if (sourceExists) {
        const destPath = path.join(restaurantsDir, `${restaurant}-${index + 1}.jpg`);
        try {
          fs.copyFileSync(actualSourcePath, destPath);
          console.log(`✅ Copied: ${photoFile} -> ${destPath}`);
        } catch (error) {
          console.log(`❌ Failed to copy ${photoFile}: ${error.message}`);
        }
      } else {
        console.log(`⚠️  Photo not found: ${photoFile}`);
      }
    });
  });
}

// Update review files with correct photo paths
function updateReviews() {
  const reviewsDir = path.join(__dirname, '../content/reviews');
  
  Object.entries(photoMapping).forEach(([restaurant, data]) => {
    const reviewFile = path.join(reviewsDir, `${restaurant}.md`);
    
    if (fs.existsSync(reviewFile)) {
      let content = fs.readFileSync(reviewFile, 'utf8');
      
      // Update images array with correct photo paths
      const imagePaths = data.photos.map((_, index) => `/images/restaurants/${restaurant}-${index + 1}.jpg`);
      
      // Update the images in the frontmatter
      const imagesRegex = /images:\s*\[([^\]]*)\]/;
      if (imagesRegex.test(content)) {
        content = content.replace(imagesRegex, `images: [${imagePaths.map(p => `"${p}"`).join(', ')}]`);
      }
      
      fs.writeFileSync(reviewFile, content);
      console.log(`✅ Updated review: ${restaurant}.md`);
    }
  });
}

console.log('🚀 Setting up Instagram photos...');
copyPhotos();
updateReviews();
console.log('✅ Photo setup complete!');
