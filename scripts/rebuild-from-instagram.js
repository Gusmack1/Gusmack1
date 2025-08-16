const fs = require('fs');
const path = require('path');

// Config
const workspaceRoot = path.join(__dirname, '..');
const reviewsDir = path.join(workspaceRoot, 'content', 'reviews');
const imagesDir = path.join(workspaceRoot, 'public', 'images', 'reviews');
const exportRoot = path.join(workspaceRoot, 'instagram-gusmack1-2025-08-15-WIAqpO3X');
const altExportMedia = path.join(exportRoot, 'your_instagram_activity', 'media');
const mainExportMedia = path.join(exportRoot, 'media');
const postsJsonPath = path.join(altExportMedia, 'posts_1.json');
const otherContentPath = path.join(altExportMedia, 'other_content.json');
const archivedPostsPath = path.join(altExportMedia, 'archived_posts.json');

// Food detection (caption-only; ignore hashtags)
const FOOD_TERMS = [
	'food','burger','pizza','kebab','doner','donner','shawarma','gyro','steak','beef','chicken','wings','satay','biryani','tikka','balti','curry','naan','pakora','bhoona',
	'fish','supper','cod','haddock','prawns','prawn','duck',
	'bacon','egg','roll','sandwich','baguette','bagel','toastie','wrap','calamari',
	'cheese','cheesy','parmesan','mozzarella','cheddar',
	'cake','cheesecake','brownie','cookie','pancake','waffle','milkshake','gelato','ice cream',
	'breakfast','lunch','dinner','brunch','dessert',
	'mcdonald','kfc','burger king','domino','paesano','brgr','la vita','rudy','ka pao','pizza hut','rudy\'s'
].map(s=>s.toLowerCase());

function ensureDir(d){ if(!fs.existsSync(d)) fs.mkdirSync(d, { recursive:true }); }
function safeReadJson(p){ try { return JSON.parse(fs.readFileSync(p,'utf8')); } catch { return null; } }

