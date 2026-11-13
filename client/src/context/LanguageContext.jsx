import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../utils/translations';
import { useAuth } from './AuthContext';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const { profile } = useAuth();
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('agroai_language') || 'en';
  });

  // Sync language with profile preferred language when loaded
  useEffect(() => {
    if (profile?.preferred_language && profile.preferred_language !== language) {
      setLanguageState(profile.preferred_language);
      localStorage.setItem('agroai_language', profile.preferred_language);
    }
  }, [profile?.preferred_language]);

  const setLanguage = (langCode) => {
    setLanguageState(langCode);
    localStorage.setItem('agroai_language', langCode);
  };

  /**
   * Helper to fetch translated text by dot path: e.g. t('nav.dashboard')
   */
  const t = (path) => {
    const keys = path.split('.');
    let current = TRANSLATIONS[language] || TRANSLATIONS.en;

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English
        let fallback = TRANSLATIONS.en;
        for (const fKey of keys) {
          if (fallback && fallback[fKey] !== undefined) {
            fallback = fallback[fKey];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

