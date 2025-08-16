const fs = require('fs');
const path = require('path');

const workspaceRoot = path.join(__dirname, '..');
const reviewsDir = path.join(workspaceRoot, 'content', 'reviews');

function readFileSafe(filePath) {
	try { return fs.readFileSync(filePath, 'utf8'); } catch { return ''; }
}

function parseMarkdown(md) {
	if (!md.startsWith('---')) return { frontmatter: '', body: md.trim() };
	const end = md.indexOf('\n---', 3);
	if (end === -1) return { frontmatter: '', body: md.trim() };
	const fm = md.slice(0, end + 4);
	const body = md.slice(end + 4).trim();
	return { frontmatter: fm, body };
}

function getTimestampFromName(name) {
	const m = name.match(/(\d{9,})\.md$/);
	return m ? m[1] : null;
}

function scoreFileContent(content) {
	const { body } = parseMarkdown(content);
	// Score by non-empty body and length to prefer richer content
	const nonEmpty = body.trim().length > 0 ? 1000000 : 0;
	return nonEmpty + body.length;
}

function chooseCanonical(files) {
	// Prefer exact canonical name review-<ts>.md, otherwise highest score
	const canonical = files.find(f => /^review-\d{9,}\.md$/.test(f));
	if (canonical) return canonical;
	let best = files[0];
	let bestScore = -1;
	for (const f of files) {
		const content = readFileSafe(path.join(reviewsDir, f));
		const s = scoreFileContent(content);
		if (s > bestScore) { best = f; bestScore = s; }
	}
	return best;
}

function main() {
	const all = fs.readdirSync(reviewsDir).filter(f => f.endsWith('.md'));
	const map = new Map();
	for (const f of all) {
		const ts = getTimestampFromName(f);
		if (!ts) continue;
		if (!map.has(ts)) map.set(ts, []);
		map.get(ts).push(f);
	}
	let duplicateGroups = 0;
	let removed = 0;
	const toRemove = [];
	for (const [ts, files] of map.entries()) {
		if (files.length <= 1) continue;
		duplicateGroups++;
		const keep = chooseCanonical(files);
		for (const f of files) {
			if (f === keep) continue;
			toRemove.push(f);
		}
	}
	for (const f of toRemove) {
		try {
			fs.unlinkSync(path.join(reviewsDir, f));
			removed++;
			console.log(`Removed duplicate: ${f}`);
		} catch (e) {
			console.error(`Failed to remove ${f}: ${e.message}`);
		}
	}
	console.log(`Duplicate groups: ${duplicateGroups}, files removed: ${removed}`);
}

main();
