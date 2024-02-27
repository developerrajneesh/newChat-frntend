import "./App.css"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./Pages/Login/Login";
import { useState } from "react";
import Register from "./Pages/Register/Register";
import AdminRoutes from "./AdminRoutes";
import { Toaster } from "react-hot-toast";
function App() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname == "/") {
    navigate("/admin");
  }

  return (
    <>
      {/* */}
      <Toaster/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
      {/* </Layout> */}
    </>
  );
}

export default App;
