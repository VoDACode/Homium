import React from "react";
import AccountOffer from "../components/AccountOffer/AccountOffer";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import EllipseButton from "../components/EllipseButton/EllipseButton";
import EnterContainer from "../components/EnterContainer/EnterContainer";
import LogInInput from "../components/LogInInput/LogInInput";
import VertSpace from "../components/VertSpace/VertSpace";

const AuthorizationPage = () => {
    return (
        <div>
            <EnterContainer>
                <CustomHeader text="Sign in to Homium" textColor={'#298c44'}/>
                <VertSpace h={8} unit="vh"/>
                <LogInInput/>
                <VertSpace h={5} unit="vh"/>
                <EllipseButton text="Sign in" bColor="green"/>
                <VertSpace h={6} unit="vh"/>
                <AccountOffer headerText="Don't have an account?" linkText="Sign up now"/>
            </EnterContainer>
        </div>
    );
}

export default AuthorizationPage;