const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const sharp = require('sharp');

// Function to copy and convert images
async function copyAndConvertImage(sourcePath, destinationPath) {
  try {
    // Create destination directory if it doesn't exist
    const destDir = path.dirname(destinationPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    const ext = path.extname(sourcePath).toLowerCase();
    
    // If it's a HEIC file, convert to JPG
    if (ext === '.heic') {
      const jpgPath = destinationPath.replace('.heic', '.jpg');
      await sharp(sourcePath)
        .jpeg({ quality: 85 })
        .toFile(jpgPath);
      return jpgPath;
    } else {
      // Copy other formats as-is
      fs.copyFileSync(sourcePath, destinationPath);
      return destinationPath;
    }
  } catch (error) {
    console.error(`Error processing image ${sourcePath}:`, error.message);
    return null;
  }
}

// Enhanced location extraction function
function extractLocationData(post) {
  const caption = post.media[0].title || '';
  let locationName = '';
  let coordinates = null;
  
  // Extract GPS coordinates from the first media item
  const exifData = post.media[0].media_metadata?.photo_metadata?.exif_data;
  if (exifData) {
    const gpsData = exifData.find(data => data.latitude && data.longitude && data.latitude !== 0);
    if (gpsData) {
      coordinates = {
        latitude: gpsData.latitude,
        longitude: gpsData.longitude
      };
    }
  }
  
  // Extract restaurant mentions from caption (@ mentions)
  const allMentions = caption.match(/@[\w.]+/g) || [];
  const cleanedMentions = allMentions.map(m => m.replace('@', '').replace(/\.$/, ''));
  
  // Filter out common non-restaurant mentions
  const nonRestaurantMentions = [
    'irnbru', 'asda', 'morrisons', 'lidlgb', 'aldiscotland', 'lurpakuk', 'hpsauceofficial', 
    'heinz_uk', 'hovisbakery', 'cadburyuk', 'tennentslager', 'marksandspencer', 'greggs_official',
    'ubereats_uk', 'justeatuk', 'nhsggc', 'glasgowlive', 'ratemytakeawayofficial', 'dannymalinofficial',
    'macsweenhaggis', 'bistogravyuk', 'togetherboxuk', 'ridebrewco', 'outlandishbrewco', 
    'officialwholesomewolf', 'myscottishlifestyle', 'chloejebb', 'dapog82', 'guyforallseasons',
    'beardmeatsfood', 'therealtamcowan', 'kenny_diver', 'gusmack1', 'boydholbrook', 'smokingriddle',
    'brgrscot', 'bathstburger', 'ihg', 'zoltansz84', 'grandcentralglasgow', 'innisandgunn_',
    'ginmickey', 'bellaandfuriends', 'kgd_1987'
  ];
  
  const restaurantMentions = cleanedMentions.filter(mention => 
    !nonRestaurantMentions.includes(mention.toLowerCase())
  );
  
  if (restaurantMentions.length > 0) {
    // Clean up restaurant names
    let restaurantName = restaurantMentions[0];
    restaurantName = restaurantName
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add spaces between camelCase
      .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
    
    // Don't override locationName here - let location keywords take precedence
  }
  
  // Extract location keywords from caption - prioritize more specific locations
  const locationKeywords = [
    ['perth', 'Perth, Australia'],
    ['australia', 'Australia'],
    ['bishopbriggs', 'Bishopbriggs, Scotland'],
    ['kilsyth', 'Kilsyth, Scotland'],
    ['edinburgh', 'Edinburgh, Scotland'],
    ['dundee', 'Dundee, Scotland'],
    ['aberdeen', 'Aberdeen, Scotland'],
    ['glasgow', 'Glasgow, Scotland'],
    ['scotland', 'Scotland'],
    ['uk', 'United Kingdom'],
    ['britain', 'United Kingdom']
  ];
  
  const lowerCaption = caption.toLowerCase();
  for (const [keyword, location] of locationKeywords) {
    if (lowerCaption.includes(keyword)) {
      locationName = location; // Always set location if keyword found
      break;
    }
  }
  
  // If we have coordinates but no location name, try to derive location from coordinates
  if (coordinates && !locationName) {
    // Simple coordinate-based location detection for Glasgow area
    const lat = coordinates.latitude;
    const lon = coordinates.longitude;
    
    if (lat >= 55.8 && lat <= 56.0 && lon >= -4.3 && lon <= -4.1) {
      locationName = 'Glasgow, Scotland';
    } else if (lat >= 56.0 && lat <= 57.0 && lon >= -4.0 && lon <= -2.0) {
      locationName = 'Scotland';
    }
  }
  
  return {
    locationName,
    coordinates,
    restaurantMentions: restaurantMentions
  };
}

// Enhanced restaurant name extraction
function extractRestaurantName(caption, locationData) {
  // First try to get from @ mentions - these are the actual restaurant names you tagged
  const mentions = locationData.restaurantMentions;
  if (mentions.length > 0) {
    // Clean up the restaurant name
    let restaurantName = mentions[0];
    
    // Remove common suffixes and clean up
    restaurantName = restaurantName
      .replace(/\.$/, '') // Remove trailing dot
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add spaces between camelCase
      .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
    
    return restaurantName;
  }
  
  // Look for common restaurant chains and brands (exact matches only)
  const commonRestaurants = [
    'mcdonalds', 'kfc', 'burger king', 'dominos', 'pizza hut', 'subway', 'greggs',
    'nandos', 'wagamama', 'yo sushi', 'itsu', 'wasabi', 'pret', 'starbucks',
    'costa', 'nero', 'five guys', 'shake shack', 'chipotle', 'taco bell',
    'paesano', 'fat hippo', 'project doughnut', 'locos burgers', 'hrc glasgow',
    'the coachman kilsyth', 'sweet tooth glasgow', 'doppio malto', 'piece glasgow',
    'apex meal prep', 'cake bakes', 'bakes by julie', 'glesga grub', 'rock n rolls bishopbriggs',
    'mr chips saracen', 'the counting house glasgow', 'the spiritualist glasgow',
    'pizza punks', 'la vita uk', 'designer cakes by paige', 'the scottish butcher',
    'together box uk', 'maki ramen', 'barolo glasgow', 'wearerudyspizza', 'simply bread uk',
    'cornitos uk', 'mamas kitchen glasgow', 'indianoceanbrewingco', 'thecountinghouseglasgow',
    'greggs_official', 'mcdonaldsuk', 'designercakesbypaige', 'glesgagrub64', 'rocknrollsbishopbriggs',
    'makiramen', 'wearerudyspizza', 'simplybreaduk', 'la_vita_uk', 'mrchipssaracen',
    'feistglasgow', 'grillonthecorner', 'tempusglasgow', 'millercartergla'
  ];
  
  const lowerCaption = caption.toLowerCase();
  for (const restaurant of commonRestaurants) {
    if (lowerCaption.includes(restaurant)) {
      return restaurant.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  }
  
  return null;
}

// Enhanced title generation
function generateTitle(caption, restaurantName, index) {
  if (restaurantName) {
    return restaurantName;
  }
  
  // Try to extract a meaningful title from the caption
  const cleanCaption = caption
    .replace(/[^\w\s]/g, ' ') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  // Look for food-related keywords to create a better title
  const foodKeywords = [
    'pizza', 'burger', 'steak', 'chicken', 'fish', 'pasta', 'curry', 'sushi',
    'breakfast', 'lunch', 'dinner', 'dessert', 'cake', 'coffee', 'beer', 'wine'
  ];
  
  for (const keyword of foodKeywords) {
    if (cleanCaption.toLowerCase().includes(keyword)) {
      return `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Review`;
    }
  }
  
  // If no food keywords found, use the first meaningful words
  const words = cleanCaption.split(' ').filter(word => word.length > 2);
  if (words.length > 0) {
    const title = words.slice(0, 3).join(' ');
    return title.length > 50 ? title.substring(0, 50) + '...' : title;
  }
  
  return `Food Review ${index + 1}`;
}

// Helper functions
function sanitizeSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

function findActualMediaPath(mediaUri, instagramRoot) {
  const possiblePaths = [
    path.join(instagramRoot, mediaUri),
    path.join(instagramRoot, 'your_instagram_activity', mediaUri),
    path.join(instagramRoot, 'media', mediaUri),
    path.join(instagramRoot, 'your_instagram_activity', 'media', mediaUri)
  ];
  
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      return possiblePath;
    }
  }
  
  return null;
}

