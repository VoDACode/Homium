import React from "react";
import AccountOffer from "../components/AccountOffer/AccountOffer";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import EllipseButton from "../components/EllipseButton/EllipseButton";
import EnterContainer from "../components/EnterContainer/EnterContainer";
import SignUpInput from "../components/SignUpInput/SignUpInput";
import VertSpace from "../components/VertSpace/VertSpace";

const RegistrationPage = () => {
    return (
        <div>
            <EnterContainer backColor="rgba(0, 45, 100, 0.38)">
                <CustomHeader text="Create an account" textColor={'rgb(22, 22, 165)'}/>
                <VertSpace h={4} unit="vh"/>
                <SignUpInput/>
                <VertSpace h={4} unit="vh"/>
                <EllipseButton text="Sign up" bColor="blue"/>
                <VertSpace h={4} unit="vh"/>
                <AccountOffer headerColor="rgb(0, 0, 100)" headerText="Do have an account already?" linkText="Sign in now" linkTo="/auth"/>
            </EnterContainer>
        </div>
    );
}

export default RegistrationPage;