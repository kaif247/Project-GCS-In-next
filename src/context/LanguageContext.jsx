import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { languages, translations } from '../i18n/translations';

export const LanguageContext = createContext();

const STORAGE_KEY = 'gcs-language';

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored) return stored;
  return 'en';
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    setLanguage(getInitialLanguage());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.setAttribute('lang', language);
    document.documentElement.classList.add('lang-switching');
    const timer = window.setTimeout(() => {
      document.documentElement.classList.remove('lang-switching');
    }, 180);
    return () => window.clearTimeout(timer);
  }, [language]);

  const t = useCallback(
    (key, vars) => {
      if (key === null || key === undefined) return '';
      const dict = translations[language] || {};
      let text = dict[key] || key;
      if (vars && typeof text === 'string') {
        text = text.replace(/\{(\w+)\}/g, (_, token) => (vars[token] ?? `{${token}}`));
      }
      return text;
    },
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      languages,
    }),
    [language, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
