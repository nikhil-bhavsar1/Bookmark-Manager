
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IN_FILE = path.join(__dirname, '../public/Main DB.html');
const OUT_FILE = path.join(__dirname, '../src/data/bookmarks.json');

// Ensure output dir exists
const outDir = path.dirname(OUT_FILE);
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

const html = fs.readFileSync(IN_FILE, 'utf-8');

function parseBookmarks(html) {
    const root = { title: 'Root', children: [] };
    const stack = [root];
    let current = root;

    // Pattern for attributes: name="value"
    const folderPattern = /<DT><H3(.*?)>(.*?)<\/H3>/i;
    const bookmarkPattern = /<DT><A(.*?)>(.*?)<\/A>/i;
    const listStartPattern = /<DL>/i;
    const listEndPattern = /<\/DL>/i;

    // Split by lines
    const lines = html.split('\n');

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        if (folderPattern.test(line)) {
            const match = line.match(folderPattern);
            const attrs = match[1];
            const title = match[2];

            const newFolder = {
                type: 'folder',
                title: title,
                addDate: getAttr(attrs, 'ADD_DATE'),
                lastModified: getAttr(attrs, 'LAST_MODIFIED'),
                children: []
            };

            // In Netscape format, H3 is a sibling of the DL that follows it.
            // But structurally we want the DL's content to be children of this H3's folder.
            // So we add this folder to the current children, AND we prepare to enter it.
            // HOWEVER, we only strictly enter it when we see <DL>.
            // So we need to mark this new folder as the "target" for the next <DL>.

            current.children.push(newFolder);
        }
        else if (listStartPattern.test(line)) {
            // <DL> usually follows <H3>. It means "start list of children for the preceding header".
            // So we look at the last child of 'current'. If it's a folder, we enter it.
            if (current.children.length > 0) {
                const lastChild = current.children[current.children.length - 1];
                if (lastChild.type === 'folder') {
                    stack.push(lastChild);
                    current = lastChild;
                }
            }
        }
        else if (listEndPattern.test(line)) {
            if (stack.length > 1) { // Don't pop root
                stack.pop();
                current = stack[stack.length - 1];
            }
        }
        else if (bookmarkPattern.test(line)) {
            const match = line.match(bookmarkPattern);
            const attrs = match[1];
            const title = match[2];

            const bookmark = {
                type: 'link',
                title: title,
                url: getAttr(attrs, 'HREF'),
                icon: getAttr(attrs, 'ICON'),
                cover: getAttr(attrs, 'DATA-COVER'),
                tags: getAttr(attrs, 'TAGS') ? getAttr(attrs, 'TAGS').split(',') : [],
                important: getAttr(attrs, 'DATA-IMPORTANT') === 'true',
                addDate: getAttr(attrs, 'ADD_DATE'),
            };
            current.children.push(bookmark);
        }
    }

    return root.children;
}

function getAttr(str, name) {
    const regex = new RegExp(`${name}="(.*?)"`, 'i');
    const match = str.match(regex);
    return match ? match[1] : '';
}

console.log('Parsing bookmarks...');
const data = parseBookmarks(html);
console.log(`Found ${data.length} top-level items.`);

fs.writeFileSync(OUT_FILE, JSON.stringify(data, null, 2));
console.log(`Saved to ${OUT_FILE}`);
