import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCollection } from '../hooks/useCollection';
import SavedSheet from './SavedSheet';
import './CollectionButton.css';

function CollectionButton() {
  const { t } = useLanguage();
  const { count } = useCollection();
  const [open, setOpen] = useState(false);

  if (count <= 0 && !open) return null;

  const label = (t.collection && t.collection.trigger) || '> saved';

  return (
    <>
      <button
        type="button"
        className="collection-btn"
        onClick={() => setOpen(true)}
        aria-label={`${label} (${count})`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="collection-btn__heart" aria-hidden="true">❤</span>
        <span className="collection-btn__text">{label} ({count})</span>
      </button>
      {open && <SavedSheet onClose={() => setOpen(false)} />}
    </>
  );
}

export default CollectionButton;