function stripHashtagsForDetection(caption){
	if(!caption) return '';
	return caption.replace(/(^|\s)#[^\s#]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function isFoodCaption(caption){
	const t = stripHashtagsForDetection(caption).toLowerCase();
	if(!t) return false;
	return FOOD_TERMS.some(term => t.includes(term));
}

function normalizeInstagramExports({ posts1, otherContent, archived }){
	const unified = [];
	if(Array.isArray(posts1)){
		for(const it of posts1){
			if(!it) continue;
			const title = it.title || '';
			const creation_timestamp = it.creation_timestamp || (it.media && it.media[0] && it.media[0].creation_timestamp) || null;
			const media = Array.isArray(it.media) ? it.media : [];
			if(creation_timestamp) unified.push({ title, creation_timestamp, media });
		}
	}
	if(otherContent && Array.isArray(otherContent.ig_other_media)){
		for(const oc of otherContent.ig_other_media){
			if(!oc) continue;
			const title = oc.title || '';
			const creation_timestamp = oc.creation_timestamp || (oc.media && oc.media[0] && oc.media[0].creation_timestamp) || null;
			const media = Array.isArray(oc.media) ? oc.media.map(m => ({ uri: m.uri, creation_timestamp: m.creation_timestamp })) : [];
			if(creation_timestamp) unified.push({ title, creation_timestamp, media });
		}
	}
	if(archived && Array.isArray(archived.ig_archived_post_media)){
		for(const ar of archived.ig_archived_post_media){
			if(!ar) continue;
			const title = ar.title || '';
			const creation_timestamp = ar.creation_timestamp || (ar.media && ar.media[0] && ar.media[0].creation_timestamp) || null;
			const media = Array.isArray(ar.media) ? ar.media.map(m => ({ uri: m.uri, creation_timestamp: m.creation_timestamp })) : [];
			if(creation_timestamp) unified.push({ title, creation_timestamp, media });
		}
	}
	unified.sort((a,b)=>a.creation_timestamp-b.creation_timestamp);
	return unified;
}

function findActualMediaPath(relativeUri){
	if(!relativeUri) return null;
	const cleanRel = relativeUri.replace(/^\.?\/?/, '');
	const tryPaths = [
		path.join(mainExportMedia, cleanRel.replace(/^media\//, '')),
		path.join(altExportMedia, cleanRel.replace(/^media\//, '')),
	];
	for(const p of tryPaths){ if(fs.existsSync(p)) return p; }
	return null;
}

function writeReviewMarkdown(ts, caption, imageRelPaths){
	const visitDate = new Date(ts*1000).toISOString().slice(0,10);
	const safeTitle = (()=>{
		if(!caption) return `Food Review ${ts}`;
		const firstBreak = caption.indexOf('\n');
		let sentence = caption.slice(0, firstBreak >= 0 ? firstBreak : Math.min(caption.length, 140));
		const dot = sentence.indexOf('.');
		if(dot > 10) sentence = sentence.slice(0, dot+1);
		return sentence.trim() || `Food Review ${ts}`;
	})();

	const md = [
		'---',
		`title: ${JSON.stringify(safeTitle)}`,
		`description: ${JSON.stringify(`Food review from ${visitDate}`)}`,
		`restaurantName: null`,
		`locationName: ''`,
		`coordinates: null`,
		`visitDate: '${visitDate}'`,
		`author: GusMack1`,
		`authorBio: ''`,
		`featuredImage: ${JSON.stringify(imageRelPaths[0] || '')}`,
		'images:',
		...imageRelPaths.map(p=>`  - ${JSON.stringify(p)}`),
		'pros: []',
		'cons: []',
		'highlights: []',
		'dishes: []',
		'accessibility: []',
		'dietaryOptions: []',
		'bookingInfo:',
		'  phone: ""',
		'  website: ""',
		'  address: ""',
		'  openingHours: ""',
		'tags:',
		'  - instagram',
		'  - food',
		'seoKeywords:',
		'  - glasgow',
		'  - food',
		'  - restaurant',
		'  - review',
		'  - dining',
		'needsLocationApproval: true',
		'locationCandidates: []',
		'relatedRestaurants: []',
		'---',
		'',
		caption || ''
	].join('\n');
	fs.writeFileSync(path.join(reviewsDir, `review-${ts}.md`), md, 'utf8');
}

function copyImagesFor(ts, media){
	const rel = [];
	media.forEach((m, idx)=>{
		if(!m || !m.uri) return;
		const src = findActualMediaPath(m.uri);
		if(!src) return;
		const ext = path.extname(src).toLowerCase() || '.jpg';
		const destName = `review-${ts}-${idx+1}${ext}`;
		const destAbs = path.join(imagesDir, destName);
		ensureDir(path.dirname(destAbs));
		try { fs.copyFileSync(src, destAbs); rel.push(`/images/reviews/${destName}`); } catch(e) { console.error('Copy failed', src, '->', destAbs, e.message); }
	});
	return rel;
}

function clearDirOfMd(dir){ if(fs.existsSync(dir)) for(const f of fs.readdirSync(dir)) if(f.endsWith('.md')) fs.unlinkSync(path.join(dir,f)); }
function clearDirOfImages(dir){ if(fs.existsSync(dir)) for(const f of fs.readdirSync(dir)) if(/^review-\d{9,}-\d+\./.test(f)) try{ fs.unlinkSync(path.join(dir,f)); }catch{} }

function main(){
	console.log('Starting full rebuild from Instagram export...');
	ensureDir(reviewsDir); ensureDir(imagesDir);
	const posts1 = safeReadJson(postsJsonPath);
	const other = safeReadJson(otherContentPath);
	const archived = safeReadJson(archivedPostsPath);
	const unified = normalizeInstagramExports({ posts1, otherContent: other, archived });
	console.log(`Loaded ${unified.length} Instagram posts`);

	clearDirOfMd(reviewsDir);
	clearDirOfImages(imagesDir);

	let total = 0, included = 0, skippedNoFood = 0;
	for(const p of unified){
		total++;
		const caption = (p.title || '').replace(/\r\n/g,'\n');
		if(!isFoodCaption(caption)) { skippedNoFood++; continue; }
		const relPaths = copyImagesFor(p.creation_timestamp, Array.isArray(p.media)?p.media:[]);
		writeReviewMarkdown(p.creation_timestamp, caption, relPaths);
		included++;
	}
	console.log(`Processed ${total} posts. Included ${included}. Skipped (non-food): ${skippedNoFood}.`);
	console.log('Rebuild complete. Next steps: dedupe and QA.');
}

main();
