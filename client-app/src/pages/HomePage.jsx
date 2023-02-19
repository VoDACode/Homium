import React, { useEffect, useState } from "react";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import SceneCell from "../components/SceneCell/SceneCell";
import SceneContainer from "../components/SceneContainer/SceneContainer";
import HomeTopMenu from "../components/HomeTopMenu/HomeTopMenu";
import Space from "../components/Space/Space";
import { ApiUsers } from "../services/api/users";
import ModalWindow from "../components/ModalWindow/ModalWindow";
import LogOutPanel from "../components/LogOutPanel/LogOutPanel";
import { useNavigate } from "react-router-dom";
import { ApiAuth } from "../services/api/auth";

const HomePage = () => {
    const [curUsername, setCurUsername] = useState(null);
    const [isModWinVisible, setModWinVisibility] = useState(false);

    const navigate = useNavigate();
    const settingsPageNavigate = () => {
        navigate('/settings');
    }
    const adminPageNavigate = () => {
        navigate('/admin');
    }
    const authPageNavigate = () => {
        ApiAuth.signOut().then(res => {
            navigate('/auth');
        });
    }

    useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';

        ApiUsers.getSelfUser().then(data => {
            setCurUsername(data.username);
        });
    }, []);

    return (
        <div>
            <ModalWindow visible={isModWinVisible}>
                <LogOutPanel onLogOutClick={authPageNavigate} onCancelClick={() => setModWinVisibility(false)}/>
            </ModalWindow>
            <HomeTopMenu onLogOutClick={() => setModWinVisibility(true)} onSettingsClick={settingsPageNavigate} onAdminClick={adminPageNavigate}/>
            <CustomHeader text={curUsername ? `Welcome, ${curUsername}!` : null} textColor="#0036a3" textSize="5vh" isCenter={true}/>
            <Space size="3vh"/>
            <SceneContainer>
                <SceneCell/>
                <SceneCell/>
                <SceneCell/>
                <SceneCell/>
                <SceneCell/>
                <SceneCell/>
                <SceneCell/>
            </SceneContainer>
        </div>
    );
}

export default HomePage;