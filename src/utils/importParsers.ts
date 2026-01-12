import { BookmarkItem } from './parser';

// Parse Markdown files into bookmark structure
export const parseMarkdown = (content: string): BookmarkItem[] => {
    const lines = content.split('\n');
    const items: BookmarkItem[] = [];
    const folderStack: { item: BookmarkItem; level: number }[] = [];
    let currentFolder: BookmarkItem | null = null;

    lines.forEach((line) => {
        // Skip empty lines
        if (!line.trim()) return;

        // Detect headers (sections become folders)
        const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
        if (headerMatch && headerMatch[1] && headerMatch[2]) {
            const level = headerMatch[1].length;
            const title = headerMatch[2].trim();

            const folder: BookmarkItem = {
                id: crypto.randomUUID(),
                type: 'folder',
                title,
                children: []
            };

            // Pop folders from stack that are at same or deeper level
            while (folderStack.length > 0 && folderStack[folderStack.length - 1]!.level >= level) {
                folderStack.pop();
            }

            if (folderStack.length === 0) {
                items.push(folder);
            } else {
                const parent = folderStack[folderStack.length - 1]!.item;
                parent.children = parent.children || [];
                parent.children.push(folder);
            }

            folderStack.push({ item: folder, level });
            currentFolder = folder;
            return;
        }

        // Detect markdown links: [Title](URL)
        const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/g);
        if (linkMatch) {
            linkMatch.forEach(match => {
                const parts = match.match(/\[([^\]]+)\]\(([^)]+)\)/);
                if (parts && parts[1] && parts[2]) {
                    const title = parts[1].trim();
                    const url = parts[2].trim();

                    const bookmark: BookmarkItem = {
                        id: crypto.randomUUID(),
                        type: 'bookmark',
                        title,
                        url,
                        addDate: String(Math.floor(Date.now() / 1000)),
                        tags: []
                    };

                    if (currentFolder) {
                        currentFolder.children = currentFolder.children || [];
                        currentFolder.children.push(bookmark);
                    } else {
                        items.push(bookmark);
                    }
                }
            });
            return;
        }

        // Detect list items: - [Title](URL) or * [Title](URL)
        const listMatch = line.match(/^[\s]*[-*]\s+(.+)$/);
        if (listMatch) {
            const content = listMatch[1];
            const linkParts = content.match(/\[([^\]]+)\]\(([^)]+)\)/);

            if (linkParts) {
                const title = linkParts[1].trim();
                const url = linkParts[2].trim();

                const bookmark: BookmarkItem = {
                    id: crypto.randomUUID(),
                    type: 'bookmark',
                    title,
                    url,
                    addDate: String(Math.floor(Date.now() / 1000)),
                    tags: []
                };

                if (currentFolder) {
                    currentFolder.children = currentFolder.children || [];
                    currentFolder.children.push(bookmark);
                } else {
                    items.push(bookmark);
                }
            } else {
                // Plain text list item - could be a simple URL
                const urlMatch = content.match(/(https?:\/\/[^\s]+)/);
                if (urlMatch) {
                    const url = urlMatch[1];
                    const title = content.replace(url, '').trim() || url;

                    const bookmark: BookmarkItem = {
                        id: crypto.randomUUID(),
                        type: 'bookmark',
                        title,
                        url,
                        addDate: String(Math.floor(Date.now() / 1000)),
                        tags: []
                    };

                    if (currentFolder) {
                        currentFolder.children = currentFolder.children || [];
                        currentFolder.children.push(bookmark);
                    } else {
                        items.push(bookmark);
                    }
                }
            }
        }
    });

    return items;
};

// Parse CSV files into bookmark structure
export const parseCSV = (content: string): BookmarkItem[] => {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    // Detect if first line is header
    const firstLine = lines[0];
    if (!firstLine) return [];

    const hasHeader = firstLine.toLowerCase().includes('title') ||
        firstLine.toLowerCase().includes('url') ||
        firstLine.toLowerCase().includes('name');

    const dataLines = hasHeader ? lines.slice(1) : lines;
    const items: BookmarkItem[] = [];
    const folders = new Map<string, BookmarkItem>();

    dataLines.forEach(line => {
        // Simple CSV parsing (handles basic cases)
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));

        if (values.length < 2) return;

        // Assume at least: title/name, url, [category/folder], [tags]
        const title = values[0] || 'Untitled';
        const url = values[1];
        const category = values[2] || '';
        const tagsStr = values[3] || '';

        const bookmark: BookmarkItem = {
            id: crypto.randomUUID(),
            type: 'bookmark',
            title,
            url,
            addDate: String(Math.floor(Date.now() / 1000)),
            tags: tagsStr ? tagsStr.split('|').map(t => t.trim()).filter(Boolean) : []
        };

        if (category) {
            // Create or get folder
            if (!folders.has(category)) {
                const folder: BookmarkItem = {
                    id: crypto.randomUUID(),
                    type: 'folder',
                    title: category,
                    children: []
                };
                folders.set(category, folder);
                items.push(folder);
            }
            const folder = folders.get(category)!;
            folder.children = folder.children || [];
            folder.children.push(bookmark);
        } else {
            items.push(bookmark);
        }
    });

    return items;
};

