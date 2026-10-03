'use server';

import { sendEmail } from '../../lib/resend';
import { devRequestEmail } from '../../lib/emailTemplates';

// Пренесено от стария kzm.bg/admin.html: форма "Заявка към екипа", която
// преди пращаше имейл директно от статичния сайт. Тук отива винаги към
// личния имейл на Миро (nenovski1988@gmail.com) — изрично уточнено по-рано,
// НЕ към hhdconsult@gmail.com.
const DEV_REQUEST_EMAIL = 'nenovski1988@gmail.com';

export async function sendDevRequest({ name, page, message }) {
  if (!message?.trim()) throw new Error('Опиши какво трябва да се промени.');

  const { subject, html } = devRequestEmail({
    name: name?.trim() || '',
    page: page?.trim() || '',
    message: message.trim(),
  });

  const result = await sendEmail({ to: DEV_REQUEST_EMAIL, subject, html });
  if (result.error) throw new Error('Грешка при изпращането. Опитай отново или пиши директно.');
  if (result.skipped) throw new Error('Имейл настройката не е готова (липсва RESEND_API_KEY).');

  return { ok: true };
}
