import React from 'react';
import { motion } from 'framer-motion';
import { BookmarkItem } from '../utils/parser';
import { ExternalLink, Calendar, Hash } from 'lucide-react';

interface ListViewProps {
    items: BookmarkItem[];
    onCardClick: (item: BookmarkItem) => void;
}

export const ListView: React.FC<ListViewProps> = ({ items, onCardClick }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {items.map((item, index) => {
                const date = item.addDate
                    ? new Date(parseInt(item.addDate) * 1000).toLocaleDateString()
                    : null;

                return (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        whileHover={{
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            x: 4
                        }}
                        onClick={() => onCardClick(item)}
                        className="glass"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            gap: '16px'
                        }}
                    >
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            background: (item as any).cover ? `url(${(item as any).cover}) center/cover` :
                                item.url ? `url(https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(item.url)}&sz=64) center/contain no-repeat` : 'rgba(255,255,255,0.1)',
                            flexShrink: 0
                        }} />

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500 }}>{item.title}</h3>
                            <a href={item.url} target="_blank" rel="noopener noreferrer"
                                style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '2px', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                onClick={e => e.stopPropagation()}
                            >
                                {item.url}
                            </a>
                        </div>

                        {item.tags && item.tags.length > 0 && (
                            <div style={{ display: 'flex', gap: '4px', opacity: 0.6, fontSize: '0.8rem' }}>
                                <Hash size={14} />
                                <span>{item.tags.slice(0, 3).join(', ')}</span>
                            </div>
                        )}

                        {date && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.5, fontSize: '0.8rem', minWidth: '85px' }}>
                                <Calendar size={14} />
                                {date}
                            </div>
                        )}

                        <motion.div whileHover={{ scale: 1.1 }} style={{ opacity: 0.5 }}>
                            <ExternalLink size={16} />
                        </motion.div>
                    </motion.div>
                );
            })}
        </div>
    );
};
