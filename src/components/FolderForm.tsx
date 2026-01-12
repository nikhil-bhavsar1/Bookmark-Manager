import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Folder } from 'lucide-react';
import { BookmarkItem } from '../utils/parser';

interface FolderFormProps {
    item?: BookmarkItem | null;
    folders: BookmarkItem[];
    onSave: (folder: Partial<BookmarkItem>) => void;
    onClose: () => void;
}

export const FolderForm: React.FC<FolderFormProps> = ({ item, folders, onSave, onClose }) => {
    const [title, setTitle] = useState(item?.title || '');
    const [parentId, setParentId] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...item,
            title,
            type: 'folder',
            children: item?.children || []
        });
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '24px'
            }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '500px',
                    borderRadius: '24px',
                    padding: '3px',
                    background: 'linear-gradient(135deg, rgba(169, 255, 107, 0.4), rgba(107, 169, 255, 0.4))',
                    backgroundSize: '200% 200%',
                    animation: 'gradientFlow 6s ease infinite'
                }}
            >
                <div
                    className="glass"
                    style={{
                        borderRadius: '22px',
                        padding: '32px',
                        background: 'rgba(15, 15, 25, 0.95)',
                        backdropFilter: 'blur(40px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Folder size={24} style={{ color: 'rgba(169, 255, 107, 1)' }} />
                            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
                                {item ? 'Edit Folder' : 'New Folder'}
                            </h2>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                border: 'none',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <X size={18} />
                        </motion.button>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', opacity: 0.8 }}>
                                Folder Name *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="My Collection"
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: 'white',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', opacity: 0.8 }}>
                                Parent Folder (Optional)
                            </label>
                            <select
                                value={parentId}
                                onChange={(e) => setParentId(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: 'white',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="" style={{ background: '#1a1a2e' }}>Top Level</option>
                                {folders.map(folder => (
                                    <option key={folder.id} value={folder.id} style={{ background: '#1a1a2e' }}>
                                        {folder.title}
                                    </option>
                                ))}
                            </select>
                            <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: '8px 0 0 0' }}>
                                Create nested collections by selecting a parent folder
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, rgba(169, 255, 107, 0.3), rgba(169, 255, 107, 0.2))',
                                    color: 'white',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                <Save size={18} />
                                {item ? 'Update' : 'Create Folder'}
                            </motion.button>
                            <motion.button
                                type="button"
                                onClick={onClose}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    padding: '14px 24px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: 'white',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </motion.button>
                        </div>
                    </form>
                </div>
            </motion.div>

            <style>{`
                @keyframes gradientFlow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </motion.div>
    );
};
