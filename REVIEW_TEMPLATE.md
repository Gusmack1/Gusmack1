# How to Use Your Google Reviews

## Quick Setup Instructions

1. **Copy this template** and rename it to your restaurant name
2. **Fill in your actual Google review data** below
3. **Save it** in the `content/reviews/` folder
4. **Run the build** to see your review live

## Template for Your Google Review

```yaml
---
title: "RESTAURANT_NAME - Expert Review by Gus Mack"
description: "Your actual review description or summary"
restaurantName: "RESTAURANT_NAME"
location: "LOCATION (e.g., West End, Finnieston, City Centre)"
cuisine: "CUISINE_TYPE"
priceRange: "£££ (use £ for budget, ££ for mid-range, £££ for expensive)"
rating: 4.5
visitDate: "2024-12-15"
author: "Gus Mack"
authorBio: "Glasgow food expert and restaurant reviewer with over 15 years of experience in the local culinary scene"
featuredImage: "/images/restaurants/RESTAURANT_SLUG-hero.jpg"
images:
  - "/images/restaurants/RESTAURANT_SLUG-interior.jpg"
  - "/images/restaurants/RESTAURANT_SLUG-dish1.jpg"
pros:
  - "PRO 1 from your review"
  - "PRO 2 from your review"
  - "PRO 3 from your review"
cons:
  - "CON 1 from your review (if any)"
  - "CON 2 from your review (if any)"
highlights:
  - "Key highlight from your experience"
  - "Another highlight"
dishes:
  - name: "DISH_NAME"
    description: "Your description of the dish"
    rating: 5
    price: "£XX"
    image: "/images/dishes/RESTAURANT_SLUG-dish1.jpg"
atmosphere:
  rating: 4.5
  description: "Your thoughts on atmosphere"
service:
  rating: 4.5
  description: "Your thoughts on service"
value:
  rating: 4.5
  description: "Your thoughts on value for money"
accessibility:
  - "Accessibility info if known"
dietaryOptions:
  - "Dietary options if known"
bookingInfo:
  phone: "PHONE_NUMBER"
  website: "WEBSITE_URL"
  address: "FULL_ADDRESS"
  openingHours: "OPENING_HOURS"
tags:
  - "cuisine_type"
  - "location"
  - "glasgow restaurant"
seoKeywords:
  - "RESTAURANT_NAME Glasgow"
  - "CUISINE restaurant Glasgow"
  - "best CUISINE Glasgow"
relatedRestaurants:
  - "sample-restaurant-review"
---

# RESTAURANT_NAME: Expert Review by Gus Mack

## Introduction

Brief introduction about the restaurant and your experience.

## Your Expert Review

**PASTE YOUR ACTUAL GOOGLE REVIEW TEXT HERE**

## Detailed Analysis

### Food Quality
Expand on your review with more details about the food.

### Service Experience
Expand on your review with more details about the service.

### Atmosphere and Ambiance
Expand on your review with more details about the atmosphere.

## Value Assessment

Your thoughts on value for money.

## Practical Information

**Location:** LOCATION, Glasgow  
**Cuisine:** CUISINE_TYPE  
**Price Range:** £££  
**Rating:** X.X/5  
**Visit Date:** DATE  

## Final Verdict

**Overall Rating: X.X/5**

Your final thoughts and recommendation.

**Recommendation:** Your recommendation based on your experience.
```

## Example Using Your Google Review

Here's how to convert your actual Google review:

1. **Go to Google Maps**
2. **Find your review** of the restaurant
3. **Copy the text** of your review
4. **Fill in the template above** with your real data
5. **Save as** `restaurant-name-glasgow.md` in the `content/reviews/` folder

## Quick Commands

After creating your review file:

```bash
cd gusmack-food-reviews
npm run build
git add .
git commit -m "feat: add real restaurant review from Google"
git push origin main
```

Your review will then be live on your website with full SEO optimization!
