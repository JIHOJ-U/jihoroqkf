import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiPhone, HiChatAlt2, HiPencilAlt } from 'react-icons/hi';
import { useLanguage } from '../contexts/LanguageContext';
import { trackContactClick, trackCta } from '../utils/analytics';
import { PHONE_TEL, KAKAO_CHANNEL_URL } from '../data/contactChannels';
import './MobileContactBar.css';

const COPY = {
  ko: { phone: '전화 상담', kakao: '카톡 상담', form: '문의 남기기', aria: '빠른 상담' },
  en: { phone: 'Call', kakao: 'KakaoTalk', form: 'Inquire', aria: 'Quick contact' },
};

/* Fixed bottom bar on mobile: call + KakaoTalk. Until the Kakao channel URL
   is configured (data/contactChannels.js) the second slot links to the form. */
function MobileContactBar() {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.ko;

  // Body class lets other floating buttons move up and adds bottom padding
  // so the bar never covers the footer.
  useEffect(() => {
    document.body.classList.add('has-mcb');
    return () => document.body.classList.remove('has-mcb');
  }, []);

  return (
    <nav className="mcb" aria-label={c.aria}>
      <a href={PHONE_TEL} className="mcb__btn mcb__btn--phone" onClick={() => trackContactClick('phone', 'mobile_bar')}>
        <HiPhone aria-hidden="true" /> {c.phone}
      </a>
      {KAKAO_CHANNEL_URL ? (
        <a
          href={KAKAO_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mcb__btn mcb__btn--kakao"
          onClick={() => trackContactClick('kakao', 'mobile_bar')}
        >
          <HiChatAlt2 aria-hidden="true" /> {c.kakao}
        </a>
      ) : (
        <Link to="/contact" className="mcb__btn mcb__btn--form" onClick={() => trackCta('contact_form', { source: 'mobile_bar' })}>
          <HiPencilAlt aria-hidden="true" /> {c.form}
        </Link>
      )}
    </nav>
  );
}

export default MobileContactBar;
