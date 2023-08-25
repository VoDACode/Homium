import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ApiExtensions } from "../../services/api/extensions";
import { ApiAuth } from "../../services/api/auth";
import cl from './.module.css';
import Space from "../Space/Space";
import ModalWindow from "../ModalWindow/ModalWindow";

type ShortExtensionInfo = {
    id: string,
    name: string,
    url: string
}

const AdminLayout = () => {

    const [chosenMenu, openMenu] = React.useState<string | undefined>(undefined);
    const [isInstalledExtMenuOpened, installedExtMenuState] = React.useState<boolean>(false);
    const [isNavMenuOpened, setNavMenuState] = React.useState<boolean>(false);
    const [isModWinVisible, setModWinVisibility] = React.useState<boolean>(false);
    const [extensionList, setExtensionList] = React.useState<Array<ShortExtensionInfo>>([]);

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

    function GetTitle() {
        var path = window.location.pathname;

        if (path === "/admin") {
            return "System information";
        }

        if (path === "/admin/objects") {
            return "Objects";
        }
        if (path.includes("/admin/objects/")) {
            if (path.includes("/add")) {
                return "Objects - new object";
            }
            else {
                return "Objects - editing object";
            }
        }

        if (path === "/admin/scripts") {
            return "Scripts";
        }
        if (path.includes("/admin/scripts/")) {
            if (path.includes("/add")) {
                return "Scripts - new script";
            }
            else {
                return "Scripts - editing script";
            }
        }

        if (path === "/admin/users") {
            return "Users";
        }
        if (path.includes("/admin/users/")) {
            if (path.includes("/add")) {
                return "Users - new user";
            }
            else {
                return "Users - editing user";
            }
        }

        return "UNDEFINED LOCATION";
    }

    function RenderInstalledExtensions() {
        var result: Array<React.ReactNode> = [];

        extensionList.map((el) => {
            result.push(
                <div className={cl.comp} key={el.id}>
                    <p onClick={() => { if (el.url) { window.location.href = el.url } }}>{el.name}</p>
                </div>
            );
        });

        return result;
    }

    React.useEffect(() => {
        ApiExtensions.getExtensions().then((res) => {
            setExtensionList([...res]);
        });
    });

    return (
        <div className={cl.admin_space}>
            <div className={cl.nav_space}>
                <nav className={`${cl.navigation} ${isNavMenuOpened ? cl.navigation_opened : ''}`}>
                    <div className={cl.top_nav_panel}>
                        <img className={`${cl.menu_img} ${isNavMenuOpened ? cl.menu_img_rotated : ''}`} onClick={() => {
                            setNavMenuState(!isNavMenuOpened);
                        }} title="Menu" alt="menu" />
                        <h1 className={`${cl.app_name} ${isNavMenuOpened ? cl.app_name_visible : ''}`}>Homium</h1>
                    </div>
                    <div className={cl.page_collection}>
                        <div className={cl.theme_separate_line_cont + " " + cl.system_separate_line_cont}>
                            <div className={cl.theme_separate_line + " " + cl.system_separate_line}></div>
                            <span className={cl.sep_theme_text + " " + cl.system_sep_theme_line}>System</span>
                        </div>
                        <div className={cl.pages + " " + cl.system_pages}>
                            <div className={cl.page + " " + cl.sys_info_page} onClick={() => MoveTo('/admin')} title="System info">
                                <img className={cl.page_img + " " + cl.sys_info_img} alt="system info" />
                                <span className={`${cl.page_name} ${cl.sys_info_name} ${isNavMenuOpened ? cl.page_name_visible : ''}`}>System info</span>
                            </div>
                        </div>
                        <div className={cl.theme_separate_line_cont + " " + cl.object_separate_line_cont}>
                            <div className={cl.theme_separate_line + " " + cl.object_separate_line}></div>
                            <span className={cl.sep_theme_text + " " + cl.object_sep_theme_line}>Object</span>
                        </div>
                        <div className={cl.pages + " " + cl.object_pages}>
                            <div className={cl.page + " " + cl.objects_page} onClick={() => MoveTo('/admin/objects')} title="Objects">
                                <img className={cl.page_img + " " + cl.objects_img} alt="objects" />
                                <span className={`${cl.page_name} ${cl.objects_name} ${isNavMenuOpened ? cl.page_name_visible : ''}`}>Objects</span>
                            </div>
                            <div className={cl.page + " " + cl.devices_page} title="Devices">
                                <img className={cl.page_img + " " + cl.devices_img} alt="devices" />
                                <span className={`${cl.page_name} ${cl.devices_name} ${isNavMenuOpened ? cl.page_name_visible : ''}`}>Devices</span>
                            </div>
                            <div className={cl.page + " " + cl.rooms_page} title="Rooms">
                                <img className={cl.page_img + " " + cl.rooms_img} alt="rooms" />
                                <span className={`${cl.page_name} ${cl.rooms_name} ${isNavMenuOpened ? cl.page_name_visible : ''}`}>Rooms</span>
                            </div>
                        </div>
                        <div className={cl.theme_separate_line_cont + " " + cl.automation_separate_line_cont}>
                            <div className={cl.theme_separate_line + " " + cl.automation_separate_line}></div>
                            <span className={cl.sep_theme_text + " " + cl.automation_sep_theme_line}>Automation</span>
                        </div>
                        <div className={cl.pages + " " + cl.automation_pages}>
                            <div className={cl.page + " " + cl.schedules_page} title="Schedules">
                                <img className={cl.page_img + " " + cl.schedules_img} alt="schedules" />
                                <span className={`${cl.page_name} ${cl.schedules_name} ${isNavMenuOpened ? cl.page_name_visible : ''}`}>Schedules</span>
                            </div>
                            <div className={cl.page + " " + cl.scripts_page} onClick={() => MoveTo('/admin/scripts')} title="Scripts">
                                <img className={cl.page_img + " " + cl.scripts_img} alt="scripts" />
                                <span className={`${cl.page_name} ${cl.scripts_name} ${isNavMenuOpened ? cl.page_name_visible : ''}`}>Scripts</span>
                            </div>
                            <div className={cl.page + " " + cl.triggers_page} title="Triggers">
                                <img className={cl.page_img + " " + cl.triggers_img} alt="triggers" />
                                <span className={`${cl.page_name} ${cl.triggers_name} ${isNavMenuOpened ? cl.page_name_visible : ''}`}>Triggers</span>
                            </div>
                        </div>
                        <div className={cl.theme_separate_line_cont + " " + cl.extension_separate_line_cont}>
                            <div className={cl.theme_separate_line + " " + cl.extension_separate_line}></div>
                            <span className={cl.sep_theme_text + " " + cl.extension_sep_theme_line}>Extensions</span>
                        </div>
                        <div className={cl.pages + " " + cl.extension_pages}>
                            <div className={cl.page + " " + cl.extensions_page} title="Extensions">
                                <img className={cl.page_img + " " + cl.extensions_img} alt="extensions" />
                                <span className={`${cl.page_name} ${cl.extensions_name} ${isNavMenuOpened ? cl.page_name_visible : ''}`}>Extensions</span>
                            </div>
                        </div>
                        <div className={cl.theme_separate_line_cont + " " + cl.users_separate_line_cont}>
                            <div className={cl.theme_separate_line + " " + cl.users_separate_line}></div>
                            <span className={cl.sep_theme_text + " " + cl.users_sep_theme_line}>Users</span>
                        </div>
                        <div className={cl.pages + " " + cl.user_pages}>
                            <div className={cl.page + " " + cl.users_page} onClick={() => MoveTo('/admin/users')} title="Users">
                                <img className={cl.page_img + " " + cl.users_img} alt="users" />
                                <span className={`${cl.page_name} ${cl.users_name} ${isNavMenuOpened ? cl.page_name_visible : ''}`}>Users</span>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
            <div className={cl.content}>
                <header className={cl.top_menu}>
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
                    <h1 className={cl.page_header}>{GetTitle()}</h1>
                    <img className={cl.go_to_home_page_button} onClick={() => navigate("/")} />
                    <img className={cl.log_out_button} onClick={() => setModWinVisibility(true)} title="Log out" alt="log out" />
                </header>
                <Space height="90px" />
                <Outlet />
            </div>
        </div>
    );
}

export default AdminLayout;