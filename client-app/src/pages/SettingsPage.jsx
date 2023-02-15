import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import CustomSelect from "../components/CustomSelect/CustomSelect";
import LogOutPanel from "../components/LogOutPanel/LogOutPanel";
import ModalWindow from "../components/ModalWindow/ModalWindow";
import SettingsTopMenu from "../components/SettingsTopMenu/SettingsTopMenu";
import Space from "../components/Space/Space";
import Switch from "../components/Switch/Switch";
import { ApiAuth } from "../services/api/auth";
import { CookieManager } from "../services/CookieManager";

const SettingsPage = () => {

    const [isModWinVisible, setModWinVisibility] = useState(false);

    const navigate = useNavigate();
    const homePageNavigate = () => {
        navigate('/');
    }
    const adminPageNavigate = () => {
        navigate('/admin');
    }
    const authPageNavigate = () => {
        ApiAuth.signOut().then(res => {
            navigate('/auth');
        });
    }

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
            <ModalWindow visible={isModWinVisible}>
                <LogOutPanel onLogOutClick={authPageNavigate} onCancelClick={() => setModWinVisibility(false)}/>
            </ModalWindow>
            <SettingsTopMenu onHomeClick={homePageNavigate} onAdminClick={adminPageNavigate} onLogOutClick={() => setModWinVisibility(true)}/>
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