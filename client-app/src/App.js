import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/AdminLayout/AdminLayout";
import SystemInfoPage from "./pages/SystemInfoPage";
import AuthorizationPage from "./pages/AuthorizationPage";
import HomePage from "./pages/HomePage";
import ObjectListPage from "./pages/ObjectListPage";
import UserListPage from "./pages/UserListPage";
import UserEditPage from "./pages/UserEditPage";
import { ApiAuth } from "./services/api/auth";
import SettingsPage from "./pages/SettingsPage";
import ScriptListPage from "./pages/ScriptListPage";
import ScriptEditPage from "./pages/ScriptEditPage";

function App() {

  useEffect(() => {
    ApiAuth.status().then((response) => {
      if (response.status === 401) {
        if (window.location.pathname !== "/auth") {
          window.location.replace("/auth");
        }
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthorizationPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<SystemInfoPage />} />
          <Route path="objects" element={<ObjectListPage />} />
          <Route path="scripts" element={<ScriptListPage />} />
          <Route path="scripts/:id" element={<ScriptEditPage />} />
          <Route path="users" element={<UserListPage />} />
          <Route path="users/:username" element={<UserEditPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