function isDogPost(caption) {
  const dogKeywords = ['dog', 'puppy', 'canine', 'pet', 'woof', 'bark'];
  const lowerCaption = caption.toLowerCase();
  return dogKeywords.some(keyword => lowerCaption.includes(keyword));
}

function isArchivePost(caption) {
  const archiveKeywords = ['archived', 'archive', 'old', 'throwback', 'tbt', 'flashback'];
  const lowerCaption = caption.toLowerCase();
  return archiveKeywords.some(keyword => lowerCaption.includes(keyword));
}

async function generateMarkdownFromPost(post, index, instagramRoot) {
  const caption = post.media[0].title || '';
  const timestamp = post.media[0].creation_timestamp;
  const date = new Date(timestamp * 1000);
  const dateIso = date.toISOString().split('T')[0];
  
  // Extract location data
  const locationData = extractLocationData(post);
  
  // Extract restaurant name
  const restaurantName = extractRestaurantName(caption, locationData);
  
  // Generate title and slug
  const title = generateTitle(caption, restaurantName, index);
  const slug = sanitizeSlug(title) + '-' + timestamp;
  
  // Process images
  const relImages = [];
  for (const media of post.media) {
    const actualPath = findActualMediaPath(media.uri, instagramRoot);
    if (actualPath) {
      // Generate a unique filename for the public folder
      const ext = path.extname(actualPath);
      const filename = `${slug}-${relImages.length + 1}${ext}`;
      const publicImagePath = path.join(process.cwd(), 'public', 'images', 'reviews', filename);
      
      // Copy and convert image to public folder
      const processedPath = await copyAndConvertImage(actualPath, publicImagePath);
      if (processedPath) {
        const relativePath = path.relative(path.join(process.cwd(), 'public'), processedPath).replace(/\\/g, '/');
        relImages.push(`/${relativePath}`);
      }
    }
  }
  
  // Generate SEO keywords
  const seoKeywords = [];
  if (restaurantName) seoKeywords.push(restaurantName.toLowerCase());
  if (locationData.locationName) seoKeywords.push(locationData.locationName.toLowerCase());
  seoKeywords.push('glasgow', 'food', 'restaurant', 'review', 'dining');
  
  // Create frontmatter
  const frontmatter = {
    title: title,
    description: caption && caption.length > 0 ? caption.slice(0, 180).replace(/\n/g, ' ').trim() : `Food review from ${dateIso}`,
    restaurantName: restaurantName,
    location: locationData.locationName,
    coordinates: locationData.coordinates,
    visitDate: dateIso,
    author: "GusMack1",
    authorBio: "",
    featuredImage: relImages[0] || "",
    images: relImages,
    pros: [],
    cons: [],
    highlights: [],
    dishes: [],
    accessibility: [],
    dietaryOptions: [],
    bookingInfo: {
      phone: "",
      website: "",
      address: "",
      openingHours: ""
    },
    tags: ["instagram"],
    seoKeywords: seoKeywords,
    relatedRestaurants: []
  };
  
  // Generate better content for posts with empty captions
  let content = '';
  if (caption && caption.length > 0) {
    content = caption;
  } else {
    // Create more descriptive content for posts without captions
    if (restaurantName) {
      content = `Food review from ${restaurantName} on ${dateIso}.`;
    } else {
      content = `Food review from ${dateIso}.`;
    }
  }
  
  // Generate markdown content with YAML frontmatter
  const markdown = `---
${yaml.dump(frontmatter, { 
  lineWidth: -1, 
  noRefs: true,
  sortKeys: false,
  flowLevel: 3
})}---

${content}

${relImages.length > 0 ? `![${restaurantName || 'Food'}](${relImages[0]})` : ''}
`;
  
  return { slug, markdown };
}

