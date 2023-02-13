import React from "react";
import VertSpace from "../VertSpace/VertSpace";
import cl from './.module.css';

const LogOutPanel = ({onLogOutClick, onCancelClick}) => {
    return (
        <div className={cl.main}>
            <center>
                <p className={cl.header}>Do you want to log out?</p>
                <VertSpace height="40px"/>
                <div className={cl.buttons}>
                    <button className={cl.log_out} onClick={() => onLogOutClick()}>Log out</button>
                    <button className={cl.cancel} onClick={() => onCancelClick()}>Cancel</button>
                </div>
            </center>
        </div>
    );
}

export default LogOutPanel;