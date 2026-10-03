import { Resend } from 'resend';

// Единен Resend клиент за целия проект. Ако няма зададен ключ (напр. локално
// без .env.local), не гърми — просто логва и прескача изпращането, за да не
// блокира поръчката/формата заради липсваща имейл настройка.
let client = null;

function getClient() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

// Докато shop.kzm.bg не е верифициран в Resend (идва в Задача 8), пращаме от
// техния споделен тестов домейн — работи веднага, без DNS настройка.
const FROM = process.env.RESEND_FROM_EMAIL || 'KZM Shop <onboarding@resend.dev>';

export async function sendEmail({ to, subject, html, replyTo }) {
  const resend = getClient();
  if (!resend) {
    console.warn('[resend] RESEND_API_KEY не е зададен — имейл НЕ е изпратен:', subject);
    return { skipped: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    });
    if (error) {
      console.error('[resend] грешка при изпращане:', error);
      return { skipped: false, error };
    }
    return { skipped: false, data };
  } catch (err) {
    // Никога не хвърляме нататък — имейл известието е "best effort" и не
    // трябва да провали поръчката или формата, ако Resend е недостъпен.
    console.error('[resend] изключение при изпращане:', err);
    return { skipped: false, error: err };
  }
}
