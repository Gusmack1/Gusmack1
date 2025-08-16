const fs = require('fs');
const path = require('path');

const workspaceRoot = path.join(__dirname, '..');
const reviewsDir = path.join(workspaceRoot, 'content', 'reviews');

// Conservative list of food-related terms (brands, dishes, meals, food hashtags)
const FOOD_TERMS = [
	'food', 'foodie', 'restaurant', 'menu', 'dish', 'dishes', 'meal', 'meals', 'eat', 'eating', 'tasty', 'delicious',
	'breakfast', 'lunch', 'dinner', 'brunch', 'snack', 'starter', 'dessert', 'pudding', 'sweet', 'savoury', 'savory',
	'burger', 'cheeseburger', 'big mac', 'quarter pounder', 'fries', 'chips', 'ketchup', 'sauce', 'brown sauce', 'tomato sauce',
	'pizza', 'calzone', 'garlic bread', 'margherita', 'pepperoni', 'meat feast',
	'kebab', 'doner', 'donner', 'shawarma', 'gyro',
	'chicken', 'wings', 'satay', 'biryani', 'tikka', 'balti', 'curry', 'naan', 'pakora', 'bhoona',
	'beef', 'steak', 'chateaubriand', 'prawns', 'duck', 'fish', 'supper', 'cod', 'haddock',
	'bacon', 'egg', 'roll', 'sandwich', 'baguette', 'bagel', 'toastie', 'baguette',
	'cheese', 'cheesy', 'parmesan', 'mozzarella', 'cheddar',
	'cake', 'cheesecake', 'brownie', 'cookie', 'pancake', 'milkshake', 'ice cream', 'gelato', 'doughnut', 'donut',
	'mcdonald', "mcdonald's", 'kfc', 'burger king', "domino's", 'pizza hut', 'paesano', 'brgr', 'la vita', 'rudy',
	'#food', '#foodie', '#glasgowfood', '#burger', '#pizza', '#kebab', '#curry', '#steak', '#dessert'
].map(s => s.toLowerCase());

function readFileSafe(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return ''; } }

function extractSearchText(md) {
	let text = md;
	// Frontmatter is useful (title, description, tags)
	// Keep it simple: search entire file
	return text.toLowerCase();
}

function mentionsFood(textLower) {
	return FOOD_TERMS.some(term => textLower.includes(term));
}

function main() {
	const files = fs.readdirSync(reviewsDir).filter(f => f.endsWith('.md'));
	let removed = 0;
	for (const f of files) {
		const abs = path.join(reviewsDir, f);
		const md = readFileSafe(abs);
		if (!md) continue;
		const t = extractSearchText(md);
		if (!mentionsFood(t)) {
			try {
				fs.unlinkSync(abs);
				removed++;
				console.log(`Removed non-food review: ${f}`);
			} catch (e) {
				console.error(`Failed to remove ${f}: ${e.message}`);
			}
		}
	}
	console.log(`Removed ${removed} non-food reviews.`);
}

main();
