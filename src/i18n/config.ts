import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { ar, en, ur } from './locales';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: ar,
      en: en,
      ur: ur
    },
    fallbackLng: 'ar',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

// Set initial direction based on detected language
const dir = i18n.language === 'en' ? 'ltr' : 'rtl';
document.documentElement.dir = dir;
document.documentElement.lang = i18n.language;

// Update direction when language changes
i18n.on('languageChanged', (lng) => {
  const dir = lng === 'en' ? 'ltr' : 'rtl';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
});

export default i18n;