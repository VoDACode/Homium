import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminTopMenu from "../AdminTopMenu/AdminTopMenu";
import cl from './.module.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const homePageNavigate = () => navigate('/');
    const authPageNavigate = () => navigate('/auth');

    return (
        <div className={cl.main}>
            <AdminTopMenu logoClick={homePageNavigate} logOutClick={authPageNavigate}/>
            <Outlet/>
        </div>
    );
}

export default AdminLayout;