// Main execution
const instagramRoot = path.join(process.cwd(), 'instagram-gusmack1-2025-08-15-WIAqpO3X');
const postsPath = path.join(instagramRoot, 'your_instagram_activity', 'media', 'posts_1.json');
const reviewsDir = path.join(process.cwd(), 'content', 'reviews');

if (!fs.existsSync(postsPath)) {
  console.error('Instagram posts file not found:', postsPath);
  process.exit(1);
}

if (!fs.existsSync(reviewsDir)) {
  fs.mkdirSync(reviewsDir, { recursive: true });
}

const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
let createdCount = 0;
let excludedDogPosts = 0;
let excludedArchivePosts = 0;

console.log(`Processing ${posts.length} Instagram posts...`);

(async () => {
  for (let index = 0; index < posts.length; index++) {
    const post = posts[index];
    const caption = post.media[0].title || '';
    
    // Filter out dog posts and archived posts
    if (isDogPost(caption)) {
      excludedDogPosts++;
      continue;
    }
    
    if (isArchivePost(caption)) {
      excludedArchivePosts++;
      continue;
    }
    
    const { slug, markdown } = await generateMarkdownFromPost(post, index, instagramRoot);
    const reviewPath = path.join(reviewsDir, `${slug}.md`);
    
    if (!fs.existsSync(reviewPath)) {
      fs.writeFileSync(reviewPath, markdown);
      createdCount++;
    }
  }
  
  console.log(`Done. Created ${createdCount} new reviews.`);
  console.log(`Excluded ${excludedDogPosts} dog posts.`);
  console.log(`Excluded ${excludedArchivePosts} archived posts.`);
})();


