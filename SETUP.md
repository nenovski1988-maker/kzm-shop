# KZM Shop — setup бележки

Scaffold на новия магазин (Next.js App Router, JS, без TypeScript), структура
по образец на ArtIV, с брандинг на КЗМ.

## Какво е готово в тази стъпка (Задача 1)

- Next.js проект, App Router, без Tailwind (plain CSS + CSS Modules)
- Брандинг: зелена/синя палитра и Cormorant Garamond + Verdana, взети от kzm.bg
- Header/Footer, линк обратно към kzm.bg
- Скелет на админ панела (`/admin`) с HTTP Basic Auth (proxy.js) и навигация
  Продукти / Поръчки / Наличности / Активност — всеки раздел засега е placeholder
- `app/lib/supabaseClient.js` и `supabaseServer.js` — готови за връзка, но схема
  в Supabase още няма (Задача 2)
- `app/lib/cloudinary-client.js` — директно browser→Cloudinary качване (unsigned
  preset), по модела на ArtIV
- Основни публични страници: `/`, `/catalog`, `/cart`, `/contact`, `/za-nas` —
  placeholder съдържание, ще се попълват в следващите задачи

## Какво трябва ти да направиш, за да тръгне локално

1. `npm install` (ако пренесеш проекта на нова машина)
2. Копирай `.env.local.example` → `.env.local` и попълни стойностите (виж файла)
3. `npm run dev` → http://localhost:3000

## Push към GitHub (ти, с твоите креденшъли)

```powershell
cd kzm-shop
git add -A
git commit -m "Initial scaffold"
git remote add origin https://github.com/nenovski1988-maker/kzm-shop.git
git push -u origin main
```

(Ако repo-то още не съществува в GitHub — създай го празно, без README, преди push-а.)

## Предстои (по план)

2. Supabase схема (продукти/поръчки/наличности)
3. Админ: Продукти CRUD + Cloudinary
4. Витрина/каталог + продуктова страница
5. Кошница + checkout + поръчки
6. Админ: Поръчки + Наличности
7. Пренасяне на GA/Search Console линкове, changelog и форма към екипа от стария admin.html
8. Деплой: Vercel + Supabase + домейн (shop.kzm.bg)
9. SEO основи (robots/sitemap/OG/JSON-LD)
