import React from 'react';
import { motion } from 'framer-motion';
import {
    LayoutGrid,
    List as ListIcon,
    MonitorPlay
} from 'lucide-react';

export type ViewMode = 'grid-sm' | 'grid-md' | 'grid-lg' | 'list' | 'carousel';
export type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc';

interface ViewControlsProps {
    viewMode: ViewMode;
    onViewChange: (mode: ViewMode) => void;
    sortOption: SortOption;
    onSortChange: (sort: SortOption) => void;
}

export const ViewControls: React.FC<ViewControlsProps> = ({
    viewMode,
    onViewChange,
    sortOption,
    onSortChange
}) => {
    return (
        <div className="glass" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '8px 16px',
            borderRadius: '12px',
            marginBottom: '24px',
            overflow: 'visible',
            position: 'relative',
            zIndex: 50
        }}>
            <div style={{ display: 'flex', gap: '4px', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '16px' }}>
                <ControlButton
                    isActive={viewMode === 'list'}
                    onClick={() => onViewChange('list')}
                    tooltip="List View"
                >
                    <ListIcon size={18} />
                </ControlButton>
                <ControlButton
                    isActive={viewMode === 'grid-sm'}
                    onClick={() => onViewChange('grid-sm')}
                    tooltip="Small Cards"
                >
                    <LayoutGrid size={16} />
                </ControlButton>
                <ControlButton
                    isActive={viewMode === 'grid-md'}
                    onClick={() => onViewChange('grid-md')}
                    tooltip="Medium Cards"
                >
                    <LayoutGrid size={20} />
                </ControlButton>
                <ControlButton
                    isActive={viewMode === 'grid-lg'}
                    onClick={() => onViewChange('grid-lg')}
                    tooltip="Large Cards"
                >
                    <LayoutGrid size={24} />
                </ControlButton>
                <ControlButton
                    isActive={viewMode === 'carousel'}
                    onClick={() => onViewChange('carousel')}
                    tooltip="Carousel"
                >
                    <MonitorPlay size={20} />
                </ControlButton>
            </div>


            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Sort by:</span>
                <CustomDropdown
                    value={sortOption}
                    onChange={(val) => onSortChange(val as SortOption)}
                    options={[
                        { value: 'date-desc', label: 'Newest First' },
                        { value: 'date-asc', label: 'Oldest First' },
                        { value: 'name-asc', label: 'Name (A-Z)' },
                        { value: 'name-desc', label: 'Name (Z-A)' }
                    ]}
                />
            </div>
        </div >
    );
};

// ... existing ControlButton ...

import { AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const CustomDropdown: React.FC<{
    value: string;
    onChange: (val: string) => void;
    options: { value: string; label: string }[];
}> = ({ value, onChange, options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabel = options.find(o => o.value === value)?.label;

    return (
        <div style={{ position: 'relative' }} ref={containerRef}>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ backgroundColor: 'var(--glass-highlight)' }}
                whileTap={{ scale: 0.98 }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'transparent',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-color)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    outline: 'none',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    minWidth: '140px',
                    justifyContent: 'space-between'
                }}
            >
                <span>{selectedLabel}</span>
                <ChevronDown size={14} style={{ opacity: 0.7, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '8px',
                            background: 'var(--glass-bg)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            padding: '4px',
                            zIndex: 9999,
                            minWidth: '100%',
                            boxShadow: '0 10px 40px var(--glass-shadow, rgba(0,0,0,0.1))',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {options.map((option) => (
                                <motion.button
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    whileHover={{ backgroundColor: 'var(--glass-highlight)' }}
                                    style={{
                                        background: option.value === value ? 'rgba(107, 169, 255, 0.15)' : 'transparent',
                                        color: option.value === value ? '#6ba9ff' : 'var(--text-color)',
                                        border: 'none',
                                        padding: '8px 12px',
                                        fontSize: '0.85rem',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        borderRadius: '6px',
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: '2px'
                                    }}
                                >
                                    {option.label}
                                    {option.value === value && (
                                        <motion.div
                                            layoutId="check"
                                            style={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                backgroundColor: '#6ba9ff'
                                            }}
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ControlButton: React.FC<{
    children: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
    tooltip: string;
}> = ({ children, isActive, onClick, tooltip }) => (
    <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05, backgroundColor: 'var(--glass-highlight)' }}
        whileTap={{ scale: 0.95 }}
        title={tooltip}
        style={{
            background: isActive ? 'rgba(107, 169, 255, 0.2)' : 'transparent',
            color: isActive ? '#6ba9ff' : 'var(--text-color)',
            border: 'none',
            borderRadius: '6px',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isActive ? 1 : 0.7
        }}
    >
        {children}
    </motion.button>
);
