export class CookieManager {
    static get(key) {
        const cookies = document.cookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();

            if (cookie.indexOf(key + '=') === 0) {
                return cookie.substring(key.length + 1);
            }
        }

        return null;
    }

    static set(key, value, path = '/') {
        document.cookie = `${key}=${value}; path=${path};`;
    }

    static remove(key) {
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}