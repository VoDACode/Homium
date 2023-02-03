import React from "react";
import cl from './.module.css';
import logOutPng from './img/log-out.png';

const AdminTopMenu = () => {
    return (
        <header className={cl.main}>
            <p className={cl.logo}>Homium</p>
            <div className={cl.page_list}>
                <span className={cl.var}>System info</span>
                <span className={cl.var}>Objects</span>
                <span className={cl.var}>Automation</span>
                <span className={cl.var}>Extensions</span>
                <span className={cl.var}>Users</span>
            </div>
            <img className={cl.log_out} src={logOutPng} title="log out" alt="log out"/>
        </header>
    );
}

export default AdminTopMenu;