
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '../src/data/bookmarks.json');
const COVERS_DIR = path.join(__dirname, '../public/covers');

if (!fs.existsSync(COVERS_DIR)) {
    fs.mkdirSync(COVERS_DIR, { recursive: true });
}

const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

async function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const protocol = url.startsWith('https') ? https : http;

        const request = protocol.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(() => resolve(true));
                });
            } else {
                fs.unlink(dest, () => { }); // Delete failed file
                resolve(false); // Resolve false instead of reject to keep going
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            resolve(false);
        });

        request.setTimeout(5000, () => {
            request.destroy();
            resolve(false);
        });
    });
}

function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

function getExtension(url) {
    const ext = path.extname(url).split('?')[0];
    if (ext && ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext.toLowerCase())) {
        return ext;
    }
    return '.jpg'; // Default
}

async function processNode(node) {
    if (node.cover && node.cover.startsWith('http')) {
        const hash = md5(node.cover);
        const ext = getExtension(node.cover);
        const filename = `${hash}${ext}`;
        const filePath = path.join(COVERS_DIR, filename);
        const publicPath = `/covers/${filename}`;

        if (fs.existsSync(filePath)) {
            node.cover = publicPath;
        } else {
            console.log(`Downloading ${node.cover}...`);
            const success = await downloadImage(node.cover, filePath);
            if (success) {
                node.cover = publicPath;
            } else {
                console.log(`Failed to download ${node.cover}`);
            }
        }
    }

    if (node.children) {
        for (const child of node.children) {
            await processNode(child);
        }
    }
}

async function main() {
    console.log('Starting image caching...');
    // Traverse recursively
    for (const node of data) {
        await processNode(node);
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log('Image caching complete. Updated bookmarks.json');
}

main();
