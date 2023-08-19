import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ApiAuth } from "../../services/api/auth";
import cl from './.module.css';
import Space from "../Space/Space";
import ModalWindow from "../ModalWindow/ModalWindow";
import logOutPng from './img/log-out.png';

const AdminLayout = () => {
    const [chosenMenu, openMenu] = React.useState<string | undefined>(undefined);
    const [isModWinVisible, setModWinVisibility] = React.useState(false);

    const navigate = useNavigate();
    const authPageNavigate = () => {
        ApiAuth.signOut().then(() => {
            navigate('/auth');
        });
    }

    function MoveTo(path: string) {
        openMenu(undefined);
        navigate(path);
    }
    
    function WindowClickEvent(event: any) {
        var elements = document.getElementsByClassName(cl.var)

        if (chosenMenu !== undefined) {
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].contains(event.target)) {
                    return;
                }
            }

            openMenu(undefined);
        }
    }

    React.useEffect(() => {
        window.addEventListener("click", WindowClickEvent);

        return () => {
            window.removeEventListener("click", WindowClickEvent);
        };
    });

    return (
        <>
            <header className={cl.main}>
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
                <p className={cl.logo} onClick={() => MoveTo('/')}>Homium</p>
                <div className={cl.page_list}>
                    <div className={cl.menu_container}>
                        <span className={cl.var} onClick={() => openMenu(chosenMenu !== 'sys-info' ? 'sys-info' : undefined)}>System info</span>
                        <div className={cl.items} style={{ display: chosenMenu === 'sys-info' ? 'block' : 'none' }}>
                            <p className={cl.comp} onClick={() => MoveTo('/admin')}>Info</p>
                        </div>
                    </div>
                    <div className={cl.menu_container}>
                        <span className={cl.var} onClick={() => openMenu(chosenMenu !== 'obj' ? 'obj' : undefined)}>Objects</span>
                        <div className={cl.items} style={{ display: chosenMenu === 'obj' ? 'block' : 'none' }}>
                            <p className={cl.comp} onClick={() => MoveTo('/admin/objects')}>List</p>
                            <p className={cl.comp}>Devices</p>
                            <p className={cl.comp}>Rooms</p>
                        </div>
                    </div>
                    <div className={cl.menu_container}>
                        <span className={cl.var} onClick={() => openMenu(chosenMenu !== 'auto' ? 'auto' : undefined)}>Automation</span>
                        <div className={cl.items} style={{ display: chosenMenu === 'auto' ? 'block' : 'none' }}>
                            <p className={cl.comp}>Schedules</p>
                            <p className={cl.comp} onClick={() => MoveTo('/admin/scripts')}>Scripts</p>
                            <p className={cl.comp}>Triggers</p>
                        </div>
                    </div>
                    <div className={cl.menu_container}>
                        <span className={cl.var} onClick={() => openMenu(chosenMenu !== 'ext' ? 'ext' : undefined)}>Extensions</span>
                        <div className={cl.items} style={{ display: chosenMenu === 'ext' ? 'block' : 'none' }}>
                            <p className={cl.comp}>Repositories</p>
                            <p className={cl.comp}>Installed</p>
                        </div>
                    </div>
                    <div className={cl.menu_container}>
                        <span className={cl.var} onClick={() => openMenu(chosenMenu !== 'users' ? 'users' : undefined)}>Users</span>
                        <div className={cl.items} style={{ display: chosenMenu === 'users' ? 'block' : 'none' }}>
                            <p className={cl.comp} onClick={() => MoveTo('/admin/users')}>List</p>
                        </div>
                    </div>
                </div>
                <img className={cl.log_out} src={logOutPng} onClick={() => setModWinVisibility(true)} title="log out" alt="log out" />
            </header>
            <Outlet />
        </>
    );
}

export default AdminLayout;