import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { HiCode } from 'react-icons/hi';
import { getPortfolios, getImageUrl } from '../api';
import { useLanguage } from '../contexts/LanguageContext';
import { useCollection } from '../hooks/useCollection';
import './SavedSheet.css';

// Module-level cache so opening the sheet repeatedly doesn't re-hit the API.
let _portfoliosCache = null;
let _portfoliosPromise = null;

function fetchAllPortfolios() {
  if (_portfoliosCache) return Promise.resolve(_portfoliosCache);
  if (_portfoliosPromise) return _portfoliosPromise;
  _portfoliosPromise = getPortfolios()
    .then((res) => {
      _portfoliosCache = Array.isArray(res.data) ? res.data : [];
      _portfoliosPromise = null;
      return _portfoliosCache;
    })
    .catch(() => {
      _portfoliosPromise = null;
      return [];
    });
  return _portfoliosPromise;
}

function SavedSheet({ onClose }) {
  const { t } = useLanguage();
  const c = t.collection || {};
  const { pinned, toggle, clearAll, count } = useCollection();
  const navigate = useNavigate();
  const [all, setAll] = useState(_portfoliosCache || []);
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    let alive = true;
    fetchAllPortfolios().then((list) => {
      if (alive) setAll(list);
    });
    return () => { alive = false; };
  }, []);

  // Focus + scroll lock + keyboard trap
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => {
      if (closeBtnRef.current) closeBtnRef.current.focus();
    }, 20);
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      else if (e.key === 'Tab') {
        const root = dialogRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const items = pinned
    .map((id) => all.find((p) => String(p.id) === String(id)))
    .filter(Boolean);

  const handleOpen = useCallback((id) => {
    onClose();
    navigate(`/portfolio/${id}`);
  }, [navigate, onClose]);

  const handleRemove = (e, id) => {
    e.stopPropagation();
    toggle(id);
  };

  const handleClearAll = () => {
    // eslint-disable-next-line no-alert
    if (window.confirm(c.clearConfirm || 'Clear all?')) {
      clearAll();
    }
  };

  const sheet = (
    <div
      className="saved-sheet"
      role="dialog"
      aria-modal="true"
      aria-label={c.header || 'saved.json'}
      ref={dialogRef}
    >
      <div className="saved-sheet__backdrop" onClick={onClose} />

      <aside className="saved-sheet__panel">
        <header className="saved-sheet__bar">
          <div className="saved-sheet__dots" aria-hidden="true">
            <span className="saved-sheet__dot saved-sheet__dot--red" />
            <span className="saved-sheet__dot saved-sheet__dot--yellow" />
            <span className="saved-sheet__dot saved-sheet__dot--green" />
          </div>
          <span className="saved-sheet__filename">{c.header || 'saved.json'}</span>
          <button
            type="button"
            ref={closeBtnRef}
            className="saved-sheet__close"
            onClick={onClose}
            aria-label={c.close || 'Close'}
          >
            ×
          </button>
        </header>

        <div className="saved-sheet__body">
          {items.length === 0 ? (
            <p className="saved-sheet__empty">
              {(c.empty || '').split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i === 0 && <br />}
                </React.Fragment>
              ))}
            </p>
          ) : (
            <ul className="saved-sheet__list">
              {items.map((p) => (
                <li key={p.id} className="saved-sheet__item">
                  <button
                    type="button"
                    className="saved-sheet__row"
                    onClick={() => handleOpen(p.id)}
                  >
                    <span className="saved-sheet__thumb" aria-hidden="true">
                      <span className="saved-sheet__thumb-bar">
                        <i /><i /><i />
                      </span>
                      <span className="saved-sheet__thumb-img">
                        {p.thumbnail ? (
                          <img
                            src={getImageUrl(p.thumbnail)}
                            alt=""
                            loading="lazy"
                          />
                        ) : (
                          <HiCode />
                        )}
                      </span>
                    </span>
                    <span className="saved-sheet__meta">
                      <span className="saved-sheet__title">{p.title}</span>
                      {p.client && (
                        <span className="saved-sheet__client">{p.client}</span>
                      )}
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      className="saved-sheet__remove"
                      onClick={(e) => handleRemove(e, p.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          toggle(p.id);
                        }
                      }}
                      aria-label={`${p.title} — remove`}
                    >
                      ×
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {count > 0 && (
          <footer className="saved-sheet__footer">
            <button
              type="button"
              className="saved-sheet__clear"
              onClick={handleClearAll}
            >
              {c.clearAll || 'Clear all'}
            </button>
          </footer>
        )}
      </aside>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(sheet, document.body);
}

export default SavedSheet;
