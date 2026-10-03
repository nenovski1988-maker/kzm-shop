'use client';

import { useLanguage } from '../lib/languageContext';
import styles from './LanguageToggle.module.css';

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className={styles.toggle} role="group" aria-label="Език / Language">
      <button
        type="button"
        className={`${styles.opt} ${lang === 'bg' ? styles.active : ''}`}
        onClick={() => setLang('bg')}
        aria-pressed={lang === 'bg'}
      >
        BG
      </button>
      <button
        type="button"
        className={`${styles.opt} ${lang === 'en' ? styles.active : ''}`}
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
    </div>
  );
}
