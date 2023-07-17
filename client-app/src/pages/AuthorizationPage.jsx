import React, { useEffect } from "react";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import EnterContainer from "../components/EnterContainer/EnterContainer";
import LogInInput from "../components/LogInInput/LogInInput";
import Space from "../components/Space/Space";

const AuthorizationPage = () => {
    useEffect(() => {
        document.body.style.backgroundColor = 'white';
    }, []);

    return (
        <div>
            <EnterContainer backColor="rgba(0, 45, 100, 0.38)">
                <CustomHeader text="Sign in to Homium" textColor='rgb(22, 22, 165)' textSize="7vh" isCenter={true}/>
                <Space height="4vh"/>
                <LogInInput/>
                <Space height="2vh"/>
            </EnterContainer>
        </div>
    );
}

export default AuthorizationPage;