import React from 'react';
import './Marquee.css';

function Marquee({ text, speed = 'normal' }) {
  const content = text || 'WEB DEVELOPMENT  -  APP DEVELOPMENT  -  UI/UX DESIGN  -  PUBLISHING  -  BRANDING  -  CONSULTING';

  return (
    <div className={`marquee marquee--${speed}`}>
      <div className="marquee__container">
        <div className="marquee__track">
          <span className="marquee__text">{content}</span>
          <span className="marquee__text" aria-hidden="true">{content}</span>
          <span className="marquee__text" aria-hidden="true">{content}</span>
        </div>
      </div>
    </div>
  );
}

export default Marquee;
