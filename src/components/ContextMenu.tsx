import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, FolderPlus } from 'lucide-react';

interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onRename: () => void;
    onDelete: () => void;
    onAddSubfolder?: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
    x,
    y,
    onClose,
    onRename,
    onDelete,
    onAddSubfolder
}) => {
    useEffect(() => {
        const handleClick = () => onClose();
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('click', handleClick);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            style={{
                position: 'fixed',
                left: `${x}px`,
                top: `${y}px`,
                zIndex: 1000,
                minWidth: '180px',
                borderRadius: '12px',
                padding: '6px',
                background: 'rgba(20, 20, 30, 0.95)',
                backdropFilter: 'blur(40px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
            }}
        >
            {onAddSubfolder && (
                <motion.button
                    whileHover={{ backgroundColor: 'rgba(169, 255, 107, 0.15)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddSubfolder();
                        onClose();
                    }}
                    style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: 'none',
                        background: 'transparent',
                        color: 'white',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '0.9rem',
                        transition: 'background-color 0.2s'
                    }}
                >
                    <FolderPlus size={16} style={{ color: 'rgba(169, 255, 107, 1)' }} />
                    Add Subfolder
                </motion.button>
            )}

            <motion.button
                whileHover={{ backgroundColor: 'rgba(107, 169, 255, 0.15)' }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                    e.stopPropagation();
                    onRename();
                    onClose();
                }}
                style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: 'none',
                    background: 'transparent',
                    color: 'white',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.9rem',
                    transition: 'background-color 0.2s'
                }}
            >
                <Edit2 size={16} style={{ color: 'rgba(107, 169, 255, 1)' }} />
                Rename
            </motion.button>

            <div style={{
                height: '1px',
                background: 'rgba(255, 255, 255, 0.1)',
                margin: '6px 0'
            }} />

            <motion.button
                whileHover={{ backgroundColor: 'rgba(255, 107, 107, 0.15)' }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                    onClose();
                }}
                style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: 'none',
                    background: 'transparent',
                    color: 'rgba(255, 107, 107, 1)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.9rem',
                    transition: 'background-color 0.2s'
                }}
            >
                <Trash2 size={16} />
                Delete
            </motion.button>
        </motion.div>
    );
};
