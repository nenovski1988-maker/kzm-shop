import { t } from '../lib/i18n';
import { getLang } from '../lib/lang';

export async function generateMetadata() {
  const lang = await getLang();
  return {
    title: t(lang, 'about.metaTitle'),
    description: t(lang, 'about.metaDescription'),
  };
}

export default async function AboutPage() {
  const lang = await getLang();
  const isEn = lang === 'en';

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '760px' }}>
      <h1>{t(lang, 'about.metaTitle')}</h1>

      {isEn ? (
        <>
          <p style={{ marginTop: '1.25rem', lineHeight: 1.7 }}>
            KZM EOOD is a specialized hoof health management company —
            prevention, treatment and monitoring of lameness in ruminants in
            Bulgaria. Founded in 2022, headquartered in Gabrovo.
          </p>

          <p style={{ marginTop: '1rem', lineHeight: 1.7 }}>
            KZM is the exclusive representative for Bulgaria of{' '}
            <a
              href="https://bovihoofcare.dk/en/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--g2)', fontWeight: 700 }}
            >
              BOVI Hoof Care
            </a>{' '}
            and a member of{' '}
            <a
              href="https://www.hooftrimmers.org/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--g2)', fontWeight: 700 }}
            >
              HTA — Hoof Trimmers Association
            </a>
            .
          </p>

          <p style={{ marginTop: '1rem', lineHeight: 1.7, color: 'var(--g3)' }}>
            Here, in the shop, we offer a curated selection of hoof health
            tools and supplies. For the full story of the company, our team
            and services, see{' '}
            <a href="https://kzm.bg/#about" style={{ color: 'var(--g2)', fontWeight: 700 }}>
              the main site kzm.bg
            </a>
            .
          </p>
        </>
      ) : (
        <>
          <p style={{ marginTop: '1.25rem', lineHeight: 1.7 }}>
            КЗМ ЕООД е специализирана компания за копитен здравен мениджмънт —
            превенция, лечение и мониторинг на куцота при преживни животни в
            България. Основана през 2022 г., с седалище в Габрово.
          </p>

          <p style={{ marginTop: '1rem', lineHeight: 1.7 }}>
            КЗМ е ексклузивен представител за България на{' '}
            <a
              href="https://bovihoofcare.dk/en/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--g2)', fontWeight: 700 }}
            >
              BOVI Hoof Care
            </a>{' '}
            и член на{' '}
            <a
              href="https://www.hooftrimmers.org/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--g2)', fontWeight: 700 }}
            >
              HTA — Hoof Trimmers Association
            </a>
            .
          </p>

          <p style={{ marginTop: '1rem', lineHeight: 1.7, color: 'var(--g3)' }}>
            Тук, в магазина, предлагаме подбрани инструменти и консумативи за
            копитно здраве. Пълната история на компанията, екипа и услугите ни
            виж на{' '}
            <a href="https://kzm.bg/#about" style={{ color: 'var(--g2)', fontWeight: 700 }}>
              основния сайт kzm.bg
            </a>
            .
          </p>
        </>
      )}
    </div>
  );
}
