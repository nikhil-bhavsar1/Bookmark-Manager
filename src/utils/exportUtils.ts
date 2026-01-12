import { BookmarkItem } from './parser';

// Export as JSON
export const exportAsJSON = (data: BookmarkItem[]): string => {
    return JSON.stringify(data, null, 2);
};

// Export as Markdown
export const exportAsMarkdown = (data: BookmarkItem[], level = 1): string => {
    let markdown = '';

    data.forEach(item => {
        if (item.type === 'folder') {
            // Folder becomes a header
            markdown += `${'#'.repeat(level)} ${item.title}\n\n`;
            if (item.children && item.children.length > 0) {
                markdown += exportAsMarkdown(item.children, level + 1);
            }
        } else if (item.type === 'bookmark') {
            // Bookmark becomes a list item with link
            const tags = item.tags && item.tags.length > 0 ? ` \`${item.tags.join('` `')}\`` : '';
            markdown += `- [${item.title}](${item.url})${tags}\n`;
            if (item.description) {
                markdown += `  > ${item.description}\n`;
            }
        }
    });

    return markdown + '\n';
};

// Export as CSV
export const exportAsCSV = (data: BookmarkItem[]): string => {
    const rows: string[] = [];
    rows.push('Title,URL,Category,Tags,Description,Important,Date Added');

    const flattenBookmarks = (items: BookmarkItem[], category = ''): void => {
        items.forEach(item => {
            if (item.type === 'folder') {
                if (item.children) {
                    flattenBookmarks(item.children, item.title);
                }
            } else if (item.type === 'bookmark') {
                const title = `"${(item.title || '').replace(/"/g, '""')}"`;
                const url = `"${(item.url || '').replace(/"/g, '""')}"`;
                const cat = `"${category.replace(/"/g, '""')}"`;
                const tags = `"${(item.tags || []).join('|').replace(/"/g, '""')}"`;
                const desc = `"${(item.description || '').replace(/"/g, '""')}"`;
                const important = item.important ? 'Yes' : 'No';
                const date = item.addDate || '';

                rows.push(`${title},${url},${cat},${tags},${desc},${important},${date}`);
            }
        });
    };

    flattenBookmarks(data);
    return rows.join('\n');
};

// Export as HTML (Netscape Bookmark Format)
export const exportAsHTML = (data: BookmarkItem[]): string => {
    const buildHTML = (items: BookmarkItem[], indent = '    '): string => {
        let html = `${indent}<DL><p>\n`;

        items.forEach(item => {
            if (item.type === 'folder') {
                const addDate = item.addDate || Math.floor(Date.now() / 1000);
                const lastModified = item.lastModified || addDate;

                html += `${indent}    <DT><H3 ADD_DATE="${addDate}" LAST_MODIFIED="${lastModified}">${item.title}</H3>\n`;
                if (item.children && item.children.length > 0) {
                    html += buildHTML(item.children, indent + '    ');
                }
            } else if (item.type === 'bookmark') {
                const addDate = item.addDate || Math.floor(Date.now() / 1000);
                const icon = item.icon ? ` ICON="${item.icon}"` : '';
                const tags = item.tags && item.tags.length > 0 ? ` TAGS="${item.tags.join(',')}"` : '';

                html += `${indent}    <DT><A HREF="${item.url}" ADD_DATE="${addDate}"${icon}${tags}>${item.title}</A>\n`;

                if (item.description) {
                    html += `${indent}    <DD>${item.description}\n`;
                }
            }
        });

        html += `${indent}</DL><p>\n`;
        return html;
    };

    const header = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
`;

    return header + buildHTML(data, '');
};

// Download helper function
export const downloadFile = (content: string, filename: string, mimeType: string): void => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Main export function
export const exportBookmarks = (data: BookmarkItem[], format: 'json' | 'md' | 'csv' | 'html'): void => {
    const timestamp = new Date().toISOString().split('T')[0];

    switch (format) {
        case 'json':
            downloadFile(
                exportAsJSON(data),
                `bookmarks-${timestamp}.json`,
                'application/json'
            );
            break;
        case 'md':
            downloadFile(
                exportAsMarkdown(data),
                `bookmarks-${timestamp}.md`,
                'text/markdown'
            );
            break;
        case 'csv':
            downloadFile(
                exportAsCSV(data),
                `bookmarks-${timestamp}.csv`,
                'text/csv'
            );
            break;
        case 'html':
            downloadFile(
                exportAsHTML(data),
                `bookmarks-${timestamp}.html`,
                'text/html'
            );
            break;
    }
};
