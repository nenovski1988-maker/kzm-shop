'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { normalizeLang, t as translate, LANG_COOKIE } from './i18n';

const LanguageContext = createContext(null);

// initialLang идва от сървъра (root layout, прочетено през lib/lang.js),
// за да съвпада с това, което сървърните компоненти вече са рендерили —
// без това при презареждане на страницата клиентът за момент би показал
// грешен език, преди да прочете cookie-то сам.
export function LanguageProvider({ initialLang, children }) {
  const [lang, setLangState] = useState(normalizeLang(initialLang));
  const router = useRouter();

  const setLang = useCallback(
    (next) => {
      const safe = normalizeLang(next);
      if (safe === lang) return;
      document.cookie = `${LANG_COOKIE}=${safe}; path=/; max-age=31536000`;
      setLangState(safe);
      // Презарежда сървърните компоненти (продукти, metadata, Footer и
      // т.н.) с новия език — адресът в браузъра не се променя.
      router.refresh();
    },
    [lang, router]
  );

  const t = useCallback((path) => translate(lang, path), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage трябва да се ползва вътре в <LanguageProvider>.');
  return ctx;
}
