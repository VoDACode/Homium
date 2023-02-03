import React from "react";
import { Outlet } from "react-router-dom";
import AdminTopMenu from "../AdminTopMenu/AdminTopMenu";
import cl from './.module.css';

const AdminLayout = () => {
    return (
        <div className={cl.main}>
            <AdminTopMenu/>
            <Outlet/>
        </div>
    );
}

export default AdminLayout;