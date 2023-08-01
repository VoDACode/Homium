import React from "react";
import cl from "./.module.css";

const SystemInfoPage = () => {
    React.useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';
    }, []);

    return (
        <div>
            <h1 className={cl.page_header}>System information</h1>
        </div>
    );
}

export default SystemInfoPage;