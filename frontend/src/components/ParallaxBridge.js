import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import './ParallaxBridge.css';

/**
 * ParallaxBridge — full-width scroll-linked typography band that lives
 * between major sections. Two monospace lines drift in opposite
 * directions as the visitor scrolls past the block, giving the page an
 * atmospheric "chapter break" without adding meaningful vertical bulk.
 *
 * Uses framer-motion's useScroll (bound to the section itself so motion
 * only progresses while the block is on screen) and useTransform to map
 * scroll progress → translateX. Reduced motion falls back to static
 * centered text.
 *
 * Copy comes from t.parallaxBridge; both lines and reverse behavior
 * kept in i18n so ko/en can differ if needed.
 */
function ParallaxBridge({
  topText,
  bottomText,
  ariaLabel = 'brand bridge',
}) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Top line: pans left as you scroll down (-40% → 0)
  // Bottom line: pans right (0 → -40%) — creates a crossing feel
  const topX = useTransform(scrollYProgress, [0, 1], ['-30%', '10%']);
  const bottomX = useTransform(scrollYProgress, [0, 1], ['10%', '-30%']);

  return (
    <section
      ref={ref}
      className="pxbridge"
      aria-label={ariaLabel}
      aria-hidden={!topText && !bottomText ? 'true' : undefined}
    >
      {topText && (
        <motion.div
          className="pxbridge__line pxbridge__line--top"
          style={prefersReducedMotion ? undefined : { x: topX }}
        >
          <span>{topText}</span>
        </motion.div>
      )}
      {bottomText && (
        <motion.div
          className="pxbridge__line pxbridge__line--bottom"
          style={prefersReducedMotion ? undefined : { x: bottomX }}
        >
          <span>{bottomText}</span>
        </motion.div>
      )}
    </section>
  );
}

export default ParallaxBridge;
