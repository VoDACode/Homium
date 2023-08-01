import React, { useEffect, useState } from "react";
import cl from "./.module.css";
import { useNavigate } from "react-router-dom";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import CustomCheckbox from "../../components/CustomCheckbox/CustomCheckbox";
import ModalWindow from "../../components/ModalWindow/ModalWindow";
import SaveOrCancelForm from "../../components/SaveOrCancelForm/SaveOrCancelForm";
import SettingsTopMenu from "../../components/SettingsTopMenu/SettingsTopMenu";
import Space from "../../components/Space/Space";
import Switch from "../../components/Switch/Switch";
import { ApiAuth } from "../../services/api/auth";
import { CookieManager } from "../../services/CookieManager";

const SettingsPage = () => {

    const [isModWinVisible, setModWinVisibility] = useState(false);
    const [settings, setSettings] = useState({
        nightModeOn: CookieManager.get('night_mode') === '1' ? true : false,
        lang: i18n.language,
        askForExecScript: CookieManager.get('ask_for_exec_script') === '1' ? true : false
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
                <div className={cl.log_out_panel}>
                    <p className={cl.log_out_panel_header}>Do you want to log out?</p>
                    <Space height="40px" />
                    <div className={cl.log_out_panel_buttons}>
                        <button className={cl.log_out_panel_exec_button} onClick={() => authPageNavigate()}>Log out</button>
                        <button className={cl.log_out_panel_cancel_button} onClick={() => setModWinVisibility(false)}>Cancel</button>
                    </div>
                </div>
            </ModalWindow>
            <SettingsTopMenu onHomeClick={homePageNavigate} onAdminClick={adminPageNavigate} onLogOutClick={() => setModWinVisibility(true)} />
            <CustomHeader text="Settings" textSize="50px" textColor="#0036a3" isCenter={true} />
            <Space height="10px" />
            <Switch text="Night mode on:" textSize="30px" space="10px" />
            <Space height="30px" />
            <CustomSelect space="5px" headerText="Language:" headerSize="30px" optionSize="20px" paddingRight="3.5em" optionWeight="600" options={[
                { name: 'English', val: 'en' },
                { name: 'Українська', val: 'uk' },
                { name: 'Русский', val: 'ru' }
            ]} type="classic" chosenValue={settings.lang} onChange={(e) => ChangeAppLanguage(e.target.value)} />
            <Space height="40px" />
            <hr />
            <Space height="20px" />
            <CustomCheckbox
                name="askForExecScript"
                text="Ask before executing a script"
                textSize="24px"
                scale="1.4"
                space="20px"
                checked={settings.askForExecScript}
                onChange={ChangeSettingsParameter} />
            <Space height="20px" />
            <hr />
            <Space height="10px" />
            <SaveOrCancelForm includeCancelButton={false} onSave={SaveChanges} flexEndOn={false} />
        </div>
    );
}

export default SettingsPage;