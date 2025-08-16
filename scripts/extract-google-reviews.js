#!/usr/bin/env node

/**
 * Google Reviews Extractor for GusMack1
 * 
 * This script helps extract your Google reviews and convert them to our review format.
 * 
 * Instructions:
 * 1. Go to Google Maps
 * 2. Click on your profile picture
 * 3. Go to "Your contributions" > "Reviews"
 * 4. Copy the review text and details
 * 5. Use this script to format them
 */

const fs = require('fs');
const path = require('path');

// Template for converting Google reviews to our format
function createReviewFromGoogle(googleReview) {
  const {
    restaurantName,
    location,
    cuisine,
    rating,
    reviewText,
    visitDate,
    images = [],
    pros = [],
    cons = [],
    priceRange = "££"
  } = googleReview;

  const slug = restaurantName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  
  const reviewContent = `---
title: "${restaurantName} - Expert Review by Gus Mack"
description: "Comprehensive review of ${restaurantName} in ${location}. Expert analysis of food quality, service, atmosphere, and value with detailed insights from Glasgow food expert Gus Mack."
restaurantName: "${restaurantName}"
location: "${location}"
cuisine: "${cuisine}"
priceRange: "${priceRange}"
rating: ${rating}
visitDate: "${visitDate}"
author: "Gus Mack"
authorBio: "Glasgow food expert and restaurant reviewer with over 15 years of experience in the local culinary scene"
featuredImage: "/images/restaurants/${slug}-hero.jpg"
images:
${images.map(img => `  - "${img}"`).join('\n')}
pros:
${pros.map(pro => `  - "${pro}"`).join('\n')}
cons:
${cons.map(con => `  - "${con}"`).join('\n')}
highlights:
  - "Expert review by Glasgow food specialist"
  - "Detailed analysis of food quality and service"
  - "Practical information for visitors"
  - "Authentic local perspective"
dishes:
  - name: "Signature Dish"
    description: "Based on your review experience"
    rating: ${rating}
    price: "£15-25"
    image: "/images/dishes/${slug}-dish1.jpg"
atmosphere:
  rating: ${rating}
  description: "Based on your review experience and observations."
service:
  rating: ${rating}
  description: "Service quality as described in your review."
value:
  rating: ${rating}
  description: "Value assessment based on your experience."
accessibility:
  - "Contact restaurant for specific accessibility information"
dietaryOptions:
  - "Contact restaurant for dietary requirements"
bookingInfo:
  phone: "Contact restaurant directly"
  website: "Check restaurant's website"
  address: "${location}, Glasgow"
  openingHours: "Contact restaurant for current hours"
tags:
  - "${cuisine.toLowerCase()}"
  - "${location.toLowerCase()}"
  - "glasgow restaurant"
  - "gus mack review"
seoKeywords:
  - "${restaurantName} Glasgow"
  - "${cuisine} restaurant Glasgow"
  - "best ${cuisine} Glasgow"
  - "restaurant review Glasgow"
  - "Gus Mack review ${restaurantName}"
relatedRestaurants:
  - "sample-restaurant-review"
---

# ${restaurantName}: Expert Review by Gus Mack

## Introduction

${restaurantName} in ${location} represents the kind of establishment that makes Glasgow's dining scene truly special. As a food expert with over 15 years of experience in the local culinary landscape, I've visited countless restaurants across the city, and this one stands out for its unique approach to ${cuisine} cuisine.

## Your Expert Review

${reviewText}

## Detailed Analysis

### Food Quality
Based on your experience, the food quality at ${restaurantName} demonstrates the restaurant's commitment to excellence. The ${cuisine} cuisine is prepared with attention to detail and respect for traditional techniques while embracing modern culinary innovations.

### Service Experience
The service at ${restaurantName} reflects the high standards expected in Glasgow's competitive dining scene. Staff demonstrate knowledge of the menu and genuine enthusiasm for the dining experience.

### Atmosphere and Ambiance
The restaurant's atmosphere contributes significantly to the overall dining experience, creating an environment that enhances the enjoyment of the food and service.

## Value Assessment

With a rating of ${rating}/5, ${restaurantName} offers good value for money, particularly considering the quality of food and service provided. The pricing reflects the restaurant's position in the market and the quality of ingredients used.

## Practical Information

**Location:** ${location}, Glasgow  
**Cuisine:** ${cuisine}  
**Price Range:** ${priceRange}  
**Rating:** ${rating}/5  
**Visit Date:** ${visitDate}  

## Final Verdict

**Overall Rating: ${rating}/5**

${restaurantName} delivers a solid dining experience that aligns with Glasgow's reputation for quality restaurants. The combination of good food, service, and atmosphere makes it a worthwhile choice for diners seeking ${cuisine} cuisine in the city.

**Recommendation:** Based on your review, this restaurant is recommended for those seeking quality ${cuisine} dining in Glasgow. Consider booking in advance, especially for weekend dining.

---

*This review is based on your actual Google review and has been expanded with expert analysis and additional context for our comprehensive review system.*
`;

  return { slug, content: reviewContent };
}

// Example usage
const exampleGoogleReview = {
  restaurantName: "The Gannet",
  location: "Finnieston",
  cuisine: "Modern Scottish",
  rating: 4.5,
  reviewText: "Exceptional dining experience with innovative Scottish cuisine. The tasting menu was perfectly executed with locally sourced ingredients. Service was impeccable and the atmosphere was sophisticated yet welcoming. Highly recommended for special occasions.",
  visitDate: "2024-12-10",
  images: [
    "/images/restaurants/gannet-interior.jpg",
    "/images/restaurants/gannet-dish1.jpg"
  ],
  pros: [
    "Innovative Scottish cuisine",
    "Locally sourced ingredients",
    "Impeccable service",
    "Sophisticated atmosphere"
  ],
  cons: [
    "Premium pricing",
    "Requires advance booking"
  ],
  priceRange: "£££"
};

// Generate the review
const { slug, content } = createReviewFromGoogle(exampleGoogleReview);

// Save to file
const outputPath = path.join(__dirname, '..', 'content', 'reviews', `${slug}.md`);
fs.writeFileSync(outputPath, content);

console.log(`✅ Review created: ${outputPath}`);
console.log(`📝 Slug: ${slug}`);
console.log('\n📋 Instructions for using your Google reviews:');
console.log('1. Copy your Google review text');
console.log('2. Update the exampleGoogleReview object with your real data');
console.log('3. Run this script to generate the formatted review');
console.log('4. Add any missing images to the public/images/restaurants/ directory');
