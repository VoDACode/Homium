import i18n from 'i18next';
import LangBackend from 'i18next-http-backend';
import LangDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';
import Cookies from 'js-cookie';

i18n.use(LangBackend).use(LangDetector).use(initReactI18next).init({
    lng: Cookies.get('language') || 'en',
    debug: false,
    detection: {
        order: ['queryString', 'cookie'],
        cache: ['cookie']
    },
    interpolation: {
        escapeValue: false
    }
});

export default i18n;