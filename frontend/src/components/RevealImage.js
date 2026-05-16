import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './RevealImage.css';

/**
 * Image with a clip-path scroll reveal.
 * Wraps an <img> in a container that "unveils" left-to-right when scrolled into view.
 *
 * Usage:
 *   <RevealImage src="..." alt="..." direction="left" />
 *   <RevealImage direction="up">{children}</RevealImage>
 */
function RevealImage({ src, alt, direction = 'left', className = '', children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  const variants = {
    left: {
      hidden:  { clipPath: 'inset(0 100% 0 0)' },
      visible: { clipPath: 'inset(0 0 0 0)' },
    },
    right: {
      hidden:  { clipPath: 'inset(0 0 0 100%)' },
      visible: { clipPath: 'inset(0 0 0 0)' },
    },
    up: {
      hidden:  { clipPath: 'inset(100% 0 0 0)' },
      visible: { clipPath: 'inset(0 0 0 0)' },
    },
  };

  const chosen = variants[direction] || variants.left;

  return (
    <div ref={ref} className={`reveal-img ${className}`}>
      <motion.div
        className="reveal-img__inner"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={chosen}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay }}
      >
        {children || <img src={src} alt={alt} loading="lazy" />}
      </motion.div>
    </div>
  );
}

export default RevealImage;
