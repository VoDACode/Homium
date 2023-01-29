import React from "react";
import cl from './.module.css';
import unknownPng from './img/unknown.png';

const TopMenu = () => {
    return (
        <div className={cl.main}>
            <span className={cl.logo}>Homium</span>
            <div className={cl.account}>
                <img className={cl.account_img} src={unknownPng}/>
            </div>
        </div>
    );
}

export default TopMenu;