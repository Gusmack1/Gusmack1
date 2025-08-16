const fs = require('fs');
const path = require('path');

const workspaceRoot = path.join(__dirname, '..');
const reviewsDir = path.join(workspaceRoot, 'content', 'reviews');
const outputDir = path.join(__dirname, 'output');
const reportPath = path.join(outputDir, 'review_audit.csv');

function ensureDir(d){ if(!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

function readFileSafe(p){ try { return fs.readFileSync(p, 'utf8'); } catch { return ''; } }

function splitFrontmatter(md){
	if(!md.startsWith('---')) return { fm:'', body: md.trim() };
	const end = md.indexOf('\n---', 3);
	if(end === -1) return { fm:'', body: md.trim() };
	return { fm: md.slice(0, end+4), body: md.slice(end+4).trim() };
}

function extractField(fm, key){
	const re = new RegExp(`^${key}:\s*(.+)$`, 'mi');
	const m = fm.match(re);
	if(!m) return null;
	let v = m[1].trim();
	if((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1,-1);
	return v;
}

function extractImagesArray(fm){
	const lines = fm.split(/\r?\n/);
	let inImages = false; const arr = [];
	for(const line of lines){
		if(!inImages && /^images:\s*$/.test(line)) { inImages = true; continue; }
		if(inImages){
			if (/^[a-zA-Z_][a-zA-Z0-9_]*:\s*/.test(line)) break;
			const m = line.match(/^-\s+(.+?)\s*$/);
			if(m){
				let v = m[1].trim();
				if((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1,-1);
				arr.push(v);
			}
		}
	}
	return arr;
}

function existsRel(rel){
	const p = rel.startsWith('/') ? path.join(workspaceRoot, 'public', rel.replace(/^\//,'')) : path.join(workspaceRoot, rel);
	return fs.existsSync(p) ? '' : 'missing';
}

function csvEscape(s){
	if(s == null) return '';
	const t = String(s);
	if(/[",\n]/.test(t)) return '"' + t.replace(/"/g,'""') + '"';
	return t;
}

function main(){
	ensureDir(outputDir);
	const files = fs.readdirSync(reviewsDir).filter(f => f.endsWith('.md'));
	const rows = [
		['timestamp','file','hasCaption','featuredImage','featuredExists','imageCount','missingImages','notes'].join(',')
	];
	for(const f of files){
		const abs = path.join(reviewsDir, f);
		const tsMatch = f.match(/(\d{9,})/);
		const ts = tsMatch ? tsMatch[1] : '';
		const md = readFileSafe(abs);
		const { fm, body } = splitFrontmatter(md);
		const featured = extractField(fm, 'featuredImage') || '';
		const images = extractImagesArray(fm);
		const hasCaption = body && body.trim().length > 0;
		const featMissing = featured ? existsRel(featured) : 'missing';
		let missing = 0;
		for(const rel of images){ if(existsRel(rel) === 'missing') missing++; }
		const notes = [];
		if(!hasCaption) notes.push('no-caption');
		if(featMissing === 'missing') notes.push('featured-missing');
		if(missing>0) notes.push('some-images-missing');
		rows.push([
			ts, f, hasCaption ? 'yes':'no', featured, featMissing ? featMissing : '', images.length, missing, notes.join('|')
		].map(csvEscape).join(','));
	}
	fs.writeFileSync(reportPath, rows.join('\n'), 'utf8');
	console.log(`QA report written to ${reportPath}`);
}

main();
