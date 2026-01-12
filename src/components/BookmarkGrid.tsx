import React from 'react';
import { BookmarkItem } from '../utils/parser';
import { Card } from './Card';

interface BookmarkGridProps {
    items: BookmarkItem[];
    onCardClick: (item: BookmarkItem) => void;
    size?: 'sm' | 'md' | 'lg';
}

export const BookmarkGrid: React.FC<BookmarkGridProps> = ({ items, onCardClick, size = 'md' }) => {
    const getMinColumnWidth = () => {
        switch (size) {
            case 'sm': return '200px';
            case 'lg': return '360px';
            case 'md':
            default: return '280px';
        }
    };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(${getMinColumnWidth()}, 1fr))`,
            gap: '32px',
            padding: '24px'
        }}>
            {items.map(item => (
                <Card key={item.id} item={item} onClick={() => onCardClick(item)} />
            ))}
        </div>
    );
};
