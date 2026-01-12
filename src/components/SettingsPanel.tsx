import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Moon, Palette, Upload, Image, Trash2 } from 'lucide-react';
import { useRef } from 'react';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    theme: string;
    isDark: boolean;
    fontColor: string;
    bgImage: string;
    onThemeChange: (theme: string) => void;
    onModeChange: (isDark: boolean) => void;
    onFontColorChange: (color: string) => void;
    onBgImageChange: (image: string) => void;
}

export const SettingsPanel = ({
    isOpen,
    onClose,
    theme,
    isDark,
    fontColor,
    bgImage,
    onThemeChange,
    onModeChange,
    onFontColorChange,
    onBgImageChange
}: SettingsPanelProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const themes = [
        { id: 'static', name: 'Static', desc: 'Solid gradient background', gradient: 'linear-gradient(135deg, #1a1a2e, #16213e)' },
        { id: 'plasma', name: 'Plasma', desc: 'Vivid blue-magenta flow', gradient: 'linear-gradient(135deg, #4a69bd, #eb2f96)' },
        { id: 'electric-blue', name: 'Electric Blue', desc: 'Neon cyan to deep blue', gradient: 'linear-gradient(135deg, #00d4ff, #0066ff)' },
        { id: 'ocean', name: 'Ocean', desc: 'Deep azure to emerald', gradient: 'linear-gradient(135deg, #1e3a8a, #10b981)' },
        { id: 'aurora', name: 'Aurora', desc: 'Aqua to violet glow', gradient: 'linear-gradient(135deg, #06b6d4, #a855f7)' },
        { id: 'forest', name: 'Forest', desc: 'Rich emerald greens', gradient: 'linear-gradient(135deg, #059669, #84cc16)' },
        { id: 'monochrome', name: 'Monochrome', desc: 'Sleek dark grays', gradient: 'linear-gradient(135deg, #374151, #9ca3af)' },
        { id: 'neon-pink', name: 'Neon Pink', desc: 'Cyberpunk magenta vibes', gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)' },
        { id: 'sunset-fire', name: 'Sunset Fire', desc: 'Vibrant pink, red & gold', gradient: 'linear-gradient(135deg, #f43f5e, #dc2626, #fbbf24)' }
    ];

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                onBgImageChange(result);
                onThemeChange('custom');
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 999
                        }}
                    />

                    {/* Settings Panel */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0.5 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
                        className="glass"
                        style={{
                            position: 'fixed',
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: '400px',
                            maxWidth: '90vw',
                            padding: '32px',
                            zIndex: 1000,
                            overflowY: 'auto',
                            borderRadius: '24px 0 0 24px',
                            backgroundColor: isDark ? 'rgba(20, 20, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'none'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '32px'
                        }}>
                            <h2 style={{
                                fontSize: '1.75rem',
                                fontWeight: '600',
                                margin: 0
                            }}>
                                Settings
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
                                    color: 'inherit'
                                }}
                            >
                                <X size={20} />
                            </motion.button>
                        </div>

                        {/* Appearance Mode */}
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                marginBottom: '16px',
                                opacity: 0.7
                            }}>
                                Appearance
                            </h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '12px'
                            }}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => onModeChange(false)}
                                    style={{
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: `2px solid ${!isDark ? 'rgba(107, 169, 255, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                                        background: !isDark ? 'rgba(107, 169, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                        cursor: 'pointer',
                                        color: 'inherit',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '8px',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <Sun size={24} />
                                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Light</span>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => onModeChange(true)}
                                    style={{
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: `2px solid ${isDark ? 'rgba(107, 169, 255, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                                        background: isDark ? 'rgba(107, 169, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                        cursor: 'pointer',
                                        color: 'inherit',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '8px',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <Moon size={24} />
                                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Dark</span>
                                </motion.button>
                            </div>
                        </div>

                        {/* Font Color */}
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                marginBottom: '16px',
                                opacity: 0.7
                            }}>
                                Font Color
                            </h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '12px'
                            }}>
                                {(['auto', 'white', 'black'] as const).map(color => (
                                    <motion.button
                                        key={color}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => onFontColorChange(color)}
                                        style={{
                                            padding: '12px 8px',
                                            borderRadius: '12px',
                                            border: `2px solid ${fontColor === color ? 'rgba(107, 169, 255, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                                            background: fontColor === color ? 'rgba(107, 169, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                            cursor: 'pointer',
                                            color: 'inherit',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '6px',
                                            transition: 'all 0.3s',
                                            fontSize: '0.813rem',
                                            fontWeight: '500',
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        <div style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            background: color === 'auto'
                                                ? 'linear-gradient(135deg, #ffffff 50%, #1a1a1a 50%)'
                                                : color === 'white'
                                                    ? '#ffffff'
                                                    : '#1a1a1a',
                                            border: '2px solid rgba(128, 128, 128, 0.5)',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                                            backgroundClip: 'padding-box'
                                        }} />
                                        {color}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Theme Selection */}
                        <div>
                            <h3 style={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                marginBottom: '16px',
                                opacity: 0.7,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <Palette size={18} />
                                Background Theme
                            </h3>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}>
                                {themes.map(t => (
                                    <motion.button
                                        key={t.id}
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => onThemeChange(t.id)}
                                        style={{
                                            padding: '16px',
                                            borderRadius: '12px',
                                            border: `2px solid ${theme === t.id ? 'rgba(107, 169, 255, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                                            background: theme === t.id ? 'rgba(107, 169, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                            cursor: 'pointer',
                                            color: 'inherit',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '16px',
                                            transition: 'all 0.3s',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '8px',
                                                background: t.gradient,
                                                flexShrink: 0,
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                                {t.name}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                                                {t.desc}
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Custom Background Upload */}
                            <div style={{ marginTop: '24px' }}>
                                <h4 style={{
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    marginBottom: '12px',
                                    opacity: 0.7,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <Image size={16} />
                                    Custom Background
                                </h4>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,.gif"
                                    onChange={handleFileUpload}
                                    style={{ display: 'none' }}
                                />

                                {bgImage && theme === 'custom' ? (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px'
                                    }}>
                                        <div style={{
                                            position: 'relative',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            border: '2px solid rgba(107, 169, 255, 0.5)'
                                        }}>
                                            <img
                                                src={bgImage}
                                                alt="Custom background"
                                                style={{
                                                    width: '100%',
                                                    height: '80px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                onBgImageChange('');
                                                onThemeChange('plasma');
                                            }}
                                            style={{
                                                padding: '10px 16px',
                                                borderRadius: '8px',
                                                border: '1px solid rgba(239, 68, 68, 0.5)',
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                cursor: 'pointer',
                                                color: '#ef4444',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                fontSize: '0.875rem',
                                                fontWeight: '500'
                                            }}
                                        >
                                            <Trash2 size={16} />
                                            Remove Custom Background
                                        </motion.button>
                                    </div>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{
                                            width: '100%',
                                            padding: '16px',
                                            borderRadius: '12px',
                                            border: '2px dashed rgba(255, 255, 255, 0.2)',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            cursor: 'pointer',
                                            color: 'inherit',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '12px',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        <Upload size={20} style={{ opacity: 0.6 }} />
                                        <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                                            Upload Image or GIF
                                        </span>
                                    </motion.button>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div style={{
                            marginTop: '32px',
                            padding: '16px',
                            borderRadius: '12px',
                            background: 'rgba(107, 169, 255, 0.05)',
                            border: '1px solid rgba(107, 169, 255, 0.2)',
                            fontSize: '0.875rem',
                            opacity: 0.7,
                            lineHeight: '1.6'
                        }}>
                            💡 The flowing wave animation adapts to your chosen theme.
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
