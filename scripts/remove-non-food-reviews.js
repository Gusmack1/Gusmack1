const fs = require('fs');
const path = require('path');

const workspaceRoot = path.join(__dirname, '..');
const reviewsDir = path.join(workspaceRoot, 'content', 'reviews');

// Conservative list of food-related terms (brands, dishes, meals, food hashtags)
const FOOD_TERMS = [
	'food', 'foodie', 'restaurant', 'menu', 'dish', 'dishes', 'meal', 'meals', 'eat', 'eating', 'tasty', 'delicious',
	'breakfast', 'lunch', 'dinner', 'brunch', 'snack', 'starter', 'dessert', 'pudding', 'sweet', 'savoury', 'savory',
	'burger', 'cheeseburger', 'big mac', 'quarter pounder', 'fries', 'chips', 'ketchup', 'sauce', 'brown sauce', 'tomato sauce',
	'pizza', 'calzone', 'garlic bread', 'margherita', 'pepperoni', 'meat feast', 'garlic',
	'kebab', 'doner', 'donner', 'shawarma', 'gyro',
	'chicken', 'wings', 'satay', 'biryani', 'tikka', 'balti', 'curry', 'naan', 'pakora', 'bhoona',
	'beef', 'steak', 'chateaubriand', 'prawn', 'prawns', 'duck', 'fish', 'supper', 'cod', 'haddock',
	'bacon', 'egg', 'roll', 'sandwich', 'baguette', 'bagel', 'toastie', 'wrap', 'calamari',
	'cheese', 'cheesy', 'parmesan', 'mozzarella', 'cheddar', 'pancake', 'waffle', 'milkshake', 'gelato', 'ice cream',
	'cake', 'cheesecake', 'brownie', 'cookie', 'donut', 'doughnut',
	'mcdonald', "mcdonald's", 'kfc', 'burger king', "domino's", 'dominos', 'pizza hut', 'paesano', 'brgr', 'la vita', 'rudy', 'rudy\'s',
	'prep to plate', 'pieceglasgow', 'ka pao', 'kapao', 'pellegrini', 'mahony', 'tickled trout', 'the stables', 'rudyspizza'
].map(s => s.toLowerCase());

// Clear non-food topics; used only when no food terms found
const NON_FOOD_TERMS = [
	'light', 'lights', 'dark', 'sunrise', 'sunset', 'weather', 'cloud', 'clouds', 'stars', 'moon',
	'architecture', 'building', 'park', 'scenery', 'landscape', 'view', 'views', 'tree', 'trees', 'commute', 'office', 'work',
	'rain', 'raining', 'storm', 'bnw', 'monochrome', 'black and white',
	'cow', 'cows', 'calf', 'glencoe', 'loch', 'scottishhighlands',
	'watch', 'watches', 'timepiece'
].map(s => s.toLowerCase());

function readFileSafe(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return ''; } }

function toSearchText(md) { return md.toLowerCase(); }

function mentionsAny(textLower, terms) { return terms.some(term => textLower.includes(term)); }

function shouldRemove(textLower) {
	const hasFood = mentionsAny(textLower, FOOD_TERMS);
	if (hasFood) return false;
	const hasNonFood = mentionsAny(textLower, NON_FOOD_TERMS);
	return hasNonFood;
}

function main() {
	const files = fs.readdirSync(reviewsDir).filter(f => f.endsWith('.md'));
	let removed = 0;
	for (const f of files) {
		const abs = path.join(reviewsDir, f);
		const md = readFileSafe(abs);
		if (!md) continue;
		const t = toSearchText(md);
		if (shouldRemove(t)) {
			try { fs.unlinkSync(abs); removed++; console.log(`Removed non-food review: ${f}`); } catch(e) { console.error(`Failed to remove ${f}: ${e.message}`); }
		}
	}
	console.log(`Removed ${removed} non-food reviews.`);
}

main();
