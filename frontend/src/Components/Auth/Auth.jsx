import React, { useState } from "react";
import Login from "./Login"; // Adjust the path as necessary
import Signup from "./Signup"; // Adjust the path as necessary
import "./Auth.css"; // Common styles for authentication components

function Auth() {
  const [isLogin, setIsLogin] = useState(true); // Track which form to show

  const toggleForm = () => {
    setIsLogin(!isLogin); // Toggle between login and signup
  };

  return (
    <div className="auth-container">
      {isLogin ? (
        <Login onClose={toggleForm} />
      ) : (
        <Signup onClose={toggleForm} />
      )}
    </div>
  );
}

export default Auth;
