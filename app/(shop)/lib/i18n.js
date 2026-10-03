// Двуезичен (BG/EN) речник за витрината + малки помощни функции.
//
// Как работи избора на език: пази се в cookie "kzm_lang" (bg|en, по
// подразбиране bg). Сървърните компоненти го четат през lib/lang.js
// (getLang, cookies() от next/headers). Клиентските компоненти го четат
// през lib/languageContext.js (React context, инициализиран от същата
// cookie стойност на сървъра, за да няма "мигане" при зареждане).
//
// Превключвателят в Header-а презаписва cookie-то и вика router.refresh(),
// което презарежда сървърните компоненти с новия език — адресът в
// браузъра не се променя.

export const DEFAULT_LANG = 'bg';
export const LANGS = ['bg', 'en'];
// Живее тук (не в lib/lang.js), защото lang.js internally import-ва
// next/headers (server-only) — а тази константа трябва да е достъпна и от
// 'use client' файлове (languageContext.js), без да ги дърпа в server-only.
export const LANG_COOKIE = 'kzm_lang';

const dict = {
  bg: {
    header: {
      shopTag: 'Магазин',
      products: 'Продукти',
      about: 'За нас',
      contact: 'Контакти',
      mainSite: '← Основен сайт',
      cartLabel: 'Кошница',
    },
    footer: {
      brand: 'КЗМ Магазин',
      mainSiteLink: 'kzm.bg',
      privacy: 'Поверителност',
      cookies: 'Бисквитки',
      contact: 'Контакти',
      copyright: (year) => `© ${year} КЗМ ЕООД`,
      madeBy: 'Създадено от',
    },
    home: {
      tag: 'КЗМ Магазин',
      title: 'Продукти за здрави копита',
      lead: 'Инструменти, превантивни и лечебни средства за копитен здравен мениджмънт на говеда — директно от КЗМ ЕООД.',
      cta: 'Разгледай продуктите',
    },
    catalog: {
      metaTitle: 'Продукти',
      tag: 'КЗМ Магазин',
      title: 'Продукти',
      lead: 'Инструменти, превантивни и лечебни средства за копитен здравен мениджмънт.',
      all: 'Всички',
      emptyNone: 'Засега няма добавени продукти — очаквайте скоро.',
      emptyCategory: 'Няма продукти в тази категория.',
      loadError: 'Възникна грешка при зареждане на продуктите. Опитай отново по-късно.',
      noImage: 'няма снимка',
      outOfStock: 'Изчерпан',
    },
    product: {
      notFoundTitle: 'Продуктът не е намерен',
      back: '← Обратно към продуктите',
      skuLabel: 'Арт. номер:',
      stockOut: 'Изчерпан',
      stockLow: (qty) => `Ограничена наличност — ${qty} бр.`,
      stockIn: (qty) => `Наличен — ${qty} бр.`,
      noImage: 'няма снимка',
      addToCart: 'Добави в количката',
      added: 'Добавено ✓',
      metaFallback: (name) => `${name} — КЗМ Магазин`,
    },
    cart: {
      metaTitle: 'Кошница',
      title: 'Кошница',
      empty: 'Количката е празна.',
      browse: 'Разгледай продуктите →',
      noImage: 'без снимка',
      perUnit: '/ бр.',
      removeLabel: 'Премахни от количката',
      total: 'Общо:',
      continueShopping: '← Продължи пазаруването',
      checkout: 'Към поръчка',
    },
    checkout: {
      metaTitle: 'Поръчка',
      title: 'Поръчка',
      successTitle: 'Поръчката е приета!',
      successBody: (phone) => `Ще се свържем с теб на ${phone} за потвърждение на доставката.`,
      orderNumber: (id) => `Поръчка № ${id}`,
      totalAmount: 'Обща сума:',
      backToProducts: 'Обратно към продуктите',
      emptyCart: 'Количката е празна.',
      browse: 'Разгледай продуктите →',
      fullName: 'Име и фамилия *',
      phone: 'Телефон *',
      email: 'Имейл (по желание)',
      deliveryMethod: 'Начин на доставка *',
      toAddress: 'До адрес',
      toOffice: 'До офис на куриер',
      courier: 'Куриер',
      city: 'Град *',
      address: 'Адрес *',
      office: 'Офис на куриера *',
      officePlaceholder: 'Напр. офис Габрово, ул. ...',
      notes: 'Бележка към поръчката (по желание)',
      payment: 'Плащане',
      cod: 'Наложен платеж (плащане при доставка)',
      sending: 'Изпращане…',
      submit: (total) => `Завърши поръчката — ${total}`,
      genericError: 'Нещо се обърка при изпращането на поръчката.',
      unexpectedError: 'Възникна неочаквана грешка. Опитай отново.',
      couriers: { 'Спиди': 'Спиди', 'Еконт': 'Еконт' },
    },
    about: {
      metaTitle: 'За нас',
      metaDescription: 'КЗМ ЕООД — специализирана компания за копитен здравен мениджмънт при преживни животни в България.',
    },
    contact: {
      metaTitle: 'Контакти',
      metaDescription: 'Контакти на КЗМ ЕООД — телефон, имейл и адрес.',
      title: 'Контакти',
      phone: 'Телефон',
      email: 'Имейл',
      address: 'Адрес',
      addressValue: 'Габрово, България',
      company: 'Фирма',
      more: 'За контактна форма и повече начини за връзка виж',
      mainSite: 'основния сайт kzm.bg',
    },
    comingSoon: {
      metaTitle: 'Очаквайте скоро',
      title: 'Очаквайте скоро',
      lead: 'Онлайн магазинът на КЗМ е в процес на подготовка. Ще отвори съвсем скоро.',
      back: '← Към kzm.bg',
      pinLabel: 'Код за достъп',
      submit: 'Вход',
      checking: 'Проверка…',
      wrongCode: 'Грешен код.',
      error: 'Възникна грешка. Опитай отново.',
    },
  },
  en: {
    header: {
      shopTag: 'Shop',
      products: 'Products',
      about: 'About',
      contact: 'Contact',
      mainSite: '← Main site',
      cartLabel: 'Cart',
    },
    footer: {
      brand: 'KZM Shop',
      mainSiteLink: 'kzm.bg',
      privacy: 'Privacy',
      cookies: 'Cookies',
      contact: 'Contact',
      copyright: (year) => `© ${year} KZM EOOD`,
      madeBy: 'Made by',
    },
    home: {
      tag: 'KZM Shop',
      title: 'Products for healthy hooves',
      lead: 'Tools, preventive and treatment supplies for bovine hoof health management — direct from KZM EOOD.',
      cta: 'Browse products',
    },
    catalog: {
      metaTitle: 'Products',
      tag: 'KZM Shop',
      title: 'Products',
      lead: 'Tools, preventive and treatment supplies for hoof health management.',
      all: 'All',
      emptyNone: 'No products yet — check back soon.',
      emptyCategory: 'No products in this category.',
      loadError: 'Something went wrong loading the products. Please try again later.',
      noImage: 'no image',
      outOfStock: 'Out of stock',
    },
    product: {
      notFoundTitle: 'Product not found',
      back: '← Back to products',
      skuLabel: 'SKU:',
      stockOut: 'Out of stock',
      stockLow: (qty) => `Limited stock — ${qty} pcs.`,
      stockIn: (qty) => `In stock — ${qty} pcs.`,
      noImage: 'no image',
      addToCart: 'Add to cart',
      added: 'Added ✓',
      metaFallback: (name) => `${name} — KZM Shop`,
    },
    cart: {
      metaTitle: 'Cart',
      title: 'Cart',
      empty: 'Your cart is empty.',
      browse: 'Browse products →',
      noImage: 'no image',
      perUnit: '/ pc.',
      removeLabel: 'Remove from cart',
      total: 'Total:',
      continueShopping: '← Continue shopping',
      checkout: 'Checkout',
    },
    checkout: {
      metaTitle: 'Checkout',
      title: 'Checkout',
      successTitle: 'Order received!',
      successBody: (phone) => `We'll contact you at ${phone} to confirm delivery.`,
      orderNumber: (id) => `Order #${id}`,
      totalAmount: 'Total amount:',
      backToProducts: 'Back to products',
      emptyCart: 'Your cart is empty.',
      browse: 'Browse products →',
      fullName: 'Full name *',
      phone: 'Phone *',
      email: 'Email (optional)',
      deliveryMethod: 'Delivery method *',
      toAddress: 'To address',
      toOffice: 'To courier office',
      courier: 'Courier',
      city: 'City *',
      address: 'Address *',
      office: 'Courier office *',
      officePlaceholder: 'E.g. Sofia office, Street ...',
      notes: 'Order note (optional)',
      payment: 'Payment',
      cod: 'Cash on delivery',
      sending: 'Sending…',
      submit: (total) => `Place order — ${total}`,
      genericError: 'Something went wrong while sending the order.',
      unexpectedError: 'An unexpected error occurred. Please try again.',
      couriers: { 'Спиди': 'Speedy', 'Еконт': 'Econt' },
    },
    about: {
      metaTitle: 'About us',
      metaDescription: 'KZM EOOD — a specialized hoof health management company for ruminants in Bulgaria.',
    },
    contact: {
      metaTitle: 'Contact',
      metaDescription: 'Contact details for KZM EOOD — phone, email and address.',
      title: 'Contact',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      addressValue: 'Gabrovo, Bulgaria',
      company: 'Company',
      more: 'For a contact form and more ways to reach us, see',
      mainSite: 'the main site kzm.bg',
    },
    comingSoon: {
      metaTitle: 'Coming soon',
      title: 'Coming soon',
      lead: 'The KZM online shop is being prepared. It will open very soon.',
      back: '← To kzm.bg',
      pinLabel: 'Access code',
      submit: 'Enter',
      checking: 'Checking…',
      wrongCode: 'Wrong code.',
      error: 'Something went wrong. Please try again.',
    },
  },
};

