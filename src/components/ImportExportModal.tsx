import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Download, FileJson, FileText, File, Table } from 'lucide-react';
import { BookmarkItem } from '../utils/parser';
import { exportBookmarks } from '../utils/exportUtils';
import { parseImportedFile } from '../utils/importParsers';

interface ImportExportModalProps {
    onClose: () => void;
    onImport: (items: BookmarkItem[]) => void;
    data: BookmarkItem[];
}

export const ImportExportModal = ({ onClose, onImport, data }: ImportExportModalProps) => {
    const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
    const [importing, setImporting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setImporting(true);
        setError(null);
        setSuccess(null);

        try {
            const content = await file.text();
            const items = parseImportedFile(content, file.name);

            if (items.length === 0) {
                setError('No bookmarks found in the file');
                return;
            }

            onImport(items);
            setSuccess(`Successfully imported ${items.length} items from ${file.name}`);

            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to import file');
        } finally {
            setImporting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleExport = (format: 'json' | 'md' | 'csv' | 'html') => {
        try {
            exportBookmarks(data, format);
            setSuccess(`Successfully exported as ${format.toUpperCase()}`);
            setTimeout(() => {
                setSuccess(null);
            }, 2000);
        } catch (err) {
            setError('Failed to export bookmarks');
        }
    };

    const exportFormats = [
        { id: 'json', label: 'JSON', icon: FileJson, desc: 'Complete data structure' },
        { id: 'md', label: 'Markdown', icon: FileText, desc: 'Readable text format' },
        { id: 'csv', label: 'CSV', icon: Table, desc: 'Spreadsheet compatible' },
        { id: 'html', label: 'HTML', icon: File, desc: 'Browser bookmarks format' }
    ] as const;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(8px)',
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
                    className="glass"
                    style={{
                        maxWidth: '600px',
                        width: '100%',
                        borderRadius: '24px',
                        padding: '32px',
                        position: 'relative'
                    }}
                >
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '24px'
                    }}>
                        <h2 style={{
                            fontSize: '1.75rem',
                            fontWeight: '600',
                            margin: 0
                        }}>
                            Import & Export
                        </h2>
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: 'none',
                                borderRadius: '12px',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'inherit',
                                transition: 'background 0.2s'
                            }}
                        >
                            <X size={20} />
                        </motion.button>
                    </div>

                    {/* Tab Selector */}
                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '32px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '4px',
                        borderRadius: '12px'
                    }}>
                        {(['import', 'export'] as const).map(tab => (
                            <motion.button
                                key={tab}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    flex: 1,
                                    padding: '12px 24px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    background: activeTab === tab
                                        ? 'rgba(107, 169, 255, 0.3)'
                                        : 'transparent',
                                    color: 'inherit',
                                    fontSize: '1rem',
                                    fontWeight: activeTab === tab ? '600' : '400',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                {tab === 'import' ? <Upload size={18} /> : <Download size={18} />}
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </motion.button>
                        ))}
                    </div>

                    {/* Messages */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                style={{
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: 'rgba(255, 100, 100, 0.1)',
                                    border: '1px solid rgba(255, 100, 100, 0.3)',
                                    marginBottom: '24px',
                                    color: '#ff6b6b'
                                }}
                            >
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                style={{
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: 'rgba(100, 255, 150, 0.1)',
                                    border: '1px solid rgba(100, 255, 150, 0.3)',
                                    marginBottom: '24px',
                                    color: '#64ff96'
                                }}
                            >
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Content */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'import' ? (
                            <motion.div
                                key="import"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p style={{
                                    marginBottom: '16px',
                                    opacity: 0.7,
                                    lineHeight: '1.6'
                                }}>
                                    Import bookmarks from JSON, Markdown, CSV, or HTML files.
                                    The importer will automatically detect headers and sections to create nested folders.
                                </p>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".json,.md,.markdown,.csv,.html,.htm"
                                    onChange={handleFileSelect}
                                    style={{ display: 'none' }}
                                />

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={importing}
                                    style={{
                                        width: '100%',
                                        padding: '48px 24px',
                                        border: '2px dashed rgba(107, 169, 255, 0.4)',
                                        borderRadius: '16px',
                                        background: 'rgba(107, 169, 255, 0.05)',
                                        color: 'inherit',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        cursor: importing ? 'wait' : 'pointer',
                                        transition: 'all 0.3s',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '12px'
                                    }}
                                >
                                    <Upload size={32} style={{ opacity: 0.7 }} />
                                    {importing ? 'Importing...' : 'Click to select file'}
                                    <span style={{ fontSize: '0.875rem', opacity: 0.6 }}>
                                        Supports: JSON, MD, CSV, HTML
                                    </span>
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="export"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p style={{
                                    marginBottom: '24px',
                                    opacity: 0.7,
                                    lineHeight: '1.6'
                                }}>
                                    Export your bookmarks in various formats. Choose the format that best suits your needs.
                                </p>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: '16px'
                                }}>
                                    {exportFormats.map(format => (
                                        <motion.button
                                            key={format.id}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleExport(format.id)}
                                            style={{
                                                padding: '24px',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '16px',
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                color: 'inherit',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                                gap: '8px',
                                                textAlign: 'left'
                                            }}
                                        >
                                            <format.icon size={32} style={{ opacity: 0.7 }} />
                                            <div>
                                                <div style={{ fontWeight: '600', fontSize: '1.125rem' }}>
                                                    {format.label}
                                                </div>
                                                <div style={{ fontSize: '0.875rem', opacity: 0.6, marginTop: '4px' }}>
                                                    {format.desc}
                                                </div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
