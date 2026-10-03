export const metadata = {
  title: 'Контакти',
  description: 'Контакти на КЗМ ЕООД — телефон, имейл и адрес.',
};

export default function ContactPage() {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '640px' }}>
      <h1>Контакти</h1>

      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '1rem' }}>
        <div>
          <div className="sec-label">Телефон</div>
          <a href="tel:+359878599115" style={{ color: 'var(--g2)', fontWeight: 700 }}>
            +359 878 599 115
          </a>
        </div>

        <div>
          <div className="sec-label">Имейл</div>
          <a href="mailto:info@kzm.bg" style={{ color: 'var(--g2)', fontWeight: 700 }}>
            info@kzm.bg
          </a>
        </div>

        <div>
          <div className="sec-label">Адрес</div>
          <div>Габрово, България</div>
        </div>

        <div>
          <div className="sec-label">Фирма</div>
          <div>КЗМ ЕООД</div>
        </div>
      </div>

      <p style={{ marginTop: '1.75rem', color: 'var(--g3)' }}>
        За контактна форма и повече начини за връзка виж{' '}
        <a href="https://kzm.bg/#contact" style={{ color: 'var(--g2)', fontWeight: 700 }}>
          основния сайт kzm.bg
        </a>
        .
      </p>
    </div>
  );
}
