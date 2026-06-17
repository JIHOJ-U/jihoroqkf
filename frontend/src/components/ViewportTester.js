import React, { useEffect, useRef, useState } from 'react';
import {
  HiOutlineDeviceMobile,
  HiOutlineDeviceTablet,
  HiOutlineDesktopComputer,
} from 'react-icons/hi';
import { useLanguage } from '../contexts/LanguageContext';
import './ViewportTester.css';

const COPY = {
  ko: {
    label: '// TRY IT YOURSELF',
    title: '직접 반응형 테스트해보세요',
    desc: '핸들을 드래그하거나 프리셋을 눌러, 사이트가 어떤 폭에서도 깨지지 않는지 직접 확인해보세요.',
    breakpoints: { mobile: '모바일', tablet: '태블릿', laptop: '노트북', desktop: '데스크톱' },
    presetMobile: '모바일',
    presetTablet: '태블릿',
    presetLaptop: '노트북',
    presetDesktop: '데스크톱',
    handleLabel: '폭 조절',
  },
  en: {
    label: '// TRY IT YOURSELF',
    title: 'Try the responsive design',
    desc: 'Drag the handle or tap a preset to see how the site holds up at any width.',
    breakpoints: { mobile: 'Mobile', tablet: 'Tablet', laptop: 'Laptop', desktop: 'Desktop' },
    presetMobile: 'Mobile',
    presetTablet: 'Tablet',
    presetLaptop: 'Laptop',
    presetDesktop: 'Desktop',
    handleLabel: 'Resize',
  },
};

const PAGES = [
  { path: '/portfolio', label: '/portfolio' },
  { path: '/services',  label: '/services'  },
  { path: '/about',     label: '/about'     },
];

const MIN_WIDTH = 280;
const DEFAULT_WIDTH = 1024;

function getBreakpoint(width, copy) {
  if (width <= 500)  return { key: 'mobile',  label: copy.breakpoints.mobile  };
  if (width <= 900)  return { key: 'tablet',  label: copy.breakpoints.tablet  };
  if (width <= 1200) return { key: 'laptop',  label: copy.breakpoints.laptop  };
  return { key: 'desktop', label: copy.breakpoints.desktop };
}

function ViewportTester() {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.ko;

  const stageRef = useRef(null);
  const dragRef = useRef({ startX: 0, startWidth: 0, raf: 0 });
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [page, setPage] = useState(PAGES[0].path);
  const [dragging, setDragging] = useState(false);

  const presets = [
    { value: 375,  label: c.presetMobile,  icon: <HiOutlineDeviceMobile />   },
    { value: 768,  label: c.presetTablet,  icon: <HiOutlineDeviceTablet />   },
    { value: 1024, label: c.presetLaptop,  icon: <HiOutlineDesktopComputer /> },
    { value: 1440, label: c.presetDesktop, icon: <HiOutlineDesktopComputer /> },
  ];

  // If the parent window shrinks below the current iframe width, clamp it
  // back into the stage so the iframe never overflows its frame.
  useEffect(() => {
    const onResize = () => {
      const stage = stageRef.current;
      if (!stage) return;
      const max = stage.clientWidth;
      setWidth((w) => Math.min(w, max));
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const startDrag = (e) => {
    e.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    dragRef.current.startX = e.clientX;
    dragRef.current.startWidth = width;
    const stageWidth = stage.clientWidth;
    setDragging(true);

    const onMove = (ev) => {
      const dx = ev.clientX - dragRef.current.startX;
      const next = Math.max(MIN_WIDTH, Math.min(stageWidth, dragRef.current.startWidth + dx));
      if (dragRef.current.raf) cancelAnimationFrame(dragRef.current.raf);
      dragRef.current.raf = requestAnimationFrame(() => setWidth(next));
    };
    const onUp = () => {
      setDragging(false);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      if (dragRef.current.raf) cancelAnimationFrame(dragRef.current.raf);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  const applyPreset = (value) => {
    const stage = stageRef.current;
    if (!stage) return;
    setWidth(Math.min(value, stage.clientWidth));
  };

  const bp = getBreakpoint(width, c);
  const widthDisplay = Math.round(width);
  // When dragging, kill the iframe's pointer events so the cursor stays
  // owned by the drag instead of being captured by the embedded page.
  const iframeStyle = {
    width,
    pointerEvents: dragging ? 'none' : 'auto',
    transition: dragging ? 'none' : 'width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  };
  const handleStyle = {
    left: `calc(${width}px - 7px)`,
    transition: dragging ? 'none' : 'left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  };

  return (
    <section className="vp-tester">
      <div className="container-wide">
        <header className="vp-head">
          <span className="vp-label" translate="no">{c.label}</span>
          <h2 className="vp-title">{c.title}</h2>
          <p className="vp-desc">{c.desc}</p>
        </header>

        <div className="vp-controls">
          <div className="vp-tabs" role="tablist">
            {PAGES.map((p) => (
              <button
                key={p.path}
                type="button"
                role="tab"
                aria-selected={page === p.path}
                className={`vp-tab ${page === p.path ? 'is-active' : ''}`}
                onClick={() => setPage(p.path)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="vp-presets" role="group">
            {presets.map((p) => (
              <button
                key={p.value}
                type="button"
                className={`vp-preset ${width === p.value ? 'is-active' : ''}`}
                onClick={() => applyPreset(p.value)}
              >
                <span className="vp-preset-icon" aria-hidden="true">{p.icon}</span>
                <span className="vp-preset-label">{p.label}</span>
                <span className="vp-preset-num">{p.value}</span>
              </button>
            ))}
          </div>

          <div className={`vp-readout vp-readout--${bp.key}`} aria-live="polite">
            <span className="vp-readout-num">{widthDisplay}</span>
            <span className="vp-readout-unit">px</span>
            <span className="vp-readout-sep">·</span>
            <span className="vp-readout-bp">{bp.label}</span>
          </div>
        </div>

        <div className={`vp-stage ${dragging ? 'is-dragging' : ''}`} ref={stageRef}>
          <div className="vp-ruler" aria-hidden="true">
            {[375, 768, 1024, 1440].map((tick) => (
              <span
                key={tick}
                className="vp-tick"
                style={{ left: `${tick}px` }}
              >
                {tick}
              </span>
            ))}
          </div>

          <iframe
            key={page}
            src={page}
            title={`Responsive preview — ${page}`}
            className="vp-iframe"
            loading="lazy"
            style={iframeStyle}
          />

          <button
            type="button"
            className="vp-handle"
            onPointerDown={startDrag}
            aria-label={c.handleLabel}
            style={handleStyle}
          >
            <span className="vp-handle-grip" aria-hidden="true">
              <i /><i /><i />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default ViewportTester;
