import React, { useState, useContext } from "react";
import { UserContext } from "../../Contexts/UserContext";
import "./Login.css";
import closeIcon from "../../../images/close.png";
import ForgotPassword from "../../ForgetPassword/ForgetPassword"; // Import the new module

function Login({ onClose, onToggle }) {
  const { loginUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false); // Manage the "Forgot Password" flow

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Both fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8085/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      loginUser({ email: data.email, token: data.token, name: data.name });
      window.location.reload();
      onClose();
    } catch (error) {
      setError(error.message || "Something went wrong!");
    }
  };

  if (showForgotPassword) {
    return <ForgotPassword onClose={onClose} />;
  }

  return (
    <div className="login-container">
      <img
        src={closeIcon}
        alt="Close"
        className="close-icon"
        onClick={onClose}
      />
      <h2>Login</h2>
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>
      </form>
      <div className="extra-options">
        <div className={"newToZomato"}>
          Create a new account?{" "}
          <div className={"createAcc"} onClick={onToggle}>
            Signup
          </div>
        </div>
        <p onClick={() => setShowForgotPassword(true)} className="forgot-link">
          Forgot Password?
        </p>
      </div>
    </div>
  );
}

export default Login;
