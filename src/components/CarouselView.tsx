import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookmarkItem } from '../utils/parser';
import { Card } from './Card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselViewProps {
    items: BookmarkItem[];
    onCardClick: (item: BookmarkItem) => void;
}

export const CarouselView: React.FC<CarouselViewProps> = ({ items, onCardClick }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleNext = useCallback(() => {
        setActiveIndex((prev) => (prev + 1 < items.length ? prev + 1 : prev));
    }, [items.length]);

    const handlePrev = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev]);

    // Mouse wheel navigation
    const handleWheel = (e: React.WheelEvent) => {
        if (Math.abs(e.deltaX) > 20 || Math.abs(e.deltaY) > 20) {
            if (e.deltaX > 0 || e.deltaY > 0) {
                handleNext();
            } else {
                handlePrev();
            }
        }
    };

    // Calculate layout for visible items
    // We render a window of items around the active index
    const renderItems = () => {
        const visibleRange = 2; // How many neighbors to show
        const rendered = [];

        for (let i = -visibleRange; i <= visibleRange; i++) {
            const index = activeIndex + i;
            if (index < 0 || index >= items.length) continue;

            const item = items[index];
            if (!item) continue;

            const isActive = i === 0;
            const offset = i; // -2, -1, 0, 1, 2

            rendered.push(
                <motion.div
                    key={item.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0, x: 100 * offset }}
                    animate={{
                        scale: isActive ? 1.1 : 0.85,
                        opacity: isActive ? 1 : 0.4,
                        x: offset * 320, // Spacing
                        zIndex: isActive ? 10 : 5 - Math.abs(offset),
                        rotateY: offset * 15,
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30
                    }}
                    style={{
                        position: 'absolute',
                        width: '400px',
                        height: '500px',
                        left: '50%',
                        marginLeft: '-200px', // Center the card
                        perspective: '1000px',
                        cursor: isActive ? 'default' : 'pointer'
                    }}
                    onClick={() => {
                        if (isActive) return;
                        setActiveIndex(index);
                    }}
                >
                    <div style={{
                        height: '100%',
                        borderRadius: '32px', // Rounder edges request
                        overflow: 'hidden',
                        boxShadow: isActive ? '0 20px 50px rgba(0,0,0,0.5)' : 'none'
                    }}>
                        <Card item={item} onClick={() => onCardClick(item)} minimal={true} />
                    </div>
                </motion.div>
            );
        }
        return rendered;
    };

    if (items.length === 0) return null;

    const activeItem = items[activeIndex];
    if (!activeItem) return null;

    return (
        <div
            ref={containerRef}
            onWheel={handleWheel}
            style={{
                position: 'relative',
                width: '100%',
                height: '700px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                perspective: '1000px'
            }}
        >
            {/* Title Layer */}
            <motion.div
                key={`title-${activeItem.id}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                    position: 'absolute',
                    top: '10px', // Moved higher to 10px
                    textAlign: 'center',
                    zIndex: 20,
                    width: '100%',
                    pointerEvents: 'none'
                }}
            >
                <h2 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    margin: 0,
                    color: 'white',
                    textShadow: '0 4px 12px rgba(0,0,0,0.5)'
                }}>
                    {activeItem.title}
                </h2>
                <div style={{ opacity: 0.6, fontSize: '1rem', marginTop: '8px' }}>
                    {activeItem.url ? new URL(activeItem.url).hostname : ''}
                </div>
            </motion.div>

            {/* Carousel Track */}
            <div style={{
                position: 'relative',
                width: '100%',
                height: '500px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <AnimatePresence initial={false}>
                    {renderItems()}
                </AnimatePresence>
            </div>

            {/* Navigation Controls at Bottom */}
            <div style={{
                position: 'absolute',
                bottom: '40px',
                display: 'flex',
                gap: '24px',
                zIndex: 20
            }}>
                <motion.button
                    className="glass"
                    onClick={handlePrev}
                    disabled={activeIndex === 0}
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                        padding: '16px',
                        borderRadius: '50%',
                        border: '1px solid rgba(255,255,255,0.1)',
                        cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                        opacity: activeIndex === 0 ? 0.3 : 1
                    }}
                >
                    <ChevronLeft size={32} />
                </motion.button>
                <motion.button
                    className="glass"
                    onClick={handleNext}
                    disabled={activeIndex === items.length - 1}
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                        padding: '16px',
                        borderRadius: '50%',
                        border: '1px solid rgba(255,255,255,0.1)',
                        cursor: activeIndex === items.length - 1 ? 'not-allowed' : 'pointer',
                        opacity: activeIndex === items.length - 1 ? 0.3 : 1
                    }}
                >
                    <ChevronRight size={32} />
                </motion.button>
            </div>
        </div>
    );
};
