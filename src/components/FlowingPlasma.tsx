
import { useEffect, useRef } from 'react';

interface FlowingPlasmaProps {
    theme: string;
    isDark: boolean;
    bgImage?: string;
}

export const FlowingPlasma = ({ theme, isDark, bgImage }: FlowingPlasmaProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // Skip animation for static or custom themes
        if (theme === 'static' || theme === 'custom') return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        // PERFORMANCE SETTINGS
        // Lower = Faster. 0.2 means we render at 20% resolution and scale up.
        // This makes it ~25x faster than 1.0 (full res).
        // Plasma is naturally blurry, so this actually looks BETTER (smoother gradients).
        const RENDER_SCALE = 0.2;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();

            // Set internal buffer to low resolution
            canvas.width = Math.ceil(rect.width * RENDER_SCALE);
            canvas.height = Math.ceil(rect.height * RENDER_SCALE);

            // Ensure CSS Smooth Scaling is OFF if we wanted pixel art, 
            // but here we WANT it ON for free blur.
            // (Default browser behavior is usually bilinear, which is perfect)
        };

        const resizeObserver = new ResizeObserver(() => resize());
        resizeObserver.observe(canvas);
        window.addEventListener('resize', resize);
        resize();

        // More vibrant theme colors
        const themes = {
            plasma: {
                dark: [{ r: 74, g: 105, b: 189 }, { r: 156, g: 89, b: 182 }, { r: 235, g: 47, b: 150 }],
                light: [{ r: 200, g: 220, b: 255 }, { r: 230, g: 190, b: 255 }, { r: 255, g: 180, b: 220 }]
            },
            'electric-blue': {
                dark: [{ r: 0, g: 40, b: 100 }, { r: 0, g: 150, b: 255 }, { r: 0, g: 212, b: 255 }],
                light: [{ r: 180, g: 230, b: 255 }, { r: 100, g: 200, b: 255 }, { r: 0, g: 180, b: 255 }]
            },
            ocean: {
                dark: [{ r: 30, g: 58, b: 138 }, { r: 20, g: 120, b: 140 }, { r: 16, g: 185, b: 129 }],
                light: [{ r: 150, g: 200, b: 255 }, { r: 120, g: 220, b: 220 }, { r: 150, g: 240, b: 200 }]
            },

            aurora: {
                dark: [{ r: 6, g: 182, b: 212 }, { r: 99, g: 102, b: 241 }, { r: 168, g: 85, b: 247 }],
                light: [{ r: 180, g: 240, b: 250 }, { r: 200, g: 200, b: 255 }, { r: 230, g: 200, b: 255 }]
            },
            forest: {
                dark: [{ r: 5, g: 150, b: 105 }, { r: 34, g: 197, b: 94 }, { r: 132, g: 204, b: 22 }],
                light: [{ r: 180, g: 230, b: 200 }, { r: 180, g: 240, b: 180 }, { r: 220, g: 255, b: 180 }]
            },
            monochrome: {
                dark: [{ r: 55, g: 65, b: 81 }, { r: 107, g: 114, b: 128 }, { r: 156, g: 163, b: 175 }],
                light: [{ r: 200, g: 200, b: 210 }, { r: 220, g: 220, b: 230 }, { r: 240, g: 240, b: 250 }]
            },
            'neon-pink': {
                dark: [{ r: 236, g: 72, b: 153 }, { r: 192, g: 38, b: 211 }, { r: 139, g: 92, b: 246 }],
                light: [{ r: 255, g: 200, b: 230 }, { r: 245, g: 180, b: 255 }, { r: 220, g: 180, b: 255 }]
            },

            sepia: {
                dark: [{ r: 100, g: 80, b: 60 }, { r: 140, g: 110, b: 80 }, { r: 180, g: 140, b: 100 }],
                light: [{ r: 240, g: 220, b: 200 }, { r: 255, g: 240, b: 210 }, { r: 255, g: 250, b: 230 }]
            },
            'sunset-fire': {
                dark: [{ r: 180, g: 20, b: 50 }, { r: 255, g: 60, b: 50 }, { r: 255, g: 160, b: 50 }],
                light: [{ r: 255, g: 150, b: 150 }, { r: 255, g: 180, b: 140 }, { r: 255, g: 220, b: 180 }]
            }
        };

        const currentPalette = themes[theme as keyof typeof themes]?.[isDark ? 'dark' : 'light'] || themes.plasma.dark;

        const render = () => {
            if (!canvas.isConnected) return;

            const width = canvas.width;
            const height = canvas.height;
            const imgData = ctx.createImageData(width, height);
            const data = imgData.data;

            time += 0.01;

            // Pre-calculate palette colors for faster lookup if possible, 
            // but straightforward interpolation is fast enough at low res.

            for (let y = 0; y < height; y++) {
                const ny = y / height;
                // Pre-calc Y components of waves
                // const y1 = Math.sin(y * 0.05 - time * 0.7); // Scaled for low-res coords (approx equivalent to original)
                // const y2 = Math.sin(y * 0.02 + time * 0.5);

                for (let x = 0; x < width; x++) {
                    const nx = x / width;

                    // Pattern Logic
                    const v = (
                        Math.sin(nx * 4 - time * 0.8 + ny * 2) +
                        Math.sin(nx * 3 + time * 0.6 - ny) +
                        Math.sin((nx + ny) * 3 - time * 0.9)
                    ) / 3;

                    // Mouse interaction removed

                    const value = v;
                    const normalized = (value + 1.5) / 3; // Normalize to roughly 0-1

                    // Color mapping
                    const idx = Math.max(0, Math.min(1, dot(normalized))) * (currentPalette.length - 1);
                    const i = Math.floor(idx);
                    const f = idx - i;

                    const c1 = currentPalette[i] || currentPalette[0] || { r: 0, g: 0, b: 0 };
                    const c2 = currentPalette[i + 1] || currentPalette[i] || currentPalette[0] || { r: 0, g: 0, b: 0 };

                    const offset = (y * width + x) * 4;
                    data[offset] = c1.r + (c2.r - c1.r) * f;
                    data[offset + 1] = c1.g + (c2.g - c1.g) * f;
                    data[offset + 2] = c1.b + (c2.b - c1.b) * f;
                    data[offset + 3] = isDark ? 180 : 200;
                }
            }

            ctx.putImageData(imgData, 0, 0);
            animationFrameId = requestAnimationFrame(render);
        };

        // Helper helper
        const dot = (val: number) => val < 0 ? 0 : (val > 1 ? 1 : val);

        render();

        return () => {
            window.removeEventListener('resize', resize);
            resizeObserver.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme, isDark]);

    // Handle static or custom themes - render without animation
    if (theme === 'static') {
        return (
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: -1,
                    background: isDark
                        ? 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)'
                        : 'linear-gradient(135deg, #e8eef5 0%, #dde5f0 50%, #c8d4e8 100%)'
                }}
            />
        );
    }

    if (theme === 'custom' && bgImage) {
        return (
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: -1,
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: isDark
                            ? 'rgba(0, 0, 0, 0.4)'
                            : 'rgba(255, 255, 255, 0.3)',
                        backdropFilter: 'blur(2px)'
                    }}
                />
            </div>
        );
    }

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none',
                opacity: isDark ? 0.5 : 0.4,
                mixBlendMode: isDark ? 'screen' : 'multiply',
                // This ensures the low-res buffer is scaled up smoothly by the GPU
                imageRendering: 'auto'
            }}
        />
    );
};
