import React from "react";
import cl from './.module.css';
import logOutPng from './img/log-out.png';
import settingsPng from './img/settings.png';
import adminPng from './img/admin.png';

const HomeTopMenu = ({onLogOutClick, onSettingsClick, onAdminClick}) => {
    return (
        <header className={cl.main}>
            <span className={cl.logo}>Homium</span>
            <img className={`${cl.img_button} ${cl.log_out}`} src={logOutPng} onClick={() => onLogOutClick()} title="log out" alt="log out"/>
            <img className={`${cl.img_button} ${cl.settings}`} src={settingsPng} onClick={() => onSettingsClick()} title="settings" alt="settings"/>
            <img className={`${cl.img_button} ${cl.admin}`} src={adminPng} onClick={() => onAdminClick()} title="admin dashboard" alt="admin"/>
        </header>
    );
}

export default HomeTopMenu;