export const metadata = { title: 'Контакти' };

export default function ContactPage() {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <h1>Контакти</h1>
      <p style={{ color: 'var(--g3)', marginTop: '0.75rem' }}>
        Виж пълните контакти на{' '}
        <a href="https://kzm.bg/#contact" style={{ color: 'var(--g2)', fontWeight: 700 }}>
          основния сайт kzm.bg
        </a>
        .
      </p>
    </div>
  );
}
