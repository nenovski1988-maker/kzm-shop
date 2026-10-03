import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>КЗМ Магазин</div>
        <nav className={styles.links}>
          <a href="https://kzm.bg">kzm.bg</a>
          <a href="https://kzm.bg/privacy.html">Поверителност</a>
          <a href="https://kzm.bg/cookies.html">Бисквитки</a>
          <a href="/contact">Контакти</a>
        </nav>
        <div className={styles.copy}>© {new Date().getFullYear()} КЗМ ЕООД</div>
      </div>
      <a
        href="https://hrumstudio.online"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.credit}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        Създадено от <img src="/hrum-logo.png" alt="HRUM STUDIO" />
      </a>
    </footer>
  );
}
