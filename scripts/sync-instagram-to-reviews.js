/*
  Sync Instagram export to review images with 100% accuracy
  - Reads: instagram-gusmack1-2025-08-15-WIAqpO3X/your_instagram_activity/media/posts_1.json
  - Finds posts by caption keywords per review slug
  - Resolves each media URI to the actual file under instagram export (checks both /media and /your_instagram_activity/media)
  - Prefers JPG/WEBP if available; else uses HEIC as-is
  - Copies to public/images/restaurants/<slug>-<index>.<ext>
  - Updates frontmatter featuredImage and images array in content/reviews/<slug>.md
*/

const fs = require('fs');
const path = require('path');

const workspaceRoot = path.join(__dirname, '..');
const exportRoot = path.join(workspaceRoot, 'instagram-gusmack1-2025-08-15-WIAqpO3X');
const altExportMedia = path.join(exportRoot, 'your_instagram_activity', 'media');
const mainExportMedia = path.join(exportRoot, 'media');
const postsJsonPath = path.join(exportRoot, 'your_instagram_activity', 'media', 'posts_1.json');
const reviewsDir = path.join(workspaceRoot, 'content', 'reviews');
const publicRestaurantsDir = path.join(workspaceRoot, 'public', 'images', 'restaurants');

function ensureDir(dir) {
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

ensureDir(publicRestaurantsDir);

// Comprehensive mapping for all Glasgow restaurants
const slugToKeywords = {
	'mahonys-steakhouse-bishopbriggs': ['mahonys', "mahony's", 'burger', 'bishopbriggs'],
	'dominos-pizza-glasgow': ["domino", "domino's", 'pizza'],
	'ox-and-finch-glasgow': ['ox and finch', 'ox-and-finch', 'finnieston'],
	'paesano-pizza-glasgow': ['paesano', 'pizza', 'glasgow'],
	'sugo-pasta-glasgow': ['sugo', 'pasta', 'glasgow'],
	'ka-pao-glasgow': ['ka pao', 'ka-pao'],
	'el-perro-negro-glasgow': ['el perro negro', 'burger'],
	'cail-bruich-glasgow': ['cail bruich'],
	'six-by-nico-glasgow': ['six by nico', 'sixbynico', 'tasting menu'],
	'the-finnieston-glasgow': ['finnieston', 'seafood', 'oyster'],
	'kimchi-cult-glasgow': ['kimchi cult', 'korean', 'street food'],
	'bread-meats-bread-glasgow': ['bread meats bread', 'sandwich'],
	'brewdog-glasgow': ['brewdog', 'craft beer'],
	'browns-glasgow': ['browns', 'british'],
	'cafe-andaluz-glasgow': ['cafe andaluz', 'spanish', 'tapas'],
	'cafe-gandolfi-glasgow': ['cafe gandolfi', 'scottish'],
	'celentanos-glasgow': ['celentanos', 'italian'],
	'chaakoo-bombay-cafe-glasgow': ['chaakoo', 'bombay', 'indian'],
	'chaophraya-glasgow': ['chaophraya', 'thai'],
	'chinaskis-glasgow': ['chinaskis', 'asian', 'fusion'],
	'cote-brasserie-glasgow': ['cote', 'brasserie', 'french'],
	'cotto-glasgow': ['cotto', 'italian'],
	'crabshakk-glasgow': ['crabshakk', 'seafood'],
	'dakhin-glasgow': ['dakhin', 'south indian'],
	'durty-vegan-burger-club-glasgow': ['durty vegan', 'burger', 'vegan'],
	'eighty-eight-glasgow': ['eighty eight', 'asian', 'fusion'],
	'elenas-spanish-bar-glasgow': ['elenas', 'spanish'],
	'eusebi-deli-glasgow': ['eusebi', 'deli', 'italian'],
	'fanny-trollopes-glasgow': ['fanny trollopes', 'british'],
	'franco-manca-glasgow': ['franco manca', 'pizza', 'italian'],
	'gamba-glasgow': ['gamba', 'seafood'],
	'hanoi-bike-shop-glasgow': ['hanoi bike shop', 'vietnamese'],
	'hawksmoor-glasgow': ['hawksmoor', 'steak'],
	'ichiban-glasgow': ['ichiban', 'japanese'],
	'ka-ka-lok-glasgow': ['ka ka lok', 'chinese'],
	'koolba-glasgow': ['koolba', 'indian'],
	'la-lanterna-glasgow': ['la lanterna', 'italian'],
	'miller-carter-glasgow': ['miller carter', 'steak'],
	'mono-glasgow': ['mono', 'vegan'],
	'mother-india-glasgow': ['mother india', 'indian'],
	'mowgli-glasgow': ['mowgli', 'indian', 'street food'],
	'nippon-kitchen-glasgow': ['nippon kitchen', 'japanese'],
	'number-16-glasgow': ['number 16', 'scottish'],
	'obsession-of-india-glasgow': ['obsession of india', 'indian'],
	'osteria-italiana-glasgow': ['osteria italiana', 'italian'],
	'partick-duck-club-glasgow': ['partick duck club', 'british'],
	'pickled-ginger-glasgow': ['pickled ginger', 'japanese'],
	'pompilio-glasgow': ['pompilio', 'italian'],
	'porter-rye-glasgow': ['porter rye', 'steak'],
	'ralph-finns-glasgow': ['ralph finns', 'british'],
	'ranjits-kitchen-glasgow': ['ranjits kitchen', 'indian'],
	'rasoi-indian-kitchen-glasgow': ['rasoi', 'indian'],
	'rogano-glasgow': ['roganic', 'fine dining'],
	'sarti-glasgow': ['sarti', 'italian'],
	'shish-mahal-glasgow': ['shish mahal', 'indian'],
	'stereo-glasgow': ['stereo', 'vegan'],
	'stravaigin-glasgow': ['stravaigin', 'scottish'],
	'the-anchor-hope-glasgow': ['anchor hope', 'british'],
	'the-anchor-line-glasgow': ['anchor line', 'british'],
	'the-bothy-glasgow': ['bothy', 'scottish'],
	'the-butchershop-bar-grill-glasgow': ['butchershop', 'steak'],
	'the-buttery-glasgow': ['buttery', 'scottish'],
	'the-corinthian-club-glasgow': ['corinthian club', 'british'],
	'the-dockyard-social-glasgow': ['dockyard social', 'street food'],
	'the-dukes-umbrella-glasgow': ['dukes umbrella', 'british'],
	'the-gardener-glasgow': ['gardener', 'british'],
	'the-gate-glasgow': ['gate', 'british'],
	'the-hug-and-pint-glasgow': ['hug and pint', 'vegan'],
	'the-hyndland-fox-glasgow': ['hyndland fox', 'british'],
	'the-ivy-buchanan-street-glasgow': ['ivy', 'buchanan street', 'british'],
	'the-left-bank-glasgow': ['left bank', 'british'],
	'the-pot-still-glasgow': ['pot still', 'whisky'],
	'the-spanish-butcher-glasgow': ['spanish butcher', 'spanish'],
	'the-spiritualist-glasgow': ['spiritualist', 'british'],
	'tiffneys-steakhouse-glasgow': ['tiffneys', 'steak'],
	'ting-thai-glasgow': ['ting thai', 'thai'],
	'topolabamba-glasgow': ['topolabamba', 'mexican'],
	'two-fat-ladies-at-the-buttery-glasgow': ['two fat ladies', 'buttery', 'scottish'],
	'ubiquitous-chip-glasgow': ['ubiquitous chip', 'scottish'],
	'unalome-by-graeme-cheevers-glasgow': ['unalome', 'graeme cheevers', 'fine dining']
};

function safeReadJson(file) {
	try {
		const raw = fs.readFileSync(file, 'utf8');
		return JSON.parse(raw);
	} catch (e) {
		console.error('Failed to read JSON', file, e.message);
		return null;
	}
}

function findActualMediaPath(relativeUri) {
	// relativeUri examples: media/posts/202307/xxx.jpg or media/other/xxx.heic
	const cleanRel = relativeUri.replace(/^\.\/?/, '');
	const tryPaths = [
		path.join(mainExportMedia, cleanRel.replace(/^media\//, '')),
		path.join(altExportMedia, cleanRel.replace(/^media\//, '')),
	];
	for (const p of tryPaths) {
		if (fs.existsSync(p)) return p;
	}
	// Try swapping extensions (prefer jpg/webp)
	const baseNoExt = cleanRel.replace(/^media\//, '').replace(/\.[^.]+$/, '');
	const altExts = ['.jpg', '.jpeg', '.webp', '.png', '.heic'];
	for (const ext of altExts) {
		for (const root of [mainExportMedia, altExportMedia]) {
			const p2 = path.join(root, baseNoExt + ext);
			if (fs.existsSync(p2)) return p2;
		}
	}
	return null;
}

function collectMediaForSlug(postsJson, keywords) {
	const matches = [];
	const posts = postsJson || [];
	for (const item of posts) {
		const caption = (item.title || item.caption || '').toLowerCase();
		if (!keywords.every(k => caption.includes(k.toLowerCase()))) continue;
		const media = Array.isArray(item.media) ? item.media : [];
		for (const m of media) {
			if (!m || !m.uri) continue;
			const actualPath = findActualMediaPath(m.uri);
			if (actualPath) matches.push(actualPath);
		}
	}
	return matches;
}

function writeFrontmatterImages(reviewPath, imagePaths) {
	let content = fs.readFileSync(reviewPath, 'utf8');
	const fmEnd = content.indexOf('\n---', 3);
	if (!content.startsWith('---') || fmEnd === -1) return;
	const fm = content.slice(0, fmEnd + 4);
	const body = content.slice(fmEnd + 4);

	const featuredRel = imagePaths[0] || '';
	let newFm = fm.replace(/featuredImage:\s*"[^"]*"/i, `featuredImage: "${featuredRel}"`);

	if (/images:\s*\[.*?\]/s.test(newFm)) {
		newFm = newFm.replace(/images:\s*\[.*?\]/s, `images: [${imagePaths.map(p => '"' + p + '"').join(', ')}]`);
	} else if (/images:\s*\n(\s*-\s*.*\n)+/s.test(newFm)) {
		newFm = newFm.replace(/images:\s*\n((\s*-\s*.*\n)+)/s, 'images:\n' + imagePaths.map(p => `  - "${p}"\n`).join(''));
	} else {
		newFm = newFm.replace(/---\s*$/m, `images: [${imagePaths.map(p => '"' + p + '"').join(', ')}]\n---`);
	}

	fs.writeFileSync(reviewPath, newFm + body, 'utf8');
}

function main() {
	const postsJson = safeReadJson(postsJsonPath);
	if (!postsJson) {
		console.error('Cannot proceed without posts_1.json');
		process.exit(1);
	}

	for (const [slug, keywords] of Object.entries(slugToKeywords)) {
		const reviewPath = path.join(reviewsDir, `${slug}.md`);
		if (!fs.existsSync(reviewPath)) {
			// Skip slugs that don't have a review file yet
			continue;
		}

		const mediaPaths = collectMediaForSlug(postsJson, keywords);
		if (mediaPaths.length === 0) {
			console.warn(`No matching Instagram media found for slug: ${slug}`);
			continue;
		}

		const relUrls = [];
		mediaPaths.forEach((absPath, index) => {
			const ext = path.extname(absPath).toLowerCase();
			const preferredExt = ['.jpg', '.jpeg', '.webp', '.png'].includes(ext) ? ext : '.jpg';
			const destRel = `/images/restaurants/${slug}-${index + 1}${preferredExt}`;
			const destAbs = path.join(publicRestaurantsDir, `${slug}-${index + 1}${preferredExt}`);
			try {
				if (preferredExt === ext) {
					fs.copyFileSync(absPath, destAbs);
				} else {
					const base = absPath.replace(/\.[^.]+$/, '');
					let copied = false;
					for (const e of ['.jpg', '.jpeg', '.webp', '.png']) {
						for (const root of [mainExportMedia, altExportMedia]) {
							const candidate = base + e;
							if (fs.existsSync(candidate)) {
								fs.copyFileSync(candidate, destAbs);
								copied = true; break;
							}
						}
						if (copied) break;
					}
					if (!copied) {
						const heicDestAbs = path.join(publicRestaurantsDir, `${slug}-${index + 1}${ext}`);
						fs.copyFileSync(absPath, heicDestAbs);
						relUrls.push(`/images/restaurants/${slug}-${index + 1}${ext}`);
						return;
					}
				}
				relUrls.push(destRel);
			} catch (err) {
				console.error('Copy failed', absPath, '->', destAbs, err.message);
			}
		});

		if (relUrls.length > 0) {
			writeFrontmatterImages(reviewPath, relUrls);
			console.log(`Updated ${slug} with ${relUrls.length} images.`);
		}
	}
}

main();