export function normalizeLang(value) {
  return value === 'en' ? 'en' : DEFAULT_LANG;
}

// t('en', 'checkout.fullName') → 'Full name *'
export function t(lang, path) {
  const safeLang = normalizeLang(lang);
  const parts = path.split('.');
  let node = dict[safeLang];
  for (const part of parts) {
    node = node?.[part];
  }
  if (node === undefined) {
    // fallback към bg, за да не се чупи UI-то ако липсва превод
    let fallback = dict.bg;
    for (const part of parts) fallback = fallback?.[part];
    return fallback ?? path;
  }
  return node;
}

// Избира EN варианта на поле от продукт, ако го има и е избран EN,
// иначе пада към българското (оригиналното) поле.
export function pickText(product, field, lang) {
  if (normalizeLang(lang) === 'en') {
    const enValue = product?.[`${field}_en`];
    if (enValue && String(enValue).trim()) return enValue;
  }
  return product?.[field];
}

export function formatPriceEur(cents, lang) {
  const locale = normalizeLang(lang) === 'en' ? 'en-GB' : 'bg-BG';
  return ((cents || 0) / 100).toLocaleString(locale, { style: 'currency', currency: 'EUR' });
}

// Превежда името на куриера за показване (Спиди→Speedy, Еконт→Econt),
// с fallback към оригиналната стойност ако не е в списъка.
export function courierLabel(courierName, lang) {
  const map = t(lang, 'checkout.couriers');
  return map?.[courierName] ?? courierName;
}

// Превежда категория на продукт (напр. "Инструменти" → "Tools"), ползвайки
// map-а от lib/categories.js (таблица category_translations в Supabase,
// управлявана от /admin/categories). Ако няма превод за тая категория
// (или сме на BG), пада към оригиналния текст от базата.
export function translateCategory(category, lang, categoryMap) {
  if (!category) return category;
  if (normalizeLang(lang) === 'en' && categoryMap && categoryMap[category]) {
    return categoryMap[category];
  }
  return category;
}
