import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.hero}>
      <div className="sec-label" style={{ justifyContent: 'center', display: 'flex' }}>
        КЗМ Магазин
      </div>
      <h1>Продукти за здрави копита</h1>
      <p>
        Инструменти, превантивни и лечебни средства за копитен здравен мениджмънт
        на говеда — директно от КЗМ ЕООД.
      </p>

      <div className={styles.placeholder}>
        Витрината с продукти (Задача 4 от плана) още не е построена — това е scaffold-ът
        на проекта: брандинг, оформление, Header/Footer и основна структура.
      </div>
    </div>
  );
}
