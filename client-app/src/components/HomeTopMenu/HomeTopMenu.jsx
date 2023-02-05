import React from "react";
import cl from './.module.css';
import logOutPng from './img/log-out.png';
import settingsPng from './img/settings.png';
import adminPng from './img/admin.png';

const HomeTopMenu = ({logOutClick, settingsClick, adminClick}) => {
    return (
        <header className={cl.main}>
            <span className={cl.logo}>Homium</span>
            <img className={cl.log_out} src={logOutPng} onClick={() => logOutClick()} title="log out" alt="log out"/>
            <img className={cl.settings} src={settingsPng} onClick={() => settingsClick()} title="settings" alt="settings"/>
            <img className={cl.admin} src={adminPng} onClick={() => adminClick()} title="admin dashboard" alt="admin"/>
        </header>
    );
}

export default HomeTopMenu;