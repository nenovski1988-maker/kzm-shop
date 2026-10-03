'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../lib/cartContext';
import { formatPriceEur } from '../components/ProductCard';
import { createOrder } from './actions';
import styles from './checkout.module.css';

const COURIERS = ['Спиди', 'Еконт'];

export default function CheckoutForm() {
  const { items, loaded, totalCents, clearCart } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('courier');
  const [courier, setCourier] = useState(COURIERS[0]);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [office, setOffice] = useState('');
  const [notes, setNotes] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null); // { orderId, totalCents }

  if (!loaded) return null;

  if (result) {
    return (
      <div className={styles.success}>
        <h1>Поръчката е приета!</h1>
        <p>Ще се свържем с теб на {phone} за потвърждение на доставката.</p>
        <div className={styles.orderNumber}>Поръчка № {result.orderId.slice(0, 8)}</div>
        <p style={{ marginTop: '1rem' }}>Обща сума: <strong>{formatPriceEur(result.totalCents)}</strong></p>
        <Link href="/catalog" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          Обратно към продуктите
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.wrap}>
        <h1>Поръчка</h1>
        <p>Количката е празна. <Link href="/catalog" style={{ color: 'var(--g2)', fontWeight: 700 }}>Разгледай продуктите →</Link></p>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const res = await createOrder(
        { name, phone, email, deliveryMethod, courier, address, city, office, notes },
        items.map((i) => ({ productId: i.productId, name: i.name, priceCents: i.priceCents, qty: i.qty }))
      );
      if (!res.success) {
        setError(res.message || 'Нещо се обърка при изпращането на поръчката.');
        setSaving(false);
        return;
      }
      setResult(res);
      clearCart();
    } catch (err) {
      setError('Възникна неочаквана грешка. Опитай отново.');
      setSaving(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <h1>Поръчка</h1>

      <div className={styles.summary}>
        {items.map((i) => (
          <div key={i.productId} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{i.name} × {i.qty}</span>
            <span>{formatPriceEur(i.priceCents * i.qty)}</span>
          </div>
        ))}
        <div className={styles.summaryTotal} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Общо:</span>
          <span>{formatPriceEur(totalCents)}</span>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="name">Име и фамилия *</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label htmlFor="phone">Телефон *</label>
            <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Имейл (по желание)</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label>Начин на доставка *</label>
          <div className={styles.deliveryOptions}>
            <label className={`${styles.deliveryOption} ${deliveryMethod === 'courier' ? styles.deliveryOptionActive : ''}`}>
              <input
                type="radio"
                name="deliveryMethod"
                value="courier"
                checked={deliveryMethod === 'courier'}
                onChange={() => setDeliveryMethod('courier')}
              />
              До адрес
            </label>
            <label className={`${styles.deliveryOption} ${deliveryMethod === 'pickup' ? styles.deliveryOptionActive : ''}`}>
              <input
                type="radio"
                name="deliveryMethod"
                value="pickup"
                checked={deliveryMethod === 'pickup'}
                onChange={() => setDeliveryMethod('pickup')}
              />
              До офис на куриер
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="courier">Куриер</label>
          <select id="courier" value={courier} onChange={(e) => setCourier(e.target.value)}>
            {COURIERS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {deliveryMethod === 'courier' ? (
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="city">Град *</label>
              <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label htmlFor="address">Адрес *</label>
              <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
          </div>
        ) : (
          <div className={styles.field}>
            <label htmlFor="office">Офис на куриера *</label>
            <input
              id="office"
              type="text"
              value={office}
              onChange={(e) => setOffice(e.target.value)}
              placeholder="Напр. офис Габрово, ул. ..."
              required
            />
          </div>
        )}

        <div className={styles.field}>
          <label htmlFor="notes">Бележка към поръчката (по желание)</label>
          <textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label>Плащане</label>
          <div style={{ fontSize: '0.88rem', color: 'var(--g3)' }}>Наложен платеж (плащане при доставка)</div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Изпращане…' : `Завърши поръчката — ${formatPriceEur(totalCents)}`}
        </button>
      </form>
    </div>
  );
}
