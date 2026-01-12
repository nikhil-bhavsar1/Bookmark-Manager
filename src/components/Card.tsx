import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Hash, Calendar } from 'lucide-react';
import { BookmarkItem } from '../utils/parser';

interface CardProps {
    item: BookmarkItem;
    onClick: () => void;
    minimal?: boolean;
}

export const Card: React.FC<CardProps> = ({ item, onClick, minimal = false }) => {
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [isLogo, setIsLogo] = useState(false);

    const date = item.addDate
        ? new Date(parseInt(item.addDate) * 1000).toLocaleDateString()
        : null;

    useEffect(() => {
        const cover = (item as any).cover;
        if (cover) {
            setImgSrc(cover);
            setIsLogo(false);
        } else if (item.url) {
            // "Fetch current website image" -> Use screenshot service
            // Using thum.io for reliable screenshots without API keys for demo
            setImgSrc(`https://image.thum.io/get/width/600/crop/800/noanimate/${item.url}`);
            setIsLogo(false);
        } else {
            setImgSrc(null);
        }
    }, [item]);

    const handleImgError = () => {
        if (!isLogo && item.url) {
            // If cover or screenshot failed, try high-res logo from Clearbit
            // This replaces the "blurred icon" from Google Favicon service
            setImgSrc(`https://logo.clearbit.com/${new URL(item.url).hostname}`);
            setIsLogo(true);
        } else {
            // If even logo fails, show placeholder
            setImgSrc(null);
        }
    };

    return (
        <motion.div
            onClick={onClick}
            className="glass rounded-xl p-4 flex flex-col gap-3 relative group overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
                scale: 1.02,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                transition: {
                    duration: 0.2,
                    delay: 0.05
                }
            }}
            transition={{ duration: 0.3 }}
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                cursor: 'pointer',
                padding: minimal ? '0' : '16px'
            }}
        >
            {!minimal && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, lineHeight: '1.4' }}>{item.title}</h3>
                    <motion.div
                        initial={{ opacity: 0.5 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ExternalLink size={16} />
                    </motion.div>
                </div>
            )}

            <div style={{
                position: 'relative',
                height: minimal ? '100%' : '120px',
                width: '100%',
                marginTop: minimal ? '0' : '8px',
                marginBottom: minimal ? '0' : '8px',
                borderRadius: minimal ? '0' : '8px',
                overflow: 'hidden',
                backgroundColor: imgSrc ? 'transparent' : 'rgba(255, 255, 255, 0.03)',
                border: (!imgSrc && !minimal) ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {imgSrc ? (
                    <motion.img
                        src={imgSrc}
                        alt={item.title}
                        onError={handleImgError}
                        style={{
                            width: isLogo ? '64px' : '100%',
                            height: isLogo ? '64px' : '100%',
                            objectFit: isLogo ? 'contain' : 'cover',
                            borderRadius: isLogo ? '8px' : '0'
                        }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    />
                ) : (
                    <div style={{ opacity: 0.1 }}>
                        <Hash size={minimal ? 64 : 32} />
                    </div>
                )}
            </div>

            {!minimal && item.description && (
                <p style={{ fontSize: '0.875rem', opacity: 0.7, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {item.description}
                </p>
            )}

            {!minimal && (
                <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '0.75rem', opacity: 0.6 }}>
                    {date && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} /> {date}
                        </span>
                    )}
                    {item.tags && item.tags.length > 0 && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Hash size={12} /> {item.tags.join(', ')}
                        </span>
                    )}
                </div>
            )}
        </motion.div>
    );
};
