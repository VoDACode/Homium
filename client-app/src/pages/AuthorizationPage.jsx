import React, { useEffect } from "react";
import AccountOffer from "../components/AccountOffer/AccountOffer";
import CustomHeader from "../components/CustomHeader/CustomHeader";
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
                <VertSpace height="8vh"/>
                <LogInInput/>
                <VertSpace height="6vh"/>
                <AccountOffer headerColor="rgb(11, 49, 0)" headerText="Don't have an account?" linkText="Sign up now" linkTo="/reg"/>
                <VertSpace height="2vh"/>
            </EnterContainer>
        </div>
    );
}

export default AuthorizationPage;