export const metadata = {
  title: 'За нас',
  description:
    'КЗМ ЕООД — специализирана компания за копитен здравен мениджмънт при преживни животни в България.',
};

export default function AboutPage() {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '760px' }}>
      <h1>За нас</h1>

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
    </div>
  );
}
