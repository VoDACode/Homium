import React, { useEffect, useState } from "react";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import SceneCell from "../components/SceneCell/SceneCell";
import SceneContainer from "../components/SceneContainer/SceneContainer";
import HomeTopMenu from "../components/HomeTopMenu/HomeTopMenu";
import VertSpace from "../components/VertSpace/VertSpace";

const HomePage = () => {
    const [curUsername, setCurUsername] = useState(undefined);

    useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';

        fetch('/api/users/list/self').then(res => res.json()).then(data => {
            setCurUsername(data.username);
        });
    }, []);

    return (
        <div>
            <HomeTopMenu/>
            <CustomHeader text={`Welcome, ${curUsername}!`} textColor="#00a000" textSize="5vh" isCenter={true}/>
            <VertSpace h={3} unit="vh"/>
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