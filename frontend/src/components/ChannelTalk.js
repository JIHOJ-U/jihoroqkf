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
    ChannelService.loadScript();
    ChannelService.boot({
      pluginKey: PLUGIN_KEY,
      language: lang === 'en' ? 'en' : 'ko',
    });

    return () => {
      try {
        ChannelService.shutdown();
      } catch (e) {
        /* SDK may not be ready on fast unmount — safe to ignore */
      }
    };
  }, [lang]);

  return null;
}

export default ChannelTalk;
