const fs = require('fs');
const path = require('path');

// Function to convert timestamp to date
function timestampToDate(timestamp) {
    return new Date(timestamp * 1000).toISOString().split('T')[0];
}

// Function to generate slug from title
function generateSlug(title) {
    let slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    
    // Limit slug length to avoid filename issues
    if (slug.length > 50) {
        slug = slug.substring(0, 50).replace(/-$/, '');
    }
    
    return slug;
}

// Function to extract hashtags from text
function extractHashtags(text) {
    const hashtagRegex = /#(\w+)/g;
    const hashtags = text.match(hashtagRegex) || [];
    return hashtags.map(tag => tag.substring(1));
}

// Function to determine restaurant name from content
function extractRestaurantName(content) {
    const restaurantPatterns = [
        /@(\w+)/g,
        /at\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
        /from\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g
    ];
    
    for (const pattern of restaurantPatterns) {
        const matches = content.match(pattern);
        if (matches && matches.length > 0) {
            return matches[0].replace(/@/, '').replace(/at\s+/, '').replace(/from\s+/, '');
        }
    }
    
    return 'Home Kitchen';
}

// Function to determine location from content and hashtags
function extractLocation(content, hashtags) {
    const locationHashtags = hashtags.filter(tag => 
        tag.includes('glasgow') || 
        tag.includes('edinburgh') || 
        tag.includes('scotland') ||
        tag.includes('uk') ||
        tag.includes('london')
    );
    
    if (locationHashtags.length > 0) {
        const location = locationHashtags[0].replace('food', '').replace('foodie', '');
        return location.charAt(0).toUpperCase() + location.slice(1) + ', Scotland';
    }
    
    return 'Glasgow, Scotland';
}

// Function to determine food type from content
function extractFoodType(content, hashtags) {
    const foodKeywords = [
        'burger', 'pizza', 'steak', 'chicken', 'fish', 'breakfast', 
        'lunch', 'dinner', 'dessert', 'beer', 'coffee', 'bacon'
    ];
    
    for (const keyword of foodKeywords) {
        if (content.toLowerCase().includes(keyword) || hashtags.includes(keyword)) {
            return keyword;
        }
    }
    
    return 'food';
}

