import React from "react";
import { useTranslation } from "react-i18next";

const AuthorizationPage = () => {
    const {t: word, i18n} = useTranslation();

    function ChangeAppLanguage(lang) {
        i18n.changeLanguage(lang);
    }

    return (
        <div>
            <h1>{word('auth')}</h1>
            <button onClick={() => ChangeAppLanguage('en')}>EN</button>
            <button onClick={() => ChangeAppLanguage('uk')}>UK</button>
        </div>
    );
}

export default AuthorizationPage;