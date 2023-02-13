import React, { useEffect } from "react";
import CustomHeader from "../components/CustomHeader/CustomHeader";
import CustomSelect from "../components/CustomSelect/CustomSelect";
import Space from "../components/Space/Space";
import Switch from "../components/Switch/Switch";

const SettingsPage = () => {
    useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';
    }, []);

    return (
        <div>
            <CustomHeader text="Settings" textSize="50px" isCenter={true}/>
            <CustomHeader text="Night mode:" textSize="30px"/>
            <Space size="10px"/>
            <Switch/>
            <Space size="30px"/>
            <CustomHeader text="Language:" textSize="30px"/>
            <CustomSelect options={['English', 'Українська', 'Русский']}/>
        </div>
    );
}

export default SettingsPage;