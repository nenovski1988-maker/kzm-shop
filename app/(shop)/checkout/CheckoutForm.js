'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../lib/cartContext';
import { useLanguage } from '../lib/languageContext';
import { formatPriceEur, courierLabel } from '../lib/i18n';
import { createOrder } from './actions';
import styles from './checkout.module.css';

const COURIERS = ['Спиди', 'Еконт']; // вътрешни стойности — показваният текст се превежда (courierLabel)

export default function CheckoutForm() {
  const { items, loaded, totalCents, clearCart } = useCart();
  const { t, lang } = useLanguage();

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
        <h1>{t('checkout.successTitle')}</h1>
        <p>{t('checkout.successBody')(phone)}</p>
        <div className={styles.orderNumber}>{t('checkout.orderNumber')(result.orderId.slice(0, 8))}</div>
        <p style={{ marginTop: '1rem' }}>{t('checkout.totalAmount')} <strong>{formatPriceEur(result.totalCents, lang)}</strong></p>
        <Link href="/catalog" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          {t('checkout.backToProducts')}
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.wrap}>
        <h1>{t('checkout.title')}</h1>
        <p>{t('checkout.emptyCart')} <Link href="/catalog" style={{ color: 'var(--g2)', fontWeight: 700 }}>{t('checkout.browse')}</Link></p>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const res = await createOrder(
        { name, phone, email, deliveryMethod, courier, address, city, office, notes, lang },
        items.map((i) => ({ productId: i.productId, name: i.name, priceCents: i.priceCents, qty: i.qty }))
      );
      if (!res.success) {
        setError(res.message || t('checkout.genericError'));
        setSaving(false);
        return;
      }
      setResult(res);
      clearCart();
    } catch (err) {
      setError(t('checkout.unexpectedError'));
      setSaving(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <h1>{t('checkout.title')}</h1>

      <div className={styles.summary}>
        {items.map((i) => (
          <div key={i.productId} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{i.name} × {i.qty}</span>
            <span>{formatPriceEur(i.priceCents * i.qty, lang)}</span>
          </div>
        ))}
        <div className={styles.summaryTotal} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{t('cart.total')}</span>
          <span>{formatPriceEur(totalCents, lang)}</span>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="name">{t('checkout.fullName')}</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label htmlFor="phone">{t('checkout.phone')}</label>
            <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="email">{t('checkout.email')}</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label>{t('checkout.deliveryMethod')}</label>
          <div className={styles.deliveryOptions}>
            <label className={`${styles.deliveryOption} ${deliveryMethod === 'courier' ? styles.deliveryOptionActive : ''}`}>
              <input
                type="radio"
                name="deliveryMethod"
                value="courier"
                checked={deliveryMethod === 'courier'}
                onChange={() => setDeliveryMethod('courier')}
              />
              {t('checkout.toAddress')}
            </label>
            <label className={`${styles.deliveryOption} ${deliveryMethod === 'pickup' ? styles.deliveryOptionActive : ''}`}>
              <input
                type="radio"
                name="deliveryMethod"
                value="pickup"
                checked={deliveryMethod === 'pickup'}
                onChange={() => setDeliveryMethod('pickup')}
              />
              {t('checkout.toOffice')}
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="courier">{t('checkout.courier')}</label>
          <select id="courier" value={courier} onChange={(e) => setCourier(e.target.value)}>
            {COURIERS.map((c) => (
              <option key={c} value={c}>{courierLabel(c, lang)}</option>
            ))}
          </select>
        </div>

        {deliveryMethod === 'courier' ? (
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="city">{t('checkout.city')}</label>
              <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label htmlFor="address">{t('checkout.address')}</label>
              <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
          </div>
        ) : (
          <div className={styles.field}>
            <label htmlFor="office">{t('checkout.office')}</label>
            <input
              id="office"
              type="text"
              value={office}
              onChange={(e) => setOffice(e.target.value)}
              placeholder={t('checkout.officePlaceholder')}
              required
            />
          </div>
        )}

        <div className={styles.field}>
          <label htmlFor="notes">{t('checkout.notes')}</label>
          <textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label>{t('checkout.payment')}</label>
          <div style={{ fontSize: '0.88rem', color: 'var(--g3)' }}>{t('checkout.cod')}</div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? t('checkout.sending') : t('checkout.submit')(formatPriceEur(totalCents, lang))}
        </button>
      </form>
    </div>
  );
}
