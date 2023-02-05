import React, { useEffect } from "react";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import SceneCell from "../components/SceneCell/SceneCell";
import SceneContainer from "../components/SceneContainer/SceneContainer";
import HomeTopMenu from "../components/HomeTopMenu/HomeTopMenu";
import VertSpace from "../components/VertSpace/VertSpace";

const HomePage = () => {
    useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';
    }, []);

    return (
        <div>
            <HomeTopMenu/>
            <CustomHeader text="Welcome, user!" textColor="#00a000" textSize="5vh" isCenter={true}/>
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