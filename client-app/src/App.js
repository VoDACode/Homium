import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/AdminLayout/AdminLayout";
import SystemInfoPage from "./pages/SystemInfoPage";
import AuthorizationPage from "./pages/AuthorizationPage";
import HomePage from "./pages/HomePage";
import RegistrationPage from "./pages/RegistrationPage";
import ObjectListPage from "./pages/ObjectListPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/auth" element={<AuthorizationPage/>}/>
        <Route path="/reg" element={<RegistrationPage/>}/>
        <Route path="/admin" element={<AdminLayout/>}>
          <Route index element={<SystemInfoPage/>}/>
          <Route path="objects" element={<ObjectListPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
