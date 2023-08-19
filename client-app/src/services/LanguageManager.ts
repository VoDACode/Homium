import { CookieManager } from "./CookieManager";

export class LanguageManager {
    static defaultLang: string = 'en';
    static data: any = null;

    static get(key: string): string {
        if (CookieManager.get('language') === null) {
            CookieManager.set('language', this.defaultLang);
        }

        if (this.data === null) {
            this.data = require(`../storage/strings/${CookieManager.get('language')}.json`)
        }

        var value: any = this.data;

        key.split('.').forEach(keyPer => {
            if (value[keyPer]) {
                value = value[keyPer];
            } else {
                return key;
            }
        });

        return typeof value === 'string' ? value : key;
    }

    static setLang(lang: string): boolean {
        try {
            this.data = require(`../storage/strings/${lang}.json`);
        } catch (err) {
            return false;
        }

        CookieManager.set('language', lang);
        return true;
    }

    static currentLang(): string | null {
        return CookieManager.get('language');
    }
}