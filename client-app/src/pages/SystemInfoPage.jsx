import React, { useEffect } from "react";
import CustomHeader from "../components/CustomHeader/CustomHeader";

const SystemInfoPage = () => {
    useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';
    }, []);

    return (
        <div>
            <CustomHeader text="System information" textColor="#0036a3" textSize="45px" isCenter={true}/>
        </div>
    );
}

export default SystemInfoPage;