// Enhanced HTML parser that handles nested structure better
export const parseHTML = (content: string): BookmarkItem[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');

    const rootDl = doc.querySelector('dl');
    if (!rootDl) {
        // Fallback: try to find links in the document
        const links = doc.querySelectorAll('a[href]');
        const items: BookmarkItem[] = [];

        links.forEach(link => {
            const url = link.getAttribute('href');
            if (url && !url.startsWith('javascript:')) {
                items.push({
                    id: crypto.randomUUID(),
                    type: 'bookmark',
                    title: link.textContent?.trim() || 'Untitled',
                    url,
                    addDate: String(Math.floor(Date.now() / 1000)),
                    tags: []
                });
            }
        });

        return items;
    }

    const parseDL = (dl: HTMLDListElement): BookmarkItem[] => {
        const items: BookmarkItem[] = [];
        const children = Array.from(dl.children);

        for (let i = 0; i < children.length; i++) {
            const child = children[i] as HTMLElement;

            if (child.tagName === 'DL' || child.tagName === 'P') continue;
            if (child.tagName !== 'DT') continue;

            const dt = child;

            // Check for Folder (H3 or H1-H6)
            const heading = dt.querySelector('h1, h2, h3, h4, h5, h6');
            if (heading) {
                const folder: BookmarkItem = {
                    id: crypto.randomUUID(),
                    type: 'folder',
                    title: heading.textContent?.trim() || 'Untitled',
                    addDate: heading.getAttribute('ADD_DATE') || String(Math.floor(Date.now() / 1000)),
                    lastModified: heading.getAttribute('LAST_MODIFIED') || undefined,
                    children: []
                };

                const nestedDL = dt.querySelector('dl');
                if (nestedDL) {
                    folder.children = parseDL(nestedDL as HTMLDListElement);
                }

                items.push(folder);
                continue;
            }

            // Check for Bookmark (A)
            const a = dt.querySelector('a');
            if (a) {
                const url = a.getAttribute('HREF') || a.getAttribute('href');
                if (url && !url.startsWith('javascript:')) {
                    const bookmark: BookmarkItem = {
                        id: crypto.randomUUID(),
                        type: 'bookmark',
                        title: a.textContent?.trim() || 'Untitled',
                        url,
                        icon: a.getAttribute('ICON') || a.getAttribute('icon') || undefined,
                        addDate: a.getAttribute('ADD_DATE') || String(Math.floor(Date.now() / 1000)),
                        tags: a.getAttribute('TAGS')?.split(',').filter(Boolean) || [],
                        description: undefined
                    };

                    // Check for description
                    let nextSibling = dt.nextElementSibling as HTMLElement | null;
                    if (nextSibling?.tagName === 'DD') {
                        bookmark.description = nextSibling.textContent?.trim();
                    }

                    // Custom attributes
                    const cover = a.getAttribute('DATA-COVER') || a.getAttribute('data-cover');
                    if (cover) {
                        bookmark.cover = cover;
                    }

                    items.push(bookmark);
                }
            }
        }
        return items;
    };

    return parseDL(rootDl);
};

// Auto-detect format and parse
export const parseImportedFile = (content: string, filename: string): BookmarkItem[] => {
    const ext = filename.split('.').pop()?.toLowerCase();

    try {
        if (ext === 'json') {
            return JSON.parse(content);
        } else if (ext === 'md' || ext === 'markdown') {
            return parseMarkdown(content);
        } else if (ext === 'csv') {
            return parseCSV(content);
        } else if (ext === 'html' || ext === 'htm') {
            return parseHTML(content);
        } else {
            // Try to auto-detect
            const trimmed = content.trim();
            if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
                return JSON.parse(content);
            } else if (trimmed.includes('<!DOCTYPE') || trimmed.includes('<html') || trimmed.includes('<DL')) {
                return parseHTML(content);
            } else if (trimmed.includes('#') || trimmed.includes('[') && trimmed.includes('](')) {
                return parseMarkdown(content);
            } else {
                return parseCSV(content);
            }
        }
    } catch (error) {
        console.error('Failed to parse imported file:', error);
        throw new Error(`Failed to parse ${filename}: ${error}`);
    }
};
