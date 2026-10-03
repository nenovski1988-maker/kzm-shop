import CartView from './CartView';

export const metadata = { title: 'Кошница' };

// Без това Next.js/Vercel кешира страницата статично (генерирана веднъж при
// build) и я сервира от CDN кеша — клиентите виждат стар JS бъндъл дори след
// нов деплой, докато кешът не изтече. Останалите страници вече го имат.
export const dynamic = 'force-dynamic';

export default function CartPage() {
  return <CartView />;
}
