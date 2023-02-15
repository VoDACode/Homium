import React from "react";
import cl from './.module.css';
import homePng from './img/home.png';
import adminPng from './img/admin.png';
import logOutPng from './img/log-out.png';

const SettingsTopMenu = ({onLogOutClick, onAdminClick, onHomeClick}) => {
    return (
        <div className={cl.main}>
            <img className={cl.home} src={homePng} title="home" alt="home" onClick={() => {if (onHomeClick) {onHomeClick()}}}/>
            <img className={cl.admin} src={adminPng} title="admin" alt="admin" onClick={() => {if (onAdminClick) {onAdminClick()}}}/>
            <img className={cl.log_out} src={logOutPng} title="log out" alt="log out" onClick={() => {if (onLogOutClick) {onLogOutClick()}}}/>
        </div>
    );
}

export default SettingsTopMenu;