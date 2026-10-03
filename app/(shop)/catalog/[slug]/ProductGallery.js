'use client';

import { useState } from 'react';
import { useLanguage } from '../../lib/languageContext';
import styles from './product.module.css';

export default function ProductGallery({ images, name }) {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const hasImages = images && images.length > 0;

  return (
    <div>
      <div className={styles.mainImage}>
        {hasImages ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={images[active]} alt={name} />
        ) : (
          t('product.noImage')
        )}
      </div>
      {hasImages && images.length > 1 && (
        <div className={styles.thumbs}>
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              className={`${styles.thumbBtn} ${i === active ? styles.thumbBtnActive : ''}`}
              onClick={() => setActive(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
