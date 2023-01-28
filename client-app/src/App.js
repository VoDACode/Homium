import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthorizationPage from "./pages/AuthorizationPage";
import RegistrationPage from "./pages/RegistrationPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthorizationPage/>}/>
        <Route path="/reg" element={<RegistrationPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
