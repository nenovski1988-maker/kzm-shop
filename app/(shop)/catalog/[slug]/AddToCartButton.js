'use client';

import { useState } from 'react';
import { useCart } from '../../lib/cartContext';
import { useLanguage } from '../../lib/languageContext';
import styles from './product.module.css';

export default function AddToCartButton({ product, name }) {
  const { addItem } = useCart();
  const { t } = useLanguage();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock_qty <= 0;

  function handleAdd() {
    // Записва в количката името на езика, с който е добавено — виж бележка
    // в cartContext: количката пази "снимка" на продукта в момента на добавяне.
    addItem({ ...product, name: name ?? product.name }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  if (outOfStock) {
    return (
      <button type="button" className="btn btn-primary" disabled>
        {t('product.stockOut')}
      </button>
    );
  }

  return (
    <div>
      <div className={styles.qtyRow}>
        <input
          type="number"
          min="1"
          max={product.stock_qty}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Math.min(product.stock_qty, parseInt(e.target.value, 10) || 1)))}
          className={styles.qtyInput}
        />
        <button type="button" className="btn btn-primary" onClick={handleAdd}>
          {added ? t('product.added') : t('product.addToCart')}
        </button>
      </div>
    </div>
  );
}
