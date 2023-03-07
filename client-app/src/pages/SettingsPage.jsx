import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import CustomSelect from "../components/CustomSelect/CustomSelect";
import CustomCheckbox from "../components/CustomCheckbox/CustomCheckbox";
import LogOutPanel from "../components/LogOutPanel/LogOutPanel";
import ModalWindow from "../components/ModalWindow/ModalWindow";
import SaveOrCancelForm from "../components/SaveOrCancelForm/SaveOrCancelForm";
import SettingsTopMenu from "../components/SettingsTopMenu/SettingsTopMenu";
import Space from "../components/Space/Space";
import Switch from "../components/Switch/Switch";
import { ApiAuth } from "../services/api/auth";
import Cookies from 'js-cookie';

const SettingsPage = () => {

    const { t: locale, i18n } = useTranslation();

    const [isModWinVisible, setModWinVisibility] = useState(false);
    const [settings, setSettings] = useState({
        nightModeOn: Cookies.get('night_mode') === '1' ? true : false,
        lang: i18n.language,
        askForExecScript: Cookies.get('ask_for_exec_script') === '1' ? true : false
    });

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

    function ChangeAppLanguage(lang) {
        i18n.changeLanguage(lang);
        ChangeSettingsParameter('lang', lang);
    }

    function ChangeSettingsParameter(name, value) {
        setSettings(prevState => {
            var newState = { ...prevState };
            newState[name] = value;
            return newState;
        });
    }

    function SaveChanges() {
        console.log(settings);
        Cookies.set('language', settings.lang, { path: '/' });
        Cookies.set('night_mode', settings.nightModeOn ? '1' : '0', { path: '/' });
        Cookies.set('ask_for_exec_script', settings.askForExecScript ? '1' : '0', { path: '/' });
    }

    useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';
    }, []);

    return (
        <div>
            <ModalWindow visible={isModWinVisible}>
                <LogOutPanel onLogOutClick={authPageNavigate} onCancelClick={() => setModWinVisibility(false)} />
            </ModalWindow>
            <SettingsTopMenu onHomeClick={homePageNavigate} onAdminClick={adminPageNavigate} onLogOutClick={() => setModWinVisibility(true)} />
            <CustomHeader text="Settings" textSize="50px" textColor="#0036a3" isCenter={true} />
            <Space size="10px" />
            <Switch text="Night mode on:" textSize="30px" space="10px" />
            <Space size="30px" />
            <CustomSelect space="5px" headerText="Language:" headerSize="30px" optionSize="20px" paddingRight="3.5em" optionWeight="600" options={[
                { name: 'English', val: 'en' },
                { name: 'Українська', val: 'uk' },
                { name: 'Русский', val: 'ru' }
            ]} type="classic" chosenValue={settings.lang} onChange={(e) => ChangeAppLanguage(e.target.value)} />
            <Space size="40px" />
            <hr />
            <Space size="20px" />
            <CustomCheckbox
                name="askForExecScript"
                text="Ask before executing a script"
                textSize="24px"
                scale="1.4"
                space="20px"
                checked={settings.askForExecScript}
                onChange={ChangeSettingsParameter} />
            <Space size="20px" />
            <hr />
            <Space size="10px" />
            <SaveOrCancelForm includeCancelButton={false} onSave={SaveChanges} flexEndOn={false} />
        </div>
    );
}

export default SettingsPage;