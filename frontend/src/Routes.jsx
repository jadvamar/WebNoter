// src/Routes.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home page/Home";
import Login from "./Components/Auth/Login/Login";
import Signup from "./Components/Auth/Signup/Signup";
import Extension from "./Components/Extension/Extension";
import Header from "./Components/header/header";
import AddCandidate from "./Components/AddCandidate/AddCandidate";
import { UserProvider } from "./Components/Contexts/UserContext";
function AppRoutes() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ext" element={<Extension />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Header" element={<Header />} />
        <Route path="/add" element={<AddCandidate />} />
      </Routes>
    </UserProvider>
  );
}

export default AppRoutes;
