'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toggleProductActive } from './actions';

export default function ToggleActiveButton({ id, active }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  function handleClick() {
    setError('');
    startTransition(async () => {
      try {
        await toggleProductActive(id, !active);
        router.refresh();
      } catch (err) {
        setError(err.message || 'Грешка.');
      }
    });
  }

  return (
    <button type="button" className="btn btn-ghost" onClick={handleClick} disabled={isPending} title={error || ''}>
      {isPending ? '…' : active ? 'Скрий' : 'Покажи'}
    </button>
  );
}
