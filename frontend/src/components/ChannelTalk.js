import { useEffect } from 'react';
import * as ChannelService from '@channel.io/channel-web-sdk-loader';
import { useLanguage } from '../contexts/LanguageContext';

const PLUGIN_KEY = 'c833a27c-9544-4d03-b953-ab3a6f9d7dfc';

/**
 * Channel Talk live-chat widget.
 * Renders nothing — boots the Channel Talk SDK which injects its own
 * floating launcher (bottom-right). QuickActionsDock sits mid-right, so
 * the two do not overlap.
 */
function ChannelTalk() {
  const { lang } = useLanguage();

  useEffect(() => {
    let booted = false;

    // Defer boot until the browser is idle so the chat SDK (external script +
    // iframe) doesn't compete with the initial page render / first scroll.
    const start = () => {
      ChannelService.loadScript();
      ChannelService.boot({
        pluginKey: PLUGIN_KEY,
        language: lang === 'en' ? 'en' : 'ko',
      });
      booted = true;
    };

    const ric = window.requestIdleCallback || ((cb) => window.setTimeout(cb, 2000));
    const cic = window.cancelIdleCallback || window.clearTimeout;
    const handle = ric(start);

    return () => {
      cic(handle);
      if (booted) {
        try {
          ChannelService.shutdown();
        } catch (e) {
          /* SDK may not be ready on fast unmount — safe to ignore */
        }
      }
    };
  }, [lang]);

  return null;
}

export default ChannelTalk;
