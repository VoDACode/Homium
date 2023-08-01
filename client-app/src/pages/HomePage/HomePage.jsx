import React from "react";
import cl from "./.module.css";
import Space from "../../components/Space/Space";
import ModalWindow from "../../components/ModalWindow/ModalWindow";
import { ApiUsers } from "../../services/api/users";
import { useNavigate } from "react-router-dom";
import { ApiAuth } from "../../services/api/auth";

const HomePage = () => {
    const [curUsername, setCurUsername] = React.useState(null);
    const [isModWinVisible, setModWinVisibility] = React.useState(false);

    const navigate = useNavigate();
    const settingsPageNavigate = () => {
        navigate('/settings');
    };
    const adminPageNavigate = () => {
        navigate('/admin');
    };
    const authPageNavigate = () => {
        ApiAuth.signOut().then(res => {
            navigate('/auth');
        });
    };

    React.useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';

        ApiUsers.getSelfUser().then(data => {
            setCurUsername(data.username);
        });
    }, []);

    return (
        <div>
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
            <header className={cl.top_menu}>
                <span className={cl.logo}>Homium</span>
                <img className={`${cl.top_menu_img_button} ${cl.top_menu_log_out_button}`} onClick={() => setModWinVisibility(true)} title="log out" alt="log out" />
                <img className={`${cl.top_menu_img_button} ${cl.top_menu_settings_button}`} onClick={() => settingsPageNavigate()} title="settings" alt="settings" />
                <img className={`${cl.top_menu_img_button} ${cl.top_menu_admin_button}`} onClick={() => adminPageNavigate()} title="admin dashboard" alt="admin" />
            </header>
            <h1 className={cl.page_header}>{curUsername ? `Welcome, ${curUsername}!` : '...'}</h1>
            <Space height="3vh" />
            <div className={cl.scenes}>
            </div>
        </div>
    );
}

export default HomePage;