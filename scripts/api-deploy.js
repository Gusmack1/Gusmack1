const fs = require('fs');
const path = require('path');
const https = require('https');

// GitHub API configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const REPO_OWNER = 'Gusmack1';
const REPO_NAME = 'Gusmack1';
const BRANCH = 'main';

function makeGitHubRequest(endpoint, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: `/repos/${REPO_OWNER}/${REPO_NAME}${endpoint}`,
            method: method,
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'User-Agent': 'GusMack1-Deploy-Script',
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            const postData = JSON.stringify(data);
            options.headers['Content-Length'] = Buffer.byteLength(postData);
        }

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const response = JSON.parse(body);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(response);
                    } else {
                        reject(new Error(`GitHub API Error: ${res.statusCode} - ${JSON.stringify(response)}`));
                    }
                } catch (error) {
                    reject(new Error(`Failed to parse response: ${body}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function getCurrentTree() {
    try {
        const ref = await makeGitHubRequest(`/git/ref/heads/${BRANCH}`);
        const commit = await makeGitHubRequest(`/git/commits/${ref.object.sha}`);
        return commit.tree.sha;
    } catch (error) {
        console.error('Error getting current tree:', error.message);
        return null;
    }
}

async function createBlob(content, encoding = 'utf-8') {
    const data = {
        content: content,
        encoding: encoding
    };
    return await makeGitHubRequest('/git/blobs', 'POST', data);
}

async function createTree(baseTreeSha, files) {
    const tree = files.map(file => ({
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: file.sha
    }));

    const data = {
        base_tree: baseTreeSha,
        tree: tree
    };

    return await makeGitHubRequest('/git/trees', 'POST', data);
}

async function createCommit(message, treeSha, parentSha) {
    const data = {
        message: message,
        tree: treeSha,
        parents: [parentSha]
    };

    return await makeGitHubRequest('/git/commits', 'POST', data);
}

async function updateRef(commitSha) {
    const data = {
        sha: commitSha
    };

    return await makeGitHubRequest(`/git/refs/heads/${BRANCH}`, 'PATCH', data);
}

function getAllFiles(dir, basePath = '') {
    const files = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const relativePath = path.join(basePath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Skip node_modules and .git
            if (item !== 'node_modules' && item !== '.git' && item !== '.next') {
                files.push(...getAllFiles(fullPath, relativePath));
            }
        } else {
            // Skip certain file types
            if (!item.endsWith('.log') && !item.endsWith('.tmp')) {
                files.push(relativePath);
            }
        }
    }

    return files;
}

async function deployToGitHub() {
    console.log('🚀 Starting GitHub API deployment...');

    try {
        // Get current tree SHA
        console.log('📋 Getting current tree...');
        const baseTreeSha = await getCurrentTree();
        if (!baseTreeSha) {
            throw new Error('Failed to get current tree SHA');
        }

        // Get all files to upload
        console.log('📁 Scanning files...');
        const files = getAllFiles('.');
        console.log(`Found ${files.length} files to upload`);

        // Create blobs for all files
        console.log('📤 Creating blobs...');
        const blobs = [];
        let processed = 0;

        for (const file of files) {
            try {
                const content = fs.readFileSync(file, 'utf8');
                const blob = await createBlob(content);
                blobs.push({
                    path: file,
                    sha: blob.sha
                });
                processed++;
                if (processed % 50 === 0) {
                    console.log(`Processed ${processed}/${files.length} files...`);
                }
            } catch (error) {
                console.warn(`Warning: Could not process file ${file}:`, error.message);
            }
        }

        console.log(`✅ Created ${blobs.length} blobs`);

        // Create tree
        console.log('🌳 Creating tree...');
        const tree = await createTree(baseTreeSha, blobs);
        console.log('✅ Tree created:', tree.sha);

        // Get current commit SHA
        const ref = await makeGitHubRequest(`/git/ref/heads/${BRANCH}`);
        const parentSha = ref.object.sha;

        // Create commit
        console.log('💾 Creating commit...');
        const commitMessage = `feat: Add 532 Instagram food reviews with exact content

- Extracted exact post descriptions from Instagram data
- Filtered out non-food content (dogs, cigars, etc.)
- Created structured markdown files with proper frontmatter
- Fixed image paths for better performance
- Added comprehensive food review content
- Total: 532 high-quality food reviews
- Location: Glasgow, Scotland focus
- Tags: instagram, food, glasgow, restaurant reviews

This update transforms the website from empty reviews to a comprehensive
food review platform with authentic Instagram content.`;

        const commit = await createCommit(commitMessage, tree.sha, parentSha);
        console.log('✅ Commit created:', commit.sha);

        // Update ref
        console.log('⬆️ Updating branch...');
        await updateRef(commit.sha);
        console.log('✅ Branch updated successfully!');

        console.log('\n🎉 Deployment completed successfully!');
        console.log('\n📊 Deployment Summary:');
        console.log(`- Repository: https://github.com/${REPO_OWNER}/${REPO_NAME}`);
        console.log(`- Branch: ${BRANCH}`);
        console.log(`- Commit: ${commit.sha}`);
        console.log(`- Files uploaded: ${blobs.length}`);
        console.log(`- Reviews added: 532`);
        console.log('\n🌐 Your website should be live at:');
        console.log('https://gusmack1.com');
        console.log('https://iridescent-cheesecake-335853.netlify.app');

    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        process.exit(1);
    }
}

// Run the deployment
deployToGitHub();
