import React from 'react';
import './TypingIndicator.css';

/**
 * TypingIndicator — three pulsing dots signalling "the other side is
 * responding". Rendered inside a chat bubble by callers. Optional inline
 * label sits before the dots ("AI is drafting your proposal ...").
 */
export default function TypingIndicator({ label }) {
  return (
    <span className="typing-ind" aria-label={label || 'typing'}>
      {label && <span className="typing-ind__label">{label}</span>}
      <span className="typing-ind__dots" aria-hidden="true">
        <span className="typing-ind__dot" />
        <span className="typing-ind__dot" />
        <span className="typing-ind__dot" />
      </span>
    </span>
  );
}
