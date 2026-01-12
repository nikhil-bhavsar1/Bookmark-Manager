import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { BookmarkItem } from '../utils/parser';

interface BookmarkFormProps {
    item?: BookmarkItem | null;
    onSave: (bookmark: Partial<BookmarkItem>) => void;
    onClose: () => void;
    availableTags?: string[];
}

export const BookmarkForm: React.FC<BookmarkFormProps> = ({ item, onSave, onClose, availableTags = [] }) => {
    const [title, setTitle] = useState(item?.title || '');
    const [url, setUrl] = useState(item?.url || '');
    const [description, setDescription] = useState(item?.description || '');
    const [tags, setTags] = useState(item?.tags?.join(', ') || '');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...item,
            title,
            url,
            description,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            type: 'bookmark'
        });
        onClose();
    };

    const handleTagSelect = (tag: string) => {
        const parts = tags.split(',').map(t => t.trim());
        if (parts.length > 0 && !tags.trim().endsWith(',')) {
            parts.pop(); // Remove the partial tag being typed if not empty and not ending with comma
        }
        parts.push(tag);
        setTags(parts.join(', ') + ', ');
    };

    const currentTagInput = tags.split(',').pop()?.trim().toLowerCase() || '';
    const suggestions = currentTagInput
        ? availableTags
            .filter(t => t.toLowerCase().includes(currentTagInput) && !tags.toLowerCase().includes(t.toLowerCase()))
            .slice(0, 8)
        : [];

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
                    maxWidth: '600px',
                    borderRadius: '24px',
                    padding: '3px',
                    background: 'linear-gradient(135deg, rgba(107, 169, 255, 0.4), rgba(169, 255, 107, 0.4))',
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
                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
                            {item ? 'Edit Bookmark' : 'Add Bookmark'}
                        </h2>
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
                                Title *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="Bookmark title"
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
                                URL *
                            </label>
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                                placeholder="https://example.com"
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
                                Note (Description)
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add a note or description..."
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: 'white',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', opacity: 0.8 }}>
                                Tags (comma separated)
                            </label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                placeholder="tag1, tag2, tag3"
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
                            {showSuggestions && suggestions.length > 0 && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    background: '#1a1a2e',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    marginTop: '4px',
                                    zIndex: 10,
                                    maxHeight: '150px',
                                    overflowY: 'auto',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                                }}>
                                    {suggestions.map(tag => (
                                        <div
                                            key={tag}
                                            onClick={() => handleTagSelect(tag)}
                                            style={{
                                                padding: '8px 12px',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                color: 'rgba(255,255,255,0.8)'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            {tag}
                                        </div>
                                    ))}
                                </div>
                            )}
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
                                    background: 'linear-gradient(135deg, rgba(107, 169, 255, 0.3), rgba(107, 169, 255, 0.2))',
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
                                {item ? 'Update' : 'Create'}
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
