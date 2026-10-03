'use client';

import { useState } from 'react';
import { sendDevRequest } from './actions';
import styles from './site.module.css';

export default function DevRequestForm() {
  const [name, setName] = useState('');
  const [page, setPage] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      await sendDevRequest({ name, page, message });
      setSent(true);
      setMessage('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className={styles.sentBox}>
        Изпратено! Ще получиш отговор на nenovski1988@gmail.com или ще се чуем директно.
        <button type="button" className="btn btn-ghost" onClick={() => setSent(false)} style={{ marginTop: '0.8rem' }}>
          Нова заявка
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="dr-name">Име (по желание)</label>
          <input id="dr-name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="dr-page">Раздел / страница</label>
          <input
            id="dr-page"
            type="text"
            placeholder="напр. /catalog, продуктова страница…"
            value={page}
            onChange={(e) => setPage(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="dr-message">Какво трябва да се промени? *</label>
        <textarea
          id="dr-message"
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Опиши проблема или желаната промяна…"
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={sending}>
        {sending ? 'Изпращане…' : 'Изпрати заявка'}
      </button>
    </form>
  );
}
