const fs = require('fs');
const path = require('path');

const workspaceRoot = path.join(__dirname, '..');
const reviewsDir = path.join(workspaceRoot, 'content', 'reviews');
const imagesDir = path.join(workspaceRoot, 'public', 'images', 'reviews');

function ensureDir(dir){ if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }
ensureDir(imagesDir);

function escapeRegex(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function updateFrontmatterImagePaths(md, ts){
	// Replace any /images/reviews/<anything>-<ts>-<num>.<ext> with /images/reviews/review-<ts>-<num>.<ext>
	const re = new RegExp(`/images/reviews/[^'"\n]*-${ts}-(\\d+)\\.(heic|jpg|jpeg|webp|png)`, 'gi');
	return md.replace(re, (m, idx, ext) => `/images/reviews/review-${ts}-${idx}.${ext}`);
}

function renameImagesForBase(baseSlug, ts){
	const files = fs.readdirSync(imagesDir);
	const prefix = `${baseSlug}-${ts}-`;
	const out = [];
	for(const f of files){
		if(!f.startsWith(prefix)) continue;
		const m = f.match(new RegExp(`^${escapeRegex(baseSlug)}-${ts}-(\\d+)\\.(heic|jpg|jpeg|webp|png)$`, 'i'));
		if(!m) continue;
		const idx = m[1];
		const ext = m[2];
		const src = path.join(imagesDir, f);
		const destName = `review-${ts}-${idx}.${ext}`;
		const dest = path.join(imagesDir, destName);
		if(src === dest) { out.push(destName); continue; }
		try{ fs.renameSync(src, dest); out.push(destName); } catch(e){ console.error('Image rename failed', f, '->', destName, e.message); }
	}
	return out;
}

function processOne(file){
	const abs = path.join(reviewsDir, file);
	const m = file.match(/^(.*)-(\d{9,})\.md$/);
	if(!m) return { skipped: true };
	const baseSlug = m[1];
	const ts = m[2];
	const newName = `review-${ts}.md`;
	const newAbs = path.join(reviewsDir, newName);
	let content = fs.readFileSync(abs, 'utf8');
	// Update image paths in frontmatter/body
	content = updateFrontmatterImagePaths(content, ts);
	// Write first to same file (in case rename fails later)
	fs.writeFileSync(abs, content, 'utf8');
	// Rename corresponding images
	renameImagesForBase(baseSlug, ts);
	// If filename already okay, done
	if(file === newName) return { renamed: false, newName };
	try{ fs.renameSync(abs, newAbs); return { renamed: true, newName }; } catch(e){ console.error('MD rename failed', file, '->', newName, e.message); return { renamed: false, error: e.message }; }
}

function main(){
	const files = fs.readdirSync(reviewsDir).filter(f => f.endsWith('.md'));
	let renamed = 0, skipped = 0;
	for(const f of files){
		const res = processOne(f);
		if(res.skipped) { skipped++; continue; }
		if(res.renamed) renamed++;
	}
	console.log(`Normalized review paths. Renamed ${renamed}, skipped ${skipped}.`);
}

main();
