import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiAuth } from "../../services/api/auth";
import LogOutPanel from "../LogOutPanel/LogOutPanel";
import ModalWindow from "../ModalWindow/ModalWindow";
import cl from './.module.css';
import logOutPng from './img/log-out.png';
import settingsPng from './img/settings.png';

const AdminTopMenu = () => {
    const [chosenMenu, openMenu] = useState(null);
    const [isModWinVisible, setModWinVisibility] = useState(false);

    const navigate = useNavigate();
    const settingsPageNavigate = () => {
        navigate('/settings');
    }
    const authPageNavigate = () => {
        ApiAuth.signOut().then(res => {
            navigate('/auth');
        });
    }

    function MoveTo(path) {
        openMenu(null);
        navigate(path);
    }

    return (
        <header className={cl.main}>
            <ModalWindow visible={isModWinVisible}>
                <LogOutPanel onLogOutClick={authPageNavigate} onCancelClick={() => setModWinVisibility(false)}/>
            </ModalWindow>
            <p className={cl.logo} onClick={() => MoveTo('/')}>Homium</p>
            <div className={cl.page_list}>
                <div className={cl.menu_container}>
                    <span className={cl.var} onClick={() => openMenu(chosenMenu !== 'sys-info' ? 'sys-info' : null)}>System info</span>
                    <div className={cl.items} style={{display: chosenMenu === 'sys-info' ? 'block' : 'none'}}>
                        <p className={cl.comp} onClick={() => MoveTo('/admin')}>Info</p>
                    </div>
                </div>
                <div className={cl.menu_container}>
                    <span className={cl.var} onClick={() => openMenu(chosenMenu !== 'obj' ? 'obj' : null)}>Objects</span>
                    <div className={cl.items} style={{display: chosenMenu === 'obj' ? 'block' : 'none'}}>
                        <p className={cl.comp} onClick={() => MoveTo('/admin/objects')}>List</p>
                        <p className={cl.comp}>Devices</p>
                        <p className={cl.comp}>Rooms</p>
                    </div>
                </div>
                <div className={cl.menu_container}>
                    <span className={cl.var} onClick={() => openMenu(chosenMenu !== 'auto' ? 'auto' : null)}>Automation</span>
                    <div className={cl.items} style={{display: chosenMenu === 'auto' ? 'block' : 'none'}}>
                        <p className={cl.comp}>Schedules</p>
                        <p className={cl.comp}>Scripts</p>
                        <p className={cl.comp}>Triggers</p>
                    </div>
                </div>
                <div className={cl.menu_container}>
                    <span className={cl.var} onClick={() => openMenu(chosenMenu !== 'ext' ? 'ext' : null)}>Extensions</span>
                    <div className={cl.items} style={{display: chosenMenu === 'ext' ? 'block' : 'none'}}>
                        <p className={cl.comp}>Repositories</p>
                        <p className={cl.comp}>Installed</p>
                    </div>
                </div>
                <div className={cl.menu_container}>
                    <span className={cl.var} onClick={() => openMenu(chosenMenu !== 'users' ? 'users' : null)}>Users</span>
                    <div className={cl.items} style={{display: chosenMenu === 'users' ? 'block' : 'none'}}>
                        <p className={cl.comp} onClick={() => MoveTo('/admin/users')}>List</p>
                    </div>
                </div>
            </div>
            <img className={cl.settings} src={settingsPng} onClick={() => settingsPageNavigate()} title="settings" alt="settings"/>
            <img className={cl.log_out} src={logOutPng} onClick={() => setModWinVisibility(true)} title="log out" alt="log out"/>
        </header>
    );
}

export default AdminTopMenu;