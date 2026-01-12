import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const MouseFollowLight: React.FC = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                zIndex: 1,
                overflow: 'hidden'
            }}
        >
            {/* Primary light orb that follows mouse - Enhanced */}
            <motion.div
                animate={{
                    x: mousePosition.x - 400,
                    y: mousePosition.y - 400,
                }}
                transition={{
                    type: 'spring',
                    damping: 30,
                    stiffness: 200,
                    mass: 0.5
                }}
                style={{
                    position: 'absolute',
                    width: '800px',
                    height: '800px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(107, 169, 255, 0.35) 0%, rgba(107, 169, 255, 0.18) 30%, rgba(107, 169, 255, 0.08) 50%, transparent 70%)',
                    filter: 'blur(80px)',
                    willChange: 'transform'
                }}
            />

            {/* Secondary light orb with delay for trailing effect - Enhanced */}
            <motion.div
                animate={{
                    x: mousePosition.x - 300,
                    y: mousePosition.y - 300,
                }}
                transition={{
                    type: 'spring',
                    damping: 25,
                    stiffness: 150,
                    mass: 0.8
                }}
                style={{
                    position: 'absolute',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255, 107, 237, 0.28) 0%, rgba(255, 107, 237, 0.14) 30%, rgba(255, 107, 237, 0.06) 50%, transparent 70%)',
                    filter: 'blur(70px)',
                    willChange: 'transform'
                }}
            />

            {/* Tertiary light orb with more delay - Enhanced */}
            <motion.div
                animate={{
                    x: mousePosition.x - 250,
                    y: mousePosition.y - 250,
                }}
                transition={{
                    type: 'spring',
                    damping: 20,
                    stiffness: 120,
                    mass: 1
                }}
                style={{
                    position: 'absolute',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(169, 255, 107, 0.25) 0%, rgba(169, 255, 107, 0.12) 30%, rgba(169, 255, 107, 0.05) 50%, transparent 70%)',
                    filter: 'blur(60px)',
                    willChange: 'transform'
                }}
            />

            {/* Small intense spotlight at cursor - Enhanced */}
            <motion.div
                animate={{
                    x: mousePosition.x - 100,
                    y: mousePosition.y - 100,
                }}
                transition={{
                    type: 'spring',
                    damping: 40,
                    stiffness: 300,
                    mass: 0.3
                }}
                style={{
                    position: 'absolute',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(107, 169, 255, 0.12) 25%, rgba(107, 169, 255, 0.06) 50%, transparent 70%)',
                    filter: 'blur(30px)',
                    willChange: 'transform'
                }}
            />
        </div>
    );
};
