import { CookieManager } from "./CookieManager";

export class LanguageManager {
    static defaultLang = 'en';
    static data = null;

    static get(key) {
        if (CookieManager.get('language') === null) {
            CookieManager.set('language', this.defaultLang);
        }

        if (this.data === null) {
            this.data = require(`../storage/strings/${CookieManager.get('language')}.json`)
        }

        var value = this.data;

        key.split('.').forEach(keyPer => {
            if (value[keyPer]) {
                value = value[keyPer];
            } else {
                return key;
            }
        });

        return typeof value === 'string' ? value : key;
    }

    static setLang(lang) {
        try {
            this.data = require(`../storage/strings/${lang}.json`);
        } catch (err) {
            return false;
        }

        CookieManager.set('language', lang);
        return true;
    }

    static currentLang() {
        return CookieManager.get('language');
    }
}