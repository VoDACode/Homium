import React from "react";
import cl from './.module.css';
import logOutPng from './img/log-out.png';
import settingsPng from './img/settings.png';
import adminPng from './img/admin.png';
import { useNavigate } from "react-router-dom";
import { ApiAuth } from "../../services/api/auth";

const HomeTopMenu = () => {
    const navigate = useNavigate();
    const authPageNavigate = () => {
        ApiAuth.signOut().then(res => {
            navigate('/auth');
        });
    }
    const adminPageNavigate = () => navigate('/admin');

    return (
        <header className={cl.main}>
            <span className={cl.logo}>Homium</span>
            <img className={cl.log_out} src={logOutPng} onClick={authPageNavigate} title="log out" alt="log out" />
            <img className={cl.settings} src={settingsPng} title="settings" alt="settings" />
            <img className={cl.admin} src={adminPng} onClick={adminPageNavigate} title="admin dashboard" alt="admin" />
        </header>
    );
}

export default HomeTopMenu;