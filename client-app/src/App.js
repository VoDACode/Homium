import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthorizationPage from "./pages/AuthorizationPage/AuthorizationPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthorizationPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
