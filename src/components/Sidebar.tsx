import React, { useState } from 'react';
import { BookmarkItem } from '../utils/parser';
import { Folder, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContextMenu } from './ContextMenu';

interface SidebarProps {
    folders: BookmarkItem[];
    selectedFolderId: string | null;
    onSelectFolder: (id: string | null) => void;
    onRenameFolder: (folder: BookmarkItem) => void;
    onDeleteFolder: (folder: BookmarkItem) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    folders,
    selectedFolderId,
    onSelectFolder,
    onRenameFolder,
    onDeleteFolder
}) => {
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; folder: BookmarkItem } | null>(null);

    // Helper to recursively count all bookmarks in a folder
    const countBookmarks = (folder: BookmarkItem): number => {
        let count = 0;
        if (folder.children) {
            folder.children.forEach(child => {
                if (child.type === 'bookmark') {
                    count++;
                } else if (child.type === 'folder') {
                    count += countBookmarks(child);
                }
            });
        }
        return count;
    };

    const handleContextMenu = (e: React.MouseEvent, folder: BookmarkItem) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            folder
        });
    };

    return (
        <div className="glass" style={{
            width: '360px',
            height: 'calc(100vh - 48px)',
            margin: '24px',
            borderRadius: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            position: 'sticky',
            top: '24px'
        }}>
            <div style={{ padding: '24px' }}>
                <h2 style={{ margin: '0 0 24px 0', fontSize: '1.25rem', fontWeight: 700 }}>Collections</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <motion.button
                        onClick={() => onSelectFolder(null)}
                        whileHover={{
                            scale: 1.02,
                            x: 4,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            boxShadow: '0 0 15px rgba(107, 169, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            transition: { type: 'spring', stiffness: 400, damping: 25 }
                        }}
                        whileTap={{ scale: 0.96 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            width: '100%',
                            padding: '12px',
                            borderRadius: '12px',
                            background: selectedFolderId === null ? 'rgba(255,255,255,0.08)' : 'transparent',
                            border: '1px solid transparent',
                            color: 'inherit',
                            cursor: 'pointer',
                            textAlign: 'left'
                        }}
                    >
                        <Inbox size={18} />
                        <span>All Bookmarks</span>
                    </motion.button>

                    {folders.map((folder, index) => (
                        <motion.button
                            key={folder.id}
                            onClick={() => onSelectFolder(folder.id)}
                            onContextMenu={(e) => handleContextMenu(e, folder)}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.02 }}
                            whileHover={{
                                scale: 1.02,
                                x: 4,
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                boxShadow: '0 0 15px rgba(107, 169, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                transition: { type: 'spring', stiffness: 400, damping: 25 }
                            }}
                            whileTap={{ scale: 0.96 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                width: '100%',
                                padding: '12px',
                                borderRadius: '12px',
                                background: selectedFolderId === folder.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                                border: '1px solid transparent',
                                color: 'inherit',
                                cursor: 'pointer',
                                textAlign: 'left'
                            }}
                        >
                            <Folder size={18} opacity={0.7} />
                            <span>{folder.title}</span>
                            <span style={{ marginLeft: 'auto', opacity: 0.4, fontSize: '0.8rem' }}>
                                {countBookmarks(folder)}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Context Menu */}
            <AnimatePresence>
                {contextMenu && (
                    <ContextMenu
                        x={contextMenu.x}
                        y={contextMenu.y}
                        onClose={() => setContextMenu(null)}
                        onRename={() => onRenameFolder(contextMenu.folder)}
                        onDelete={() => onDeleteFolder(contextMenu.folder)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
