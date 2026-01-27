// AnimatedBackground.jsx - Subtle floating shapes animation for hubs
// A fun, gentle background that doesn't distract from content

import { useEffect, useState, useMemo } from 'react';

// Shape types with their SVG paths and colors
const SHAPES = [
  { type: 'circle', color: '#FFE4E1' },      // Soft pink
  { type: 'circle', color: '#E8F5E9' },      // Soft green
  { type: 'circle', color: '#FFF8E1' },      // Soft yellow
  { type: 'circle', color: '#E3F2FD' },      // Soft blue
  { type: 'circle', color: '#F3E5F5' },      // Soft purple
  { type: 'star', color: '#FFF8E1' },        // Yellow star
  { type: 'star', color: '#FFE4E1' },        // Pink star
  { type: 'heart', color: '#FFE4E1' },       // Pink heart
  { type: 'triangle', color: '#E8F5E9' },    // Green triangle
  { type: 'square', color: '#E3F2FD' },      // Blue square
];

// Generate random shapes on mount
const generateShapes = (count = 15) => {
  return Array.from({ length: count }, (_, i) => {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return {
      id: i,
      ...shape,
      size: 10 + Math.random() * 25, // 10-35px
      left: Math.random() * 100,      // 0-100%
      top: Math.random() * 100,       // 0-100%
      duration: 15 + Math.random() * 20, // 15-35s animation
      delay: Math.random() * -20,     // Stagger start times
      drift: 20 + Math.random() * 40, // How far they drift
      rotate: Math.random() * 360,    // Initial rotation
      rotateAmount: 180 + Math.random() * 180, // How much to rotate
    };
  });
};

// SVG shapes
const ShapeSVG = ({ type, color, size }) => {
  const style = { width: size, height: size };
  
  switch (type) {
    case 'star':
      return (
        <svg viewBox="0 0 24 24" style={style} fill={color}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    case 'heart':
      return (
        <svg viewBox="0 0 24 24" style={style} fill={color}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );
    case 'triangle':
      return (
        <svg viewBox="0 0 24 24" style={style} fill={color}>
          <path d="M12 4L2 20h20L12 4z" />
        </svg>
      );
    case 'square':
      return (
        <svg viewBox="0 0 24 24" style={style} fill={color}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      );
    case 'circle':
    default:
      return (
        <svg viewBox="0 0 24 24" style={style} fill={color}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
};

// Individual floating shape
const FloatingShape = ({ shape }) => {
  return (
    <div
      className="absolute pointer-events-none opacity-40"
      style={{
        left: `${shape.left}%`,
        top: `${shape.top}%`,
        transform: `rotate(${shape.rotate}deg)`,
        animation: `float-${shape.id % 3} ${shape.duration}s ease-in-out infinite`,
        animationDelay: `${shape.delay}s`,
      }}
    >
      <ShapeSVG type={shape.type} color={shape.color} size={shape.size} />
    </div>
  );
};

// Main animated background component
const AnimatedBackground = ({ intensity = 'normal' }) => {
  // Determine shape count based on intensity
  const shapeCount = useMemo(() => {
    switch (intensity) {
      case 'light': return 8;
      case 'heavy': return 25;
      default: return 15;
    }
  }, [intensity]);

  // Generate shapes only once on mount
  const shapes = useMemo(() => generateShapes(shapeCount), [shapeCount]);

  return (
    <>
      {/* CSS Keyframes */}
      <style>{`
        @keyframes float-0 {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) translateX(10px) rotate(45deg);
          }
          50% {
            transform: translateY(-10px) translateX(-15px) rotate(90deg);
          }
          75% {
            transform: translateY(-30px) translateX(5px) rotate(135deg);
          }
        }
        
        @keyframes float-1 {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-25px) translateX(-20px) rotate(60deg);
          }
          66% {
            transform: translateY(-15px) translateX(15px) rotate(120deg);
          }
        }
        
        @keyframes float-2 {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          20% {
            transform: translateY(-15px) translateX(20px) rotate(36deg);
          }
          40% {
            transform: translateY(-30px) translateX(-10px) rotate(72deg);
          }
          60% {
            transform: translateY(-20px) translateX(15px) rotate(108deg);
          }
          80% {
            transform: translateY(-10px) translateX(-5px) rotate(144deg);
          }
        }
      `}</style>

      {/* Background container */}
      <div 
        className="fixed inset-0 overflow-hidden pointer-events-none z-0"
        aria-hidden="true"
      >
        {shapes.map(shape => (
          <FloatingShape key={shape.id} shape={shape} />
        ))}
      </div>
    </>
  );
};

export default AnimatedBackground;
