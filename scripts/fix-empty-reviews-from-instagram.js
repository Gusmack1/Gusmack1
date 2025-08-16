const fs = require('fs');
const path = require('path');

const workspaceRoot = path.join(__dirname, '..');
const reviewsDir = path.join(workspaceRoot, 'content', 'reviews');
const publicReviewsDir = path.join(workspaceRoot, 'public', 'images', 'reviews');
const exportRoot = path.join(workspaceRoot, 'instagram-gusmack1-2025-08-15-WIAqpO3X');
const altExportMedia = path.join(exportRoot, 'your_instagram_activity', 'media');
const mainExportMedia = path.join(exportRoot, 'media');
const postsJsonPath = path.join(altExportMedia, 'posts_1.json');
const otherContentPath = path.join(altExportMedia, 'other_content.json');
const archivedPostsPath = path.join(altExportMedia, 'archived_posts.json');

function ensureDir(dir) {
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function safeReadJson(file) {
	try {
		return JSON.parse(fs.readFileSync(file, 'utf8'));
	} catch (e) {
		console.error('Failed to read JSON:', file, e.message);
		return null;
	}
}

function buildPostIndex(posts) {
	const index = new Map();
	for (const item of posts) {
		if (item && typeof item.creation_timestamp === 'number') {
			index.set(item.creation_timestamp, item);
		}
	}
	return index;
}

// Normalize various Instagram export schemas into a flat array of { title, creation_timestamp, media: [{uri}] }
function normalizeInstagramExports({ posts1, otherContent, archived }) {
	const unified = [];
	// posts_1.json is already in the expected shape
	if (Array.isArray(posts1)) {
		for (const it of posts1) {
			if (!it) continue;
			const title = it.title || '';
			const creation_timestamp = it.creation_timestamp || (it.media && it.media[0] && it.media[0].creation_timestamp) || null;
			const media = Array.isArray(it.media) ? it.media : [];
			if (creation_timestamp) unified.push({ title, creation_timestamp, media });
		}
	}
	// other_content.json → ig_other_media: [{ title, creation_timestamp, media: [ { uri, creation_timestamp } ] }]
	if (otherContent && Array.isArray(otherContent.ig_other_media)) {
		for (const oc of otherContent.ig_other_media) {
			if (!oc) continue;
			const title = oc.title || '';
			const creation_timestamp = oc.creation_timestamp || (oc.media && oc.media[0] && oc.media[0].creation_timestamp) || null;
			const media = Array.isArray(oc.media) ? oc.media.map(m => ({ uri: m.uri, creation_timestamp: m.creation_timestamp })) : [];
			if (creation_timestamp) unified.push({ title, creation_timestamp, media });
		}
	}
	// archived_posts.json → ig_archived_post_media: [{ title, creation_timestamp, media: [ { uri } ] }]
	if (archived && Array.isArray(archived.ig_archived_post_media)) {
		for (const ar of archived.ig_archived_post_media) {
			if (!ar) continue;
			const title = ar.title || '';
			const creation_timestamp = ar.creation_timestamp || (ar.media && ar.media[0] && ar.media[0].creation_timestamp) || null;
			const media = Array.isArray(ar.media) ? ar.media.map(m => ({ uri: m.uri, creation_timestamp: m.creation_timestamp })) : [];
			if (creation_timestamp) unified.push({ title, creation_timestamp, media });
		}
	}
	return unified;
}

function findActualMediaPath(relativeUri) {
	if (!relativeUri) return null;
	const cleanRel = relativeUri.replace(/^\.?\/?/, '');
	const tryPaths = [
		path.join(mainExportMedia, cleanRel.replace(/^media\//, '')),
		path.join(altExportMedia, cleanRel.replace(/^media\//, '')),
	];
	for (const p of tryPaths) {
		if (fs.existsSync(p)) return p;
	}
	return null;
}

function normalizeDestForFile(baseSlug, ts, index, srcPath) {
	const ext = path.extname(srcPath).toLowerCase() || '.jpg';
	// Keep original extension to preserve exactness
	return {
		destAbs: path.join(publicReviewsDir, `${baseSlug}-${ts}-${index + 1}${ext}`),
		destRel: `/images/reviews/${baseSlug}-${ts}-${index + 1}${ext}`,
		ext
	};
}

function replaceFrontmatterImages(content, imagesArray) {
	// Ensure images are YAML list with two-space indent
	const imagesBlock = 'images:\n' + imagesArray.map(p => `  - '${p}'`).join('\n') + '\n';
	let out = content;
	// Replace featuredImage
	out = out.replace(/featuredImage:\s*[^\n]+/i, `featuredImage: ${JSON.stringify(imagesArray[0] || '')}`);
	// Replace images section between images: and (pros:|cons:|highlights:|dishes:|accessibility:)
	const imagesStart = out.indexOf('\nimages:');
	if (imagesStart !== -1) {
		const tail = out.slice(imagesStart + 1);
		const m = tail.match(/images:\s*[\s\S]*?(?=\n(?:pros:|cons:|highlights:|dishes:|accessibility:|dietaryOptions:|bookingInfo:|tags:|seoKeywords:|relatedRestaurants:|---\s*$))/m);
		if (m) {
			out = out.slice(0, imagesStart + 1) + imagesBlock + out.slice(imagesStart + 1 + m[0].length);
		} else {
			// Could not find a clean block, insert after first occurrence of images:
			out = out.replace(/images:\s*[\s\S]*?\n/, imagesBlock);
		}
	} else {
		// Insert before pros: line inside frontmatter
		out = out.replace(/---\s*\n/, `---\n${imagesBlock}`);
	}
	return out;
}

function replaceBodyWithCaption(content, exactCaption) {
	// Keep frontmatter as-is, swap the body after the second '---' with exact caption
	const fmEndIdx = content.indexOf('\n---', 3);
	if (!content.startsWith('---') || fmEndIdx === -1) return content;
	const fm = content.slice(0, fmEndIdx + 4);
	const newBody = `\n${exactCaption}\n`;
	return fm + newBody;
}

function updateFrontmatterField(content, key, valueString) {
	// valueString should already be YAML-escaped/quoted as needed
	const regex = new RegExp(`(^|\n)${key}:.*?(\n)`, 'i');
	if (regex.test(content)) {
		return content.replace(regex, `$1${key}: ${valueString}$2`);
	}
	// Insert just after opening frontmatter line
	return content.replace(/---\s*\n/, `---\n${key}: ${valueString}\n`);
}

function extractRestaurantFromCaptionWithConfidence(caption) {
	if (!caption) return null;
	const text = caption.toLowerCase();
	// Exact brand/name tokens we accept as 100% brand match (not location)
	const brandMap = [
		{ token: "pizza punks", name: "Pizza Punks" },
		{ token: "domino's", name: "Domino's Pizza" },
		{ token: "dominos", name: "Domino's Pizza" },
		{ token: "kfc", name: "KFC" },
		{ token: "burger king", name: "Burger King" },
		{ token: "brgr", name: "BRGR" },
		{ token: "paesano", name: "Paesano" },
		{ token: "la vita", name: "La Vita" },
		{ token: "ka pao", name: "Ka Pao" },
		{ token: "ka-pao", name: "Ka Pao" },
		{ token: "tickled trout", name: "Tickled Trout" },
		{ token: "the stables", name: "The Stables" },
		{ token: "prep to plate", name: "Prep to Plate" },
		{ token: "mahony", name: "Mahony's Steakhouse" },
	];
	const matches = brandMap.filter(b => text.includes(b.token));
	if (matches.length === 1) return matches[0].name;
	return null;
}

function findNearestUniqueByTimestamp(unifiedPosts, ts, windows = [5, 60, 600, 3600, 86400]) {
	// Try exact first
	const exact = unifiedPosts.find(p => p.creation_timestamp === ts);
	if (exact) return exact;
	for (const w of windows) {
		const candidates = unifiedPosts.filter(p => Math.abs(p.creation_timestamp - ts) <= w);
		if (candidates.length === 1) return candidates[0];
	}
	return null;
}

function processOneReview(fileName, postIndex, unifiedPosts) {
	const reviewPath = path.join(reviewsDir, fileName);
	const base = path.basename(fileName, '.md');
	// Expect trailing timestamp like ...-1598786128
	const tsMatch = base.match(/-(\d{9,})$/);
	if (!tsMatch) return { updated: false, reason: 'no-timestamp' };
	const ts = Number(tsMatch[1]);
	let post = postIndex.get(ts);
	if (!post) {
		post = findNearestUniqueByTimestamp(unifiedPosts, ts);
		if (!post) return { updated: false, reason: 'no-post' };
	}

	let original = fs.readFileSync(reviewPath, 'utf8');
	const caption = (post.title || '').replace(/\r\n/g, '\n');
	// Proceed even if caption empty (still attach images), skip body replacement later

	// Collect media paths
	const mediaItems = Array.isArray(post.media) ? post.media : [];
	const foundMedia = [];
	for (const m of mediaItems) {
		if (!m || !m.uri) continue;
		const actual = findActualMediaPath(m.uri);
		if (actual) foundMedia.push(actual);
	}

	// Build destination urls and copy
	const baseSlug = base.replace(/-(\d{9,})$/, '');
	const relUrls = [];
	foundMedia.forEach((src, idx) => {
		const { destAbs, destRel } = normalizeDestForFile(baseSlug, ts, idx, src);
		ensureDir(path.dirname(destAbs));
		try {
			fs.copyFileSync(src, destAbs);
			relUrls.push(destRel);
		} catch (e) {
			console.error('Copy failed', src, '->', destAbs, e.message);
		}
	});
	// If no media found, leave images as-is

	let updated = original;
	if (relUrls.length > 0) {
		updated = replaceFrontmatterImages(updated, relUrls);
	}
	if (caption && caption.trim()) {
		updated = replaceBodyWithCaption(updated, caption);
	}
	// Restaurant brand extraction (strict token match); no location guesses
	const detected = extractRestaurantFromCaptionWithConfidence(caption);
	if (detected) {
		updated = updateFrontmatterField(updated, 'restaurantName', JSON.stringify(detected));
	}
	if (updated !== original) {
		fs.writeFileSync(reviewPath, updated, 'utf8');
		return { updated: true, media: relUrls.length, captioned: !!(caption && caption.trim()), detected };
	}
	return { updated: false, reason: 'no-change' };
}

function main() {
	console.log('Fixing empty/missing review content from Instagram by timestamp...');
	ensureDir(publicReviewsDir);
	const posts1 = safeReadJson(postsJsonPath);
	const otherContent = safeReadJson(otherContentPath);
	const archived = safeReadJson(archivedPostsPath);
	if (!posts1 && !otherContent && !archived) {
		console.error('Cannot read any Instagram export files');
		process.exit(1);
	}
	const unified = normalizeInstagramExports({ posts1, otherContent, archived });
	const postIndex = buildPostIndex(unified);
	const files = fs.readdirSync(reviewsDir).filter(f => f.endsWith('.md'));
	let updatedCount = 0;
	let mediaCount = 0;
	let missingCaption = 0;
	let missingPost = 0;
	let brandDetected = 0;
	for (const f of files) {
		const res = processOneReview(f, postIndex, unified);
		if (res.updated) {
			updatedCount++;
			mediaCount += res.media || 0;
			if (res.captioned === false) missingCaption++;
			if (res.detected) brandDetected++;
		} else if (res.reason === 'no-post') {
			missingPost++;
		}
	}
	console.log(`Updated ${updatedCount} review files; copied ${mediaCount} media.`);
	if (missingCaption) console.log(`Skipped body update for ${missingCaption} due to empty Instagram caption.`);
	if (missingPost) console.log(`No Instagram post found for ${missingPost} review files.`);
	if (brandDetected) console.log(`Restaurant brand auto-detected on ${brandDetected} reviews (brand only, no location).`);
}

main();
