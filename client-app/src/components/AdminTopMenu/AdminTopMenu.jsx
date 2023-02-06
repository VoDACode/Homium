import React from "react";
import { useNavigate } from "react-router-dom";
import cl from './.module.css';
import logOutPng from './img/log-out.png';

const AdminTopMenu = () => {
    const navigate = useNavigate();
    const homePageNavigate = () => navigate('/');
    const authPageNavigate = () => navigate('/auth');

    return (
        <header className={cl.main}>
            <p className={cl.logo} onClick={homePageNavigate}>Homium</p>
            <div className={cl.page_list}>
                <span className={cl.var}>System info</span>
                <span className={cl.var}>Objects</span>
                <span className={cl.var}>Automation</span>
                <span className={cl.var}>Extensions</span>
                <span className={cl.var}>Users</span>
            </div>
            <img className={cl.log_out} src={logOutPng} onClick={authPageNavigate} title="log out" alt="log out"/>
        </header>
    );
}

export default AdminTopMenu;