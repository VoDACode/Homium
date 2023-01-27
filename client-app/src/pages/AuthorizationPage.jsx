import React from "react";
import { useTranslation } from "react-i18next";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import EnterContainer from "../components/EnterContainer/EnterContainer";
import LogInInput from "../components/LogInInput/LogInInput";
import VertSpace from "../components/VertSpace/VertSpace";

const AuthorizationPage = () => {
    const {t: word, i18n} = useTranslation();

    function ChangeAppLanguage(lang) {
        i18n.changeLanguage(lang);
    }

    return (
        <div>
            <EnterContainer>
                <CustomHeader text="Sign in to Homium" textColor={'#298c44'}/>
                <VertSpace h={17} unit="%"/>
                <LogInInput/>
            </EnterContainer>
        </div>
    );
}

export default AuthorizationPage;