import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, Hash, Globe, Edit2, Trash2 } from 'lucide-react';
import { BookmarkItem } from '../utils/parser';

interface BookmarkPreviewProps {
    item: BookmarkItem | null;
    onClose: () => void;
    onEdit?: (item: BookmarkItem) => void;
    onDelete?: (item: BookmarkItem) => void;
}

export const BookmarkPreview: React.FC<BookmarkPreviewProps> = ({ item, onClose, onEdit, onDelete }) => {
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    if (!item) return null;

    const date = item.addDate
        ? new Date(parseInt(item.addDate) * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : null;

    return (
        <AnimatePresence>
            {item && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
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
                        padding: '24px',
                        overflow: 'hidden'
                    }}
                >
                    {/* Flowing light orbs in background */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        overflow: 'hidden',
                        pointerEvents: 'none'
                    }}>
                        <motion.div
                            animate={{
                                x: ['-20%', '120%'],
                                y: ['-20%', '120%'],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: 'linear'
                            }}
                            style={{
                                position: 'absolute',
                                width: '600px',
                                height: '600px',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(107, 169, 255, 0.3) 0%, transparent 70%)',
                                filter: 'blur(60px)',
                                top: '10%',
                                left: '10%'
                            }}
                        />
                        <motion.div
                            animate={{
                                x: ['120%', '-20%'],
                                y: ['120%', '-20%'],
                            }}
                            transition={{
                                duration: 25,
                                repeat: Infinity,
                                ease: 'linear'
                            }}
                            style={{
                                position: 'absolute',
                                width: '500px',
                                height: '500px',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(255, 107, 237, 0.25) 0%, transparent 70%)',
                                filter: 'blur(60px)',
                                bottom: '10%',
                                right: '10%'
                            }}
                        />
                        <motion.div
                            animate={{
                                x: ['-20%', '120%'],
                                y: ['120%', '-20%'],
                            }}
                            transition={{
                                duration: 30,
                                repeat: Infinity,
                                ease: 'linear'
                            }}
                            style={{
                                position: 'absolute',
                                width: '450px',
                                height: '450px',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(169, 255, 107, 0.2) 0%, transparent 70%)',
                                filter: 'blur(60px)',
                                top: '50%',
                                left: '50%'
                            }}
                        />
                    </div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '700px',
                            maxHeight: '85vh',
                            overflow: 'hidden',
                            borderRadius: '32px',
                            padding: '3px',
                            background: 'linear-gradient(135deg, rgba(255, 107, 237, 0.4), rgba(107, 169, 255, 0.4), rgba(255, 169, 107, 0.4), rgba(169, 255, 107, 0.4))',
                            backgroundSize: '400% 400%',
                            animation: 'gradientFlow 8s ease infinite',
                            boxShadow: '0 0 60px rgba(107, 169, 255, 0.3), 0 0 100px rgba(255, 107, 237, 0.2)'
                        }}
                    >
                        {/* Liquid glass inner container */}
                        <div
                            style={{
                                borderRadius: '30px',
                                padding: '40px',
                                height: '100%',
                                overflowY: 'auto',
                                background: 'rgba(15, 15, 25, 0.85)',
                                backdropFilter: 'blur(40px) saturate(180%)',
                                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                position: 'relative',
                                boxShadow: 'inset 0 0 60px rgba(107, 169, 255, 0.1)'
                            }}
                        >
                            {/* Action buttons */}
                            <div style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                display: 'flex',
                                gap: '8px',
                                zIndex: 10
                            }}>
                                {onEdit && (
                                    <motion.button
                                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(107, 169, 255, 0.3)' }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => onEdit(item)}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            border: '1px solid rgba(107, 169, 255, 0.3)',
                                            backgroundColor: 'rgba(107, 169, 255, 0.15)',
                                            color: 'white',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Edit2 size={18} />
                                    </motion.button>
                                )}
                                {onDelete && (
                                    <motion.button
                                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 107, 107, 0.3)' }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            if (window.confirm(`Delete "${item.title}"?`)) {
                                                onDelete(item);
                                                onClose();
                                            }
                                        }}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            border: '1px solid rgba(255, 107, 107, 0.3)',
                                            backgroundColor: 'rgba(255, 107, 107, 0.15)',
                                            color: 'white',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Trash2 size={18} />
                                    </motion.button>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onClose}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        color: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <X size={20} />
                                </motion.button>
                            </div>

                            {/* Cover Image with liquid glass overlay */}
                            {(item as any).cover && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    style={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '320px',
                                        borderRadius: '20px',
                                        marginBottom: '32px',
                                        overflow: 'hidden',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                    }}
                                >
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        backgroundImage: `url(${(item as any).cover})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }} />
                                    {/* Glass overlay */}
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background: 'linear-gradient(180deg, transparent 0%, rgba(15, 15, 25, 0.7) 100%)',
                                        backdropFilter: 'blur(2px)'
                                    }} />
                                </motion.div>
                            )}

                            {/* Title */}
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                style={{
                                    margin: '0 0 20px 0',
                                    fontSize: '2.2rem',
                                    fontWeight: 700,
                                    lineHeight: '1.2',
                                    paddingRight: '140px',
                                    background: 'linear-gradient(135deg, #fff 0%, rgba(107, 169, 255, 1) 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}
                            >
                                {item.title}
                            </motion.h2>

                            {/* URL */}
                            {item.url && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        marginBottom: '28px',
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        backgroundColor: 'rgba(107, 169, 255, 0.1)',
                                        border: '1px solid rgba(107, 169, 255, 0.2)'
                                    }}
                                >
                                    <Globe size={18} style={{ opacity: 0.7, flexShrink: 0 }} />
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            color: 'rgba(107, 169, 255, 1)',
                                            textDecoration: 'none',
                                            wordBreak: 'break-all',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        {item.url}
                                    </a>
                                </motion.div>
                            )}

                            {/* Description */}
                            {item.description && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                    style={{
                                        fontSize: '1.15rem',
                                        lineHeight: '1.8',
                                        opacity: 0.9,
                                        marginBottom: '32px',
                                        color: 'rgba(255, 255, 255, 0.85)'
                                    }}
                                >
                                    {item.description}
                                </motion.p>
                            )}

                            {/* Metadata */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                style={{
                                    display: 'flex',
                                    gap: '20px',
                                    flexWrap: 'wrap',
                                    marginTop: '32px',
                                    paddingTop: '28px',
                                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                {date && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 14px',
                                        borderRadius: '8px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                    }}>
                                        <Calendar size={16} style={{ opacity: 0.7 }} />
                                        <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{date}</span>
                                    </div>
                                )}
                                {item.tags && item.tags.length > 0 && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 14px',
                                        borderRadius: '8px',
                                        backgroundColor: 'rgba(169, 255, 107, 0.1)',
                                        border: '1px solid rgba(169, 255, 107, 0.2)'
                                    }}>
                                        <Hash size={16} style={{ opacity: 0.7 }} />
                                        <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{item.tags.join(', ')}</span>
                                    </div>
                                )}
                            </motion.div>

                            {/* Action Button */}
                            <motion.a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                                whileHover={{
                                    scale: 1.03,
                                    boxShadow: '0 0 30px rgba(107, 169, 255, 0.4)'
                                }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    marginTop: '28px',
                                    padding: '14px 28px',
                                    borderRadius: '14px',
                                    background: 'linear-gradient(135deg, rgba(107, 169, 255, 0.3), rgba(107, 169, 255, 0.2))',
                                    border: '1px solid rgba(107, 169, 255, 0.4)',
                                    color: 'white',
                                    textDecoration: 'none',
                                    fontSize: '1.05rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 20px rgba(107, 169, 255, 0.2)'
                                }}
                            >
                                <ExternalLink size={20} />
                                Open Bookmark
                            </motion.a>
                        </div>
                    </motion.div>

                    {/* Add keyframe animation for gradient flow */}
                    <style>{`
                        @keyframes gradientFlow {
                            0% { background-position: 0% 50%; }
                            25% { background-position: 100% 50%; }
                            50% { background-position: 100% 100%; }
                            75% { background-position: 0% 100%; }
                            100% { background-position: 0% 50%; }
                        }
                    `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
