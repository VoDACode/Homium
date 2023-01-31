import React from "react";
import SceneCell from "../components/SceneCell/SceneCell";
import SceneContainer from "../components/SceneContainer/SceneContainer";
import TopBar from "../components/TopBar/TopBar";
import img from './log-out.png';

const HomePage = () => {
    return (
        <div>
            <TopBar/>
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