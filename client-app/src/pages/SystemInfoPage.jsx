import React, { useEffect } from "react";
import CustomHeader from "../components/CustomHeader/CustomHeader";

const SystemInfoPage = () => {
    useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';
    }, []);

    return (
        <div>
            <CustomHeader text="System information" textColor="#2b9aad" textSize="5vh" isCenter={true}/>
        </div>
    );
}

export default SystemInfoPage;