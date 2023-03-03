export class CookieManager {
    static setCookie(name, value, daysUntilExpiring = undefined, path = '/') {
        var expires, storePath;

        if (daysUntilExpiring) {
            const date = new Date();
            date.setTime(date.getTime() + daysUntilExpiring * 24 * 60 * 60 * 1000);
            expires = "; expires=" + date.toUTCString();
        }
        else {
            expires = "";
        }

        storePath = path ? "; path=" + path : "";

        document.cookie = `${name}=${value}${expires}${storePath}`;
    }

    static getCookie(name) {
        var cookieList = document.cookie;
        var splittedList = cookieList.split(name);
        var res = "";

        if (splittedList.length > 1) {
            var idx = splittedList[1].indexOf(' ');
            res = splittedList[1].slice(1, idx === -1 ? undefined : idx - 1);
        }
        else {
            return null;
        }

        return res;
    }

    static deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}