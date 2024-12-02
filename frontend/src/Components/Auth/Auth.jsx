import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "./Auth.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  // Toggle function to switch between login and signup forms
  const toggleForm = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <div className="auth-container">
      {isLogin ? (
        <Login onClose={() => setIsLogin(false)} onToggle={toggleForm} />
      ) : (
        <Signup onClose={() => setIsLogin(true)} onToggle={toggleForm} />
      )}
    </div>
  );
}

export default Auth;
