import React, { useEffect, useState } from "react";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import SceneCell from "../components/SceneCell/SceneCell";
import SceneContainer from "../components/SceneContainer/SceneContainer";
import HomeTopMenu from "../components/HomeTopMenu/HomeTopMenu";
import VertSpace from "../components/VertSpace/VertSpace";
import { ApiUsers } from "../services/api/users";
import ModalWindow from "../components/ModalWindow/ModalWindow";
import LogOutPanel from "../components/LogOutPanel/LogOutPanel";
import { useNavigate } from "react-router-dom";
import { ApiAuth } from "../services/api/auth";

const HomePage = () => {
    const [curUsername, setCurUsername] = useState(null);
    const [isModWinVisible, setModWinVisibility] = useState(false);

    const navigate = useNavigate();
    const authPageNavigate = () => {
        ApiAuth.signOut().then(res => {
            navigate('/auth');
        });
    }

    useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';

        ApiUsers.getSeflUser().then(data => {
            setCurUsername(data.username);
        });
    }, []);

    return (
        <div>
            <ModalWindow visible={isModWinVisible}>
                <LogOutPanel onLogOutClick={authPageNavigate} onCancelClick={() => setModWinVisibility(false)}/>
            </ModalWindow>
            <HomeTopMenu onLogOutClick={setModWinVisibility}/>
            <CustomHeader text={curUsername ? `Welcome, ${curUsername}!` : null} textColor="#00a000" textSize="5vh" isCenter={true}/>
            <VertSpace height="3vh"/>
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