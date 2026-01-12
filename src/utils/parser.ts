export interface BookmarkItem {
    id: string;
    type: 'folder' | 'bookmark';
    title: string;
    url?: string;
    icon?: string;
    addDate?: string;
    lastModified?: string;
    tags?: string[];
    children?: BookmarkItem[];
    description?: string;
    cover?: string;
    important?: boolean;
}

export const parseBookmarks = (htmlContent: string): BookmarkItem[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    const rootDl = doc.querySelector('dl');
    if (!rootDl) return [];

    const parseDL = (dl: HTMLDListElement): BookmarkItem[] => {
        const items: BookmarkItem[] = [];
        const children = Array.from(dl.children);

        for (let i = 0; i < children.length; i++) {
            const child = children[i] as HTMLElement;

            // Skip DL and P elements
            if (child.tagName === 'DL' || child.tagName === 'P') continue;

            // Skip non-DT elements
            if (child.tagName !== 'DT') continue;

            const dt = child;

            // Check for Folder (H3)
            const h3 = dt.querySelector('h3');
            if (h3) {
                const folder: BookmarkItem = {
                    id: crypto.randomUUID(),
                    type: 'folder',
                    title: h3.textContent || 'Untitled',
                    addDate: h3.getAttribute('ADD_DATE') || undefined,
                    lastModified: h3.getAttribute('LAST_MODIFIED') || undefined,
                    children: []
                };

                // Due to unclosed DT tags in the Netscape bookmark format,
                // the browser's DOMParser nests the DL inside the DT element
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
                const bookmark: BookmarkItem = {
                    id: crypto.randomUUID(),
                    type: 'bookmark',
                    title: a.textContent || 'Untitled',
                    url: a.getAttribute('HREF') || undefined,
                    icon: a.getAttribute('ICON') || undefined,
                    addDate: a.getAttribute('ADD_DATE') || undefined,
                    tags: a.getAttribute('TAGS')?.split(',').filter(Boolean) || [],
                    description: undefined
                };

                // Check if there is a DD (Description) following this DT
                let nextSibling = dt.nextElementSibling as HTMLElement | null;
                if (nextSibling && nextSibling.tagName === 'DD') {
                    bookmark.description = nextSibling.textContent?.trim();
                }

                // Custom attributes from Raindrop
                const cover = a.getAttribute('DATA-COVER');
                if (cover) {
                    (bookmark as any).cover = cover;
                }

                items.push(bookmark);
            }
        }
        return items;
    };

    return parseDL(rootDl);
};
