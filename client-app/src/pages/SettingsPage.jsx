import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import CustomSelect from "../components/CustomSelect/CustomSelect";
import Space from "../components/Space/Space";
import Switch from "../components/Switch/Switch";
import { CookieManager } from "../services/CookieManager";

const SettingsPage = () => {

    const { t: locale, i18n } = useTranslation();

    function ChangeAppLanguage(lang) {
        i18n.changeLanguage(lang);
        CookieManager.setCookie('language', lang, '/');
    }

    useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';
    }, []);

    return (
        <div>
            <CustomHeader text="Settings" textSize="50px" isCenter={true} />
            <Space size="10px" />
            <CustomHeader text="Night mode:" textSize="30px" />
            <Space size="10px" />
            <Switch />
            <Space size="30px" />
            <CustomHeader text="Language:" textSize="30px" />
            <CustomSelect options={[
                { name: 'English', val: 'en' },
                { name: 'Українська', val: 'uk' },
                { name: 'Русский', val: 'ru' }
            ]} chosenValue={CookieManager.getCookie('language')} onValueChanged={ChangeAppLanguage} />
        </div>
    );
}

export default SettingsPage;