/**
 * GA4 event helpers. Centralized so we never sprinkle raw window.gtag calls,
 * and so a missing GA4 (dev / blocked) silently no-ops.
 *
 * Usage:
 *   import { trackEvent, trackCta } from '../utils/analytics';
 *   trackCta('contact_button', { source: 'navbar' });
 */

const isReady = () => typeof window !== 'undefined' && typeof window.gtag === 'function';

export function trackEvent(name, params = {}) {
  if (!isReady()) return;
  try {
    window.gtag('event', name, params);
  } catch (e) {
    /* don't let analytics break the app */
  }
}

/** Standard CTA click — `cta_id` is the only required identifier. */
export function trackCta(ctaId, extra = {}) {
  trackEvent('cta_click', { cta_id: ctaId, ...extra });
}

/* === Inquiry funnel ==================================================
   Weekly funnel in GA4 (Explore → Funnel exploration):
     1. session_start              — visitors
     2. page_view  page_path=/contact — contact page visits
     3. form_start                 — started typing in the form
     4. generate_lead              — submit succeeded (mark as key event)
   Side events: inquiry_submit_fail, contact_click (method=phone|kakao|email). */

/** Inquiry/contact form submit (success). Fires GA4's recommended
 *  `generate_lead` (mark it as a key event) plus the legacy event name. */
export function trackInquirySubmit(extra = {}) {
  trackEvent('generate_lead', { currency: 'KRW', value: 0, ...extra });
  trackEvent('inquiry_submit', extra);
}

/** First interaction with the inquiry form — once per page view. */
export function trackFormStart(formId) {
  trackEvent('form_start', { form_id: formId });
}

/** Submit failed (network, timeout, server error). */
export function trackInquiryFail(reason) {
  trackEvent('inquiry_submit_fail', { reason });
}

/** Direct-contact click: method = 'phone' | 'kakao' | 'email'. */
export function trackContactClick(method, source) {
  trackEvent('contact_click', { method, source });
}

/** Channel Talk opened from anywhere in the UI. */
export function trackChatOpen(source) {
  trackEvent('chat_open', { source });
}

/** Portfolio card click — passes the id so we can rank popular items. */
export function trackPortfolioOpen(id, title) {
  trackEvent('portfolio_open', { portfolio_id: id, portfolio_title: title });
}

/* === Scroll-depth tracker ===========================================
   Fires once per breakpoint (25/50/75/100) per page navigation. The
   listener is throttled with requestAnimationFrame to stay cheap. */
const BREAKPOINTS = [25, 50, 75, 100];
let firedFor = new Set();
let scheduled = false;
let currentKey = null;

function scrollHandler() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const pct = Math.round((window.scrollY / scrollable) * 100);
    for (const b of BREAKPOINTS) {
      if (pct >= b && !firedFor.has(b)) {
        firedFor.add(b);
        trackEvent('scroll_depth', { depth: b, page: currentKey });
      }
    }
  });
}

/** Call on every route change to reset and (re)bind the listener. */
export function bindScrollDepth(pageKey) {
  currentKey = pageKey;
  firedFor = new Set();
  window.removeEventListener('scroll', scrollHandler);
  window.addEventListener('scroll', scrollHandler, { passive: true });
  // Fire once after mount in case the page is already partially scrolled
  scrollHandler();
}
