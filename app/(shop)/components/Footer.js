import { t } from '../lib/i18n';
import styles from './Footer.module.css';

export default function Footer({ lang }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>{t(lang, 'footer.brand')}</div>
        <nav className={styles.links}>
          <a href="https://kzm.bg">{t(lang, 'footer.mainSiteLink')}</a>
          <a href="https://kzm.bg/privacy.html">{t(lang, 'footer.privacy')}</a>
          <a href="https://kzm.bg/cookies.html">{t(lang, 'footer.cookies')}</a>
          <a href="/contact">{t(lang, 'footer.contact')}</a>
        </nav>
        <div className={styles.copy}>{t(lang, 'footer.copyright')(new Date().getFullYear())}</div>
      </div>
      <a
        href="https://hrumstudio.online"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.credit}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {t(lang, 'footer.madeBy')} <img src="/hrum-logo.png" alt="HRUM STUDIO" />
      </a>
    </footer>
  );
}
