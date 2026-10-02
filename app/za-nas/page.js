export const metadata = { title: 'За нас' };

export default function AboutPage() {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <h1>За нас</h1>
      <p style={{ color: 'var(--g3)', marginTop: '0.75rem' }}>
        КЗМ ЕООД е специализирана компания в областта на копитния здравен мениджмънт.
        Пълната информация е на{' '}
        <a href="https://kzm.bg/#about" style={{ color: 'var(--g2)', fontWeight: 700 }}>
          основния сайт
        </a>
        .
      </p>
    </div>
  );
}
