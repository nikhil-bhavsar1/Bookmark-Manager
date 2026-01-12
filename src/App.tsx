
import { useEffect, useState, useMemo } from 'react';
import { BookmarkItem } from './utils/parser';
import bookmarksRaw from './data/bookmarks.json';
import { Sidebar } from './components/Sidebar';
import { BookmarkGrid } from './components/BookmarkGrid';
import { BookmarkPreview } from './components/BookmarkPreview';
import { BookmarkForm } from './components/BookmarkForm';
import { FolderForm } from './components/FolderForm';
import { ImportExportModal } from './components/ImportExportModal';
import { FlowingPlasma } from './components/FlowingPlasma';
import { SettingsPanel } from './components/SettingsPanel';
import { ViewControls, ViewMode, SortOption } from './components/ViewControls';
import { ListView } from './components/ListView';
import { CarouselView } from './components/CarouselView';
import { Search, Plus, FolderPlus, Upload, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'bookmarks-data';
const THEME_KEY = 'app-theme';
const MODE_KEY = 'app-mode';
const FONT_COLOR_KEY = 'app-font-color';
const BG_IMAGE_KEY = 'app-bg-image';

function App() {
    const [data, setData] = useState<BookmarkItem[]>([]);
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('grid-md');
    const [sortOption, setSortOption] = useState<SortOption>('date-desc');
    const [loading, setLoading] = useState(true);
    const [selectedBookmark, setSelectedBookmark] = useState<BookmarkItem | null>(null);
    const [editingBookmark, setEditingBookmark] = useState<BookmarkItem | null>(null);
    const [editingFolder, setEditingFolder] = useState<BookmarkItem | null>(null);
    const [showBookmarkForm, setShowBookmarkForm] = useState(false);
    const [showFolderForm, setShowFolderForm] = useState(false);
    const [showImportExport, setShowImportExport] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'plasma');
    const [isDark, setIsDark] = useState(() => localStorage.getItem(MODE_KEY) !== 'light');
    const [fontColor, setFontColor] = useState(() => localStorage.getItem(FONT_COLOR_KEY) || 'auto');
    const [bgImage, setBgImage] = useState(() => localStorage.getItem(BG_IMAGE_KEY) || '');

    // Apply theme, mode, and font color to body
    useEffect(() => {
        const classes = [
            isDark ? 'dark-mode' : 'light-mode',
            `theme-${theme}`,
            fontColor !== 'auto' ? `font-${fontColor}` : ''
        ].filter(Boolean);

        document.body.className = classes.join(' ');
        localStorage.setItem(THEME_KEY, theme);
        localStorage.setItem(MODE_KEY, isDark ? 'dark' : 'light');
        localStorage.setItem(FONT_COLOR_KEY, fontColor);
        localStorage.setItem(BG_IMAGE_KEY, bgImage);
    }, [theme, isDark, fontColor, bgImage]);

    // Load from localStorage on mount
    useEffect(() => {
        const transform = (items: any[]): BookmarkItem[] => {
            return items.map(item => ({
                id: item.id || crypto.randomUUID(),
                type: item.type === 'link' ? 'bookmark' : item.type,
                title: item.title,
                url: item.url,
                icon: item.icon,
                cover: item.cover,
                tags: item.tags,
                addDate: item.addDate,
                lastModified: item.lastModified,
                important: item.important,
                description: item.description,
                children: item.children ? transform(item.children) : undefined
            }));
        };

        try {
            // Try to load from localStorage first
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setData(transform(parsed));
            } else {
                // Fallback to initial data if exists
                const initialData = Array.isArray(bookmarksRaw) ? bookmarksRaw : [];
                const parsed = transform(initialData);
                setData(parsed);
                if (parsed.length > 0) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
                }
            }
        } catch (err) {
            console.error('Failed to load bookmarks', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Save to localStorage whenever data changes
    useEffect(() => {
        if (!loading && data.length >= 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
    }, [data, loading]);

    const folders = useMemo(() => {
        // Recursively extract all folders (including nested ones)
        const extractFolders = (items: BookmarkItem[]): BookmarkItem[] => {
            const result: BookmarkItem[] = [];
            items.forEach(item => {
                if (item.type === 'folder') {
                    result.push(item);
                    if (item.children) {
                        result.push(...extractFolders(item.children));
                    }
                }
            });
            return result;
        };
        return extractFolders(data);
    }, [data]);

    const displayedBookmarks = useMemo(() => {
        let items: BookmarkItem[] = [];

        // Helper to recursively get all bookmarks from a folder
        const getAllBookmarks = (folder: BookmarkItem): BookmarkItem[] => {
            const bookmarks: BookmarkItem[] = [];
            if (folder.children) {
                folder.children.forEach(child => {
                    if (child.type === 'bookmark') {
                        bookmarks.push(child);
                    } else if (child.type === 'folder') {
                        bookmarks.push(...getAllBookmarks(child));
                    }
                });
            }
            return bookmarks;
        };

        // Filter by Folder
        if (selectedFolderId) {
            const folder = folders.find(f => f.id === selectedFolderId);
            if (folder) {
                items = getAllBookmarks(folder);
            }
        } else {
            // Flatten all bookmarks if "All" is selected
            const getAllBookmarksFromData = (items: BookmarkItem[]): BookmarkItem[] => {
                const bookmarks: BookmarkItem[] = [];
                items.forEach(item => {
                    if (item.type === 'bookmark') {
                        bookmarks.push(item);
                    } else if (item.type === 'folder' && item.children) {
                        bookmarks.push(...getAllBookmarksFromData(item.children));
                    }
                });
                return bookmarks;
            };
            items = getAllBookmarksFromData(data);
        }

        // Filter by Search
        if (searchQuery) {
            const lowerQ = searchQuery.toLowerCase();
            items = items.filter(item =>
                item.title.toLowerCase().includes(lowerQ) ||
                item.url?.toLowerCase().includes(lowerQ) ||
                item.description?.toLowerCase().includes(lowerQ)
            );
        }

        // Apply Sorting
        return items.sort((a, b) => {
            switch (sortOption) {
                case 'name-asc':
                    return a.title.localeCompare(b.title);
                case 'name-desc':
                    return b.title.localeCompare(a.title);
                case 'date-asc':
                    return (parseInt(a.addDate || '0') - parseInt(b.addDate || '0'));
                case 'date-desc':
                default:
                    return (parseInt(b.addDate || '0') - parseInt(a.addDate || '0'));
            }
        });
    }, [data, selectedFolderId, searchQuery, folders, sortOption]);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        const traverse = (items: BookmarkItem[]) => {
            items.forEach(item => {
                if (item.tags) item.tags.forEach(t => tags.add(t));
                if (item.children) traverse(item.children);
            });
        };
        traverse(data);
        return Array.from(tags).sort();
    }, [data]);

    // CRUD Handlers
    const handleSaveBookmark = (bookmark: Partial<BookmarkItem>) => {
        if (editingBookmark) {
            // Update existing bookmark
            const updateInTree = (items: BookmarkItem[]): BookmarkItem[] => {
                return items.map(item => {
                    if (item.id === editingBookmark.id) {
                        return { ...item, ...bookmark };
                    }
                    if (item.children) {
                        return { ...item, children: updateInTree(item.children) };
                    }
                    return item;
                });
            };
            setData(updateInTree(data));
            setEditingBookmark(null);
        } else {
            // Create new bookmark
            const newBookmark: BookmarkItem = {
                id: crypto.randomUUID(),
                type: 'bookmark',
                title: bookmark.title || '',
                url: bookmark.url || '',
                description: bookmark.description,
                tags: bookmark.tags,
                addDate: String(Math.floor(Date.now() / 1000))
            };

            if (selectedFolderId) {
                // Add to selected folder
                const addToFolder = (items: BookmarkItem[]): BookmarkItem[] => {
                    return items.map(item => {
                        if (item.id === selectedFolderId) {
                            return {
                                ...item,
                                children: [...(item.children || []), newBookmark]
                            };
                        }
                        if (item.children) {
                            return { ...item, children: addToFolder(item.children) };
                        }
                        return item;
                    });
                };
                setData(addToFolder(data));
            } else {
                // Add to root
                setData([...data, newBookmark]);
            }
        }
        setShowBookmarkForm(false);
    };

    const handleDeleteBookmark = (bookmark: BookmarkItem) => {
        const deleteFromTree = (items: BookmarkItem[]): BookmarkItem[] => {
            return items.filter(item => item.id !== bookmark.id).map(item => {
                if (item.children) {
                    return { ...item, children: deleteFromTree(item.children) };
                }
                return item;
            });
        };
        setData(deleteFromTree(data));
    };

    const handleSaveFolder = (folder: Partial<BookmarkItem>) => {
        if (editingFolder) {
            // Update existing folder
            const updateInTree = (items: BookmarkItem[]): BookmarkItem[] => {
                return items.map(item => {
                    if (item.id === editingFolder.id) {
                        return { ...item, ...folder };
                    }
                    if (item.children) {
                        return { ...item, children: updateInTree(item.children) };
                    }
                    return item;
                });
            };
            setData(updateInTree(data));
            setEditingFolder(null);
        } else {
            // Create new folder
            const newFolder: BookmarkItem = {
                id: crypto.randomUUID(),
                type: 'folder',
                title: folder.title || '',
                children: []
            };
            setData([...data, newFolder]);
        }
        setShowFolderForm(false);
    };

    const handleEditBookmark = (item: BookmarkItem) => {
        setEditingBookmark(item);
        setShowBookmarkForm(true);
        setSelectedBookmark(null);
    };

    const handleRenameFolder = (folder: BookmarkItem) => {
        setEditingFolder(folder);
        setShowFolderForm(true);
    };

    const handleDeleteFolder = (folder: BookmarkItem) => {
        if (confirm(`Delete folder "${folder.title}" and all its contents?`)) {
            const deleteFromTree = (items: BookmarkItem[]): BookmarkItem[] => {
                return items.filter(item => item.id !== folder.id).map(item => {
                    if (item.children) {
                        return { ...item, children: deleteFromTree(item.children) };
                    }
                    return item;
                });
            };
            setData(deleteFromTree(data));
            if (selectedFolderId === folder.id) {
                setSelectedFolderId(null);
            }
        }
    };

    const handleImport = (items: BookmarkItem[]) => {
        // Merge imported items with existing data
        setData([...data, ...items]);
    };


    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>Loading Bookmarks...</div>
            </div>
        );
    }



    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <FlowingPlasma
                theme={theme}
                isDark={isDark}
                bgImage={bgImage}
            />
            <Sidebar
                folders={folders}
                selectedFolderId={selectedFolderId}
                onSelectFolder={setSelectedFolderId}
                onRenameFolder={handleRenameFolder}
                onDeleteFolder={handleDeleteFolder}
            />

            <main style={{ flex: 1, padding: '24px', maxWidth: '1600px' }}>
                <header style={{
                    marginBottom: '32px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 24px'
                }}>
                    <motion.div
                        className="glass"
                        whileHover={{
                            backgroundColor: 'rgba(255, 255, 255, 0.12)',
                            transition: {
                                duration: 0.2,
                                delay: 0.05
                            }
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 24px',
                            borderRadius: '50px',
                            width: '100%',
                            maxWidth: '600px'
                        }}
                    >
                        <Search size={20} style={{ opacity: 0.5, marginRight: '12px' }} />
                        <input
                            type="text"
                            placeholder="Search bookmarks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'inherit',
                                width: '100%',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </motion.div>
                </header>

                <ViewControls
                    viewMode={viewMode}
                    onViewChange={setViewMode}
                    sortOption={sortOption}
                    onSortChange={setSortOption}
                />

                {viewMode === 'list' ? (
                    <ListView items={displayedBookmarks} onCardClick={setSelectedBookmark} />
                ) : viewMode === 'carousel' ? (
                    <CarouselView items={displayedBookmarks} onCardClick={setSelectedBookmark} />
                ) : (
                    <BookmarkGrid
                        items={displayedBookmarks}
                        onCardClick={setSelectedBookmark}
                        size={viewMode === 'grid-sm' ? 'sm' : viewMode === 'grid-lg' ? 'lg' : 'md'}
                    />
                )}
            </main>

            {/* Floating Action Buttons */}
            <div style={{
                position: 'fixed',
                bottom: '32px',
                right: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                zIndex: 100
            }}>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowImportExport(true)}
                    style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(255, 169, 107, 0.3), rgba(255, 169, 107, 0.2))',
                        backdropFilter: 'blur(20px)',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(255, 169, 107, 0.3)',
                        border: '1px solid rgba(255, 169, 107, 0.4)'
                    }}
                    title="Import/Export"
                >
                    <Upload size={22} />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFolderForm(true)}
                    style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(169, 255, 107, 0.3), rgba(169, 255, 107, 0.2))',
                        backdropFilter: 'blur(20px)',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(169, 255, 107, 0.3)',
                        border: '1px solid rgba(169, 255, 107, 0.4)'
                    }}
                    title="New Folder"
                >
                    <FolderPlus size={22} />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setEditingBookmark(null);
                        setShowBookmarkForm(true);
                    }}
                    style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(107, 169, 255, 0.4), rgba(107, 169, 255, 0.3))',
                        backdropFilter: 'blur(20px)',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(107, 169, 255, 0.3)',
                        border: '1px solid rgba(107, 169, 255, 0.4)'
                    }}
                    title="New Bookmark"
                >
                    <Plus size={22} />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSettings(true)}
                    style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(169, 107, 255, 0.3), rgba(169, 107, 255, 0.2))',
                        backdropFilter: 'blur(20px)',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(169, 107, 255, 0.3)',
                        border: '1px solid rgba(169, 107, 255, 0.4)'
                    }}
                    title="Settings"
                >
                    <Settings size={22} />
                </motion.button>
            </div>

            {/* Modals */}
            <BookmarkPreview
                item={selectedBookmark}
                onClose={() => setSelectedBookmark(null)}
                onEdit={handleEditBookmark}
                onDelete={handleDeleteBookmark}
            />

            <AnimatePresence>
                {showBookmarkForm && (
                    <BookmarkForm
                        item={editingBookmark}
                        availableTags={allTags}
                        onSave={handleSaveBookmark}
                        onClose={() => {
                            setShowBookmarkForm(false);
                            setEditingBookmark(null);
                        }}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showFolderForm && (
                    <FolderForm
                        item={editingFolder}
                        folders={folders}
                        onSave={handleSaveFolder}
                        onClose={() => {
                            setShowFolderForm(false);
                            setEditingFolder(null);
                        }}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showImportExport && (
                    <ImportExportModal
                        data={data}
                        onImport={handleImport}
                        onClose={() => setShowImportExport(false)}
                    />
                )}
            </AnimatePresence>

            <SettingsPanel
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                theme={theme}
                isDark={isDark}
                fontColor={fontColor}
                bgImage={bgImage}
                onThemeChange={setTheme}
                onModeChange={setIsDark}
                onFontColorChange={setFontColor}
                onBgImageChange={setBgImage}
            />
        </div>
    );
}

export default App;
