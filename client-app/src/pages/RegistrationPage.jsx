import React from "react";
import { useTranslation } from "react-i18next";

const RegistrationPage = () => {
    const {t: word, i18n} = useTranslation();

    function ChangeAppLanguage(lang) {
        i18n.changeLanguage(lang);
    }

    return (
        <div>
            
        </div>
    );
}

export default RegistrationPage;