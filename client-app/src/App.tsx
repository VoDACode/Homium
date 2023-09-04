import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ApiAuth } from "./services/api/auth";
import AdminLayout from "./components/AdminLayout/AdminLayout";
import SystemInfoPage from "./pages/SystemInfoPage/SystemInfoPage";
import AuthorizationPage from "./pages/AuthorizationPage/AuthorizationPage";
import HomePage from "./pages/HomePage/HomePage";
import ObjectListPage from "./pages/ObjectListPage/ObjectListPage";
import UserListPage from "./pages/UserListPage/UserListPage";
import UserEditPage from "./pages/UserEditPage/UserEditPage";
import ScriptListPage from "./pages/ScriptListPage/ScriptListPage";
import ScriptEditPage from "./pages/ScriptEditPage/ScriptEditPage";
import ObjectEditPage from "./pages/ObjectEditPage/ObjectEditPage";
import ExtensionListPage from "./pages/ExtensionListPage/ExtensionListPage";

const App: React.FC = () => {

  React.useEffect(() => {
    ApiAuth.status().then((response) => {
      if (response.status === 401) {
        if (window.location.pathname !== "/auth") {
          window.location.replace("/auth");
        }
      }
    });
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthorizationPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<SystemInfoPage />} />
          <Route path="objects" element={<ObjectListPage />} />
          <Route path="objects/:id" element={<ObjectEditPage />} />
          <Route path="scripts" element={<ScriptListPage />} />
          <Route path="scripts/:id" element={<ScriptEditPage />} />
          <Route path="extensions" element={<ExtensionListPage />} />
          <Route path="users" element={<UserListPage />} />
          <Route path="users/:username" element={<UserEditPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
