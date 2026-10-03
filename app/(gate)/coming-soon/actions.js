'use server';

import { cookies } from 'next/headers';

const ACCESS_COOKIE = 'kzm_site_access';

export async function verifyPin(pin) {
  const expected = process.env.SITE_PIN;

  if (!expected) {
    console.error('[coming-soon] SITE_PIN не е зададен в env променливите.');
    return { success: false, message: 'Кодът не е конфигуриран. Свържи се с администратора.' };
  }

  if ((pin ?? '').trim() !== expected) {
    return { success: false, message: 'Грешен код. Опитай отново.' };
  }

  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE, 'granted', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 60, // 60 дни
  });

  return { success: true };
}
