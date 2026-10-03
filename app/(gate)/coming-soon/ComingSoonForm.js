'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { t } from '../../(shop)/lib/i18n';
import { verifyPin } from './actions';
import styles from './coming-soon.module.css';

export default function ComingSoonForm({ lang }) {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setChecking(true);

    try {
      const res = await verifyPin(pin);
      if (!res.success) {
        setError(res.message || t(lang, 'comingSoon.wrongCode'));
        setChecking(false);
        return;
      }
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('[coming-soon] грешка при проверка на кода:', err);
      setError(t(lang, 'comingSoon.error'));
      setChecking(false);
    }
  }

  return (
    <form className={styles.pinForm} onSubmit={handleSubmit}>
      <label htmlFor="pin" className="visually-hidden">{t(lang, 'comingSoon.pinLabel')}</label>
      <input
        id="pin"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={4}
        placeholder="····"
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
        className={styles.pinInput}
        autoComplete="off"
      />
      <button type="submit" className="btn btn-primary" disabled={checking || pin.length === 0}>
        {checking ? t(lang, 'comingSoon.checking') : t(lang, 'comingSoon.submit')}
      </button>
      {error && <div className={styles.error}>{error}</div>}
    </form>
  );
}
