import CheckoutForm from './CheckoutForm';

export const metadata = { title: 'Поръчка' };

// Виж бележката в app/cart/page.js — без това страницата се кешира статично
// от Vercel CDN и може да сервира стар JS бъндъл след деплой.
export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  return <CheckoutForm />;
}
