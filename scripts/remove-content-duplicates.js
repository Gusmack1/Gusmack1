const fs = require('fs');
const path = require('path');

const workspaceRoot = path.join(__dirname, '..');
const reviewsDir = path.join(workspaceRoot, 'content', 'reviews');

function readText(file){ return fs.readFileSync(file, 'utf8'); }

function getTimestampFromName(name){ const m = name.match(/(\d{9,})\.md$/); return m ? Number(m[1]) : null; }

function splitFrontmatter(md){
	if (!md.startsWith('---')) return { fm: '', body: md.trim() };
	const end = md.indexOf('\n---', 3);
	if (end === -1) return { fm: '', body: md.trim() };
	return { fm: md.slice(0, end + 4), body: md.slice(end + 4).trim() };
}

function extractImagesFromFM(fm){
	// crude parser: find 'images:' line and collect '- <path>' lines until next top-level key or fm end
	const lines = fm.split(/\r?\n/);
	let inImages = false;
	const images = [];
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (!inImages && /^images:\s*$/.test(line)) { inImages = true; continue; }
		if (inImages) {
			if (/^[a-zA-Z_][a-zA-Z0-9_]*:\s*/.test(line)) break; // next key
			const m = line.match(/^-\s+(.+?)\s*$/);
			if (m) images.push(m[1].trim());
		}
	}
	return images;
}

function normalizeCaption(text){
	return text.replace(/\r/g, '').replace(/\s+/g, ' ').trim();
}

function basename(p){ return path.basename(p); }

function buildKey({ body, images }){
	const cap = normalizeCaption(body);
	const names = images.map(basename).sort().join('|');
	return `${cap}::${names}`;
}

function chooseCanonical(files){
	// keep earliest timestamp; tie-breaker: filename 'review-<ts>.md'
	let best = files[0];
	for (const f of files) {
		const tsF = getTimestampFromName(f);
		const tsB = getTimestampFromName(best);
		if (tsF != null && tsB != null && tsF < tsB) best = f;
	}
	return best;
}

function main(){
	const files = fs.readdirSync(reviewsDir).filter(f => f.endsWith('.md'));
	const groups = new Map();
	for (const f of files) {
		const abs = path.join(reviewsDir, f);
		const md = readText(abs);
		const { fm, body } = splitFrontmatter(md);
		const images = extractImagesFromFM(fm);
		const key = buildKey({ body, images });
		if (!groups.has(key)) groups.set(key, []);
		groups.get(key).push(f);
	}
	let dupGroups = 0; let removed = 0;
	for (const [key, list] of groups.entries()) {
		if (list.length <= 1) continue;
		// skip if caption is empty; don't dedupe empty content automatically
		const sampleAbs = path.join(reviewsDir, list[0]);
		const { body } = splitFrontmatter(readText(sampleAbs));
		if (normalizeCaption(body) === '') continue;
		dupGroups++;
		const keep = chooseCanonical(list);
		for (const f of list) {
			if (f === keep) continue;
			try { fs.unlinkSync(path.join(reviewsDir, f)); removed++; console.log(`Removed duplicate: ${f} (kept ${keep})`); } catch(e) { console.error('Failed to remove', f, e.message); }
		}
	}
	console.log(`Duplicate content groups: ${dupGroups}, files removed: ${removed}`);
}

main();
