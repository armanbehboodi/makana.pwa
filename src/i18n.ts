import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translation.json';
import translationFA from './locales/fa/translation.json';

const resources = {
    en: {
        translation: translationEN,
    },
    fa: {
        translation: translationFA,
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'fa', // default language
        fallbackLng: 'fa', // fallback language
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
        react: {
            useSuspense: false, // disables Suspense for React
        },
    });

export default i18n;