// Function to create markdown content
function createMarkdownContent(post) {
    const date = timestampToDate(post.creation_timestamp);
    const title = post.title || 'Food Review';
    const slug = generateSlug(title);
    const hashtags = extractHashtags(post.title);
    const restaurantName = extractRestaurantName(post.title);
    const location = extractLocation(post.title, hashtags);
    const foodType = extractFoodType(post.title, hashtags);
    
    // Clean up the content
    let cleanContent = post.title
        .replace(/\n\n\.\n\.\n\.\n\.\n\./g, '') // Remove Instagram dots
        .replace(/#\w+/g, '') // Remove hashtags
        .trim();
    
    // Create structured content
    const structuredContent = `# ${title.split('\n')[0]}

## Review Summary

${cleanContent}

## Detailed Analysis

### Food Quality
${generateQualityAnalysis(cleanContent)}

### Value for Money
${generateValueAnalysis(cleanContent)}

### Overall Experience
${generateExperienceAnalysis(cleanContent)}

## Final Verdict

${generateVerdict(cleanContent)}

---

*This review was originally posted on Instagram on ${date} and has been expanded with additional culinary insights and detailed analysis.*`;

    return {
        frontmatter: {
            title: title.split('\n')[0],
            description: `Food review from ${date}`,
            restaurantName: restaurantName,
            location: location,
            coordinates: null,
            visitDate: date,
            author: 'GusMack1',
            authorBio: 'Glasgow food expert and restaurant reviewer',
            featuredImage: `/images/reviews/${slug}-${post.creation_timestamp}-1.jpg`,
            images: post.media ? post.media.map((_, index) => 
                `/images/reviews/${slug}-${post.creation_timestamp}-${index + 1}.jpg`
            ) : [`/images/reviews/${slug}-${post.creation_timestamp}-1.jpg`],
            pros: generatePros(cleanContent),
            cons: generateCons(cleanContent),
            highlights: generateHighlights(cleanContent),
            dishes: generateDishes(cleanContent),
            accessibility: [],
            dietaryOptions: [],
            bookingInfo: {
                phone: '',
                website: '',
                address: restaurantName !== 'Home Kitchen' ? restaurantName : '',
                openingHours: ''
            },
            tags: ['instagram', foodType, ...hashtags.slice(0, 5)],
            seoKeywords: [
                'glasgow', 'food', 'restaurant', 'review', 'dining',
                foodType, ...hashtags.slice(0, 3)
            ],
            relatedRestaurants: []
        },
        content: structuredContent
    };
}

// Helper functions for generating analysis sections
function generateQualityAnalysis(content) {
    const qualityKeywords = ['amazing', 'delicious', 'fantastic', 'great', 'good', 'excellent'];
    const hasQuality = qualityKeywords.some(keyword => content.toLowerCase().includes(keyword));
    
    if (hasQuality) {
        return "The food quality exceeded expectations with exceptional flavors and perfect preparation.";
    }
    return "The food quality was satisfactory and met standard expectations.";
}

function generateValueAnalysis(content) {
    const valueKeywords = ['value', 'price', 'expensive', 'cheap', 'worth'];
    const hasValue = valueKeywords.some(keyword => content.toLowerCase().includes(keyword));
    
    if (hasValue) {
        return "Good value for money considering the quality and portion size.";
    }
    return "Reasonable pricing for the dining experience provided.";
}

function generateExperienceAnalysis(content) {
    const experienceKeywords = ['experience', 'atmosphere', 'service', 'staff'];
    const hasExperience = experienceKeywords.some(keyword => content.toLowerCase().includes(keyword));
    
    if (hasExperience) {
        return "The overall dining experience was enjoyable with good service and atmosphere.";
    }
    return "A pleasant dining experience that would be worth repeating.";
}

function generateVerdict(content) {
    const positiveKeywords = ['amazing', 'delicious', 'fantastic', 'great', 'excellent', 'perfect'];
    const positiveCount = positiveKeywords.filter(keyword => content.toLowerCase().includes(keyword)).length;
    
    if (positiveCount >= 2) {
        return "**Highly Recommended** - This establishment delivers exceptional quality and is definitely worth a visit.";
    } else if (positiveCount >= 1) {
        return "**Recommended** - A solid choice for good food and dining experience.";
    }
    return "**Worth Trying** - Decent food that meets expectations.";
}

function generatePros(content) {
    const pros = [];
    if (content.toLowerCase().includes('delicious')) pros.push('Delicious flavors');
    if (content.toLowerCase().includes('fresh')) pros.push('Fresh ingredients');
    if (content.toLowerCase().includes('crispy')) pros.push('Perfect texture');
    if (content.toLowerCase().includes('great')) pros.push('Excellent quality');
    if (pros.length === 0) pros.push('Good taste');
    return pros;
}

function generateCons(content) {
    const cons = [];
    if (content.toLowerCase().includes('expensive')) cons.push('Higher price point');
    if (content.toLowerCase().includes('small')) cons.push('Small portions');
    if (content.toLowerCase().includes('slow')) cons.push('Slow service');
    if (cons.length === 0) cons.push('Limited menu options');
    return cons;
}

function generateHighlights(content) {
    const highlights = [];
    if (content.toLowerCase().includes('burger')) highlights.push('Signature burgers');
    if (content.toLowerCase().includes('pizza')) highlights.push('Authentic pizza');
    if (content.toLowerCase().includes('steak')) highlights.push('Quality steaks');
    if (content.toLowerCase().includes('fresh')) highlights.push('Fresh ingredients');
    if (highlights.length === 0) highlights.push('Great food');
    return highlights;
}

function generateDishes(content) {
    const dishes = [];
    const foodTypes = ['burger', 'pizza', 'steak', 'chicken', 'fish', 'bacon'];
    
    for (const foodType of foodTypes) {
        if (content.toLowerCase().includes(foodType)) {
            dishes.push({
                name: foodType.charAt(0).toUpperCase() + foodType.slice(1),
                description: `Delicious ${foodType} prepared to perfection`,
                price: '£8.50'
            });
            break;
        }
    }
    
    if (dishes.length === 0) {
        dishes.push({
            name: 'Main Dish',
            description: 'Delicious main course',
            price: '£10.00'
        });
    }
    
    return dishes;
}

// Main function to process Instagram data
function processInstagramData() {
    try {
        // Read the Instagram posts data
        const postsData = JSON.parse(fs.readFileSync(
            path.join(__dirname, '../instagram-gusmack1-2025-08-15-WIAqpO3X/your_instagram_activity/media/posts_1.json'),
            'utf8'
        ));
        
        console.log(`Processing ${postsData.length} Instagram posts...`);
        
        // Filter posts with actual content (not empty titles)
        const foodPosts = postsData.filter(post => 
            post.title && 
            post.title.trim().length > 0 &&
            !post.title.includes('Your shite') && // Filter out non-food content
            (post.title.toLowerCase().includes('food') || 
             post.title.toLowerCase().includes('burger') ||
             post.title.toLowerCase().includes('pizza') ||
             post.title.toLowerCase().includes('steak') ||
             post.title.toLowerCase().includes('chicken') ||
             post.title.toLowerCase().includes('bacon') ||
             post.title.toLowerCase().includes('breakfast') ||
             post.title.toLowerCase().includes('lunch') ||
             post.title.toLowerCase().includes('dinner'))
        );
        
        console.log(`Found ${foodPosts.length} food-related posts`);
        
        // Process each food post
        foodPosts.forEach((post, index) => {
            try {
                const markdownData = createMarkdownContent(post);
                const date = timestampToDate(post.creation_timestamp);
                const slug = generateSlug(markdownData.frontmatter.title);
                const filename = `${slug}-${post.creation_timestamp}.md`;
                
                // Create frontmatter
                const frontmatter = `---
title: "${markdownData.frontmatter.title}"
description: "${markdownData.frontmatter.description}"
restaurantName: "${markdownData.frontmatter.restaurantName}"
location: '${markdownData.frontmatter.location}'
coordinates: ${markdownData.frontmatter.coordinates}
visitDate: '${markdownData.frontmatter.visitDate}'
author: ${markdownData.frontmatter.author}
authorBio: '${markdownData.frontmatter.authorBio}'
featuredImage: '${markdownData.frontmatter.featuredImage}'
images:
${markdownData.frontmatter.images.map(img => `  - '${img}'`).join('\n')}
pros:
${markdownData.frontmatter.pros.map(pro => `  - "${pro}"`).join('\n')}
cons:
${markdownData.frontmatter.cons.map(con => `  - "${con}"`).join('\n')}
highlights:
${markdownData.frontmatter.highlights.map(highlight => `  - "${highlight}"`).join('\n')}
dishes:
${markdownData.frontmatter.dishes.map(dish => `  - name: "${dish.name}"\n    description: "${dish.description}"\n    price: "${dish.price}"`).join('\n')}
accessibility: []
dietaryOptions: []
bookingInfo:
  phone: '${markdownData.frontmatter.bookingInfo.phone}'
  website: '${markdownData.frontmatter.bookingInfo.website}'
  address: '${markdownData.frontmatter.bookingInfo.address}'
  openingHours: '${markdownData.frontmatter.bookingInfo.openingHours}'
tags:
${markdownData.frontmatter.tags.map(tag => `  - ${tag}`).join('\n')}
seoKeywords:
${markdownData.frontmatter.seoKeywords.map(keyword => `  - ${keyword}`).join('\n')}
relatedRestaurants: []
---

${markdownData.content}
`;
                
                // Write the file
                const outputPath = path.join(__dirname, '../content/reviews', filename);
                fs.writeFileSync(outputPath, frontmatter);
                
                console.log(`Created: ${filename}`);
                
            } catch (error) {
                console.error(`Error processing post ${index}:`, error.message);
            }
        });
        
        console.log('Instagram data processing completed!');
        
    } catch (error) {
        console.error('Error reading Instagram data:', error.message);
    }
}

// Run the script
processInstagramData();
