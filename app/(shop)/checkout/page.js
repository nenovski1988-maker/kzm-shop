import CheckoutForm from './CheckoutForm';
import { t } from '../lib/i18n';
import { getLang } from '../lib/lang';

export async function generateMetadata() {
  const lang = await getLang();
  return { title: t(lang, 'checkout.metaTitle') };
}

// Виж бележката в app/cart/page.js — без това страницата се кешира статично
// от Vercel CDN и може да сервира стар JS бъндъл след деплой.
export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  return <CheckoutForm />;
}
