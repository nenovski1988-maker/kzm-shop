import DevRequestForm from './DevRequestForm';
import { CHANGELOG } from './changelog';
import styles from './site.module.css';

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminSitePage() {
  return (
    <div>
      <section className={styles.section}>
        <h2>Бързи връзки</h2>
        <p className={styles.hint}>
          Общите входни точки на Google — ако влезеш с акаунта, който управлява kzm.bg,
          директно виждаш статистиките на сайта.
        </p>
        <div className={styles.quickLinks}>
          <a
            href="https://analytics.google.com/analytics/web/"
            target="_blank"
            rel="noopener noreferrer"
            className={`card ${styles.quickLink}`}
          >
            <span className={styles.quickLinkTitle}>Google Analytics →</span>
            <span className={styles.quickLinkDesc}>Посещения, трафик, поведение на сайта</span>
          </a>
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className={`card ${styles.quickLink}`}
          >
            <span className={styles.quickLinkTitle}>Google Search Console →</span>
            <span className={styles.quickLinkDesc}>Индексиране, търсения, грешки</span>
          </a>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Заявка към екипа</h2>
        <p className={styles.hint}>
          Нещо не работи или трябва да се промени? Изпрати директно — отива на
          nenovski1988@gmail.com.
        </p>
        <DevRequestForm />
      </section>

      <section className={styles.section}>
        <h2>Дневник на промените</h2>
        <div className={styles.changelog}>
          {CHANGELOG.map((entry, i) => (
            <div key={i} className={styles.changelogRow}>
              <span className={styles.changelogDate}>{entry.date}</span>
              <span className={styles.changelogText}>{entry.text}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
