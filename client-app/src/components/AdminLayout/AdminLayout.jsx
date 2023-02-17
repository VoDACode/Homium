import React from "react";
import { Outlet } from "react-router-dom";
import AdminTopMenu from "../AdminTopMenu/AdminTopMenu";

const AdminLayout = () => {
    return (
        <div>
            <AdminTopMenu/>
            <Outlet/>
        </div>
    );
}

export default AdminLayout;