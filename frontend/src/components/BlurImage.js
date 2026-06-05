import React, { useState } from 'react';
import './BlurImage.css';

/**
 * Drop-in <img/> replacement that fades from a blurred placeholder to the
 * final image once it decodes. Use anywhere a card-style screenshot or
 * thumbnail loads from the network.
 *
 *   <BlurImage src={...} alt="..." className="..." />
 *
 * Falls back to a plain <img/> if `src` is missing or already cached
 * (the onLoad fires immediately and the transition is invisible).
 */
function BlurImage({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  loading = 'lazy',
  decoding = 'async',
  ...rest
}) {
  const [loaded, setLoaded] = useState(false);

  if (!src) {
    return <div className={`blur-img blur-img--empty ${className}`} aria-hidden="true" />;
  }

  return (
    <div className={`blur-img ${loaded ? 'is-loaded' : ''} ${className}`}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        onLoad={() => setLoaded(true)}
        className={`blur-img__img ${imgClassName}`}
        {...rest}
      />
    </div>
  );
}

export default BlurImage;
