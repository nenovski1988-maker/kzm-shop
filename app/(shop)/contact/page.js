import { t } from '../lib/i18n';
import { getLang } from '../lib/lang';

export async function generateMetadata() {
  const lang = await getLang();
  return {
    title: t(lang, 'contact.metaTitle'),
    description: t(lang, 'contact.metaDescription'),
  };
}

export default async function ContactPage() {
  const lang = await getLang();

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '640px' }}>
      <h1>{t(lang, 'contact.title')}</h1>

      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '1rem' }}>
        <div>
          <div className="sec-label">{t(lang, 'contact.phone')}</div>
          <a href="tel:+359878599115" style={{ color: 'var(--g2)', fontWeight: 700 }}>
            +359 878 599 115
          </a>
        </div>

        <div>
          <div className="sec-label">{t(lang, 'contact.email')}</div>
          <a href="mailto:info@kzm.bg" style={{ color: 'var(--g2)', fontWeight: 700 }}>
            info@kzm.bg
          </a>
        </div>

        <div>
          <div className="sec-label">{t(lang, 'contact.address')}</div>
          <div>{t(lang, 'contact.addressValue')}</div>
        </div>

        <div>
          <div className="sec-label">{t(lang, 'contact.company')}</div>
          <div>КЗМ ЕООД</div>
        </div>
      </div>

      <p style={{ marginTop: '1.75rem', color: 'var(--g3)' }}>
        {t(lang, 'contact.more')}{' '}
        <a href="https://kzm.bg/#contact" style={{ color: 'var(--g2)', fontWeight: 700 }}>
          {t(lang, 'contact.mainSite')}
        </a>
        .
      </p>
    </div>
  );
}
