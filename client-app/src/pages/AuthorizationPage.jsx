import React, { useEffect } from "react";
import AccountOffer from "../components/AccountOffer/AccountOffer";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import EllipseButton from "../components/EllipseButton/EllipseButton";
import EnterContainer from "../components/EnterContainer/EnterContainer";
import LogInInput from "../components/LogInInput/LogInInput";
import VertSpace from "../components/VertSpace/VertSpace";

const AuthorizationPage = () => {
    useEffect(() => {
        document.body.style.backgroundColor = 'white';
    }, []);

    return (
        <div>
            <EnterContainer backColor="rgba(0, 135, 67, 0.38)">
                <CustomHeader text="Sign in to Homium" textColor={'#298c44'} isCenter={true}/>
                <VertSpace h={8} unit="vh"/>
                <LogInInput/>
                <VertSpace h={5} unit="vh"/>
                <EllipseButton text="Sign in" bColor="green"/>
                <VertSpace h={6} unit="vh"/>
                <AccountOffer headerColor="rgb(11, 49, 0)" headerText="Don't have an account?" linkText="Sign up now" linkTo="/reg"/>
                <VertSpace h={2} unit="vh"/>
            </EnterContainer>
        </div>
    );
}

export default AuthorizationPage;