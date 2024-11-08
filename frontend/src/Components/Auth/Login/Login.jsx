import React, { useState, useContext } from "react";
import { UserContext } from "../../Contexts/UserContext";
import "./Login.css";
import closeIcon from "../../../images/close.png";

function Login({ onClose }) {
  const { loginUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
      console.log(data);
      loginUser({ email: data.email, token: data.token, name: data.name });
      onClose();
    } catch (error) {
      setError(error.message || "Something went wrong!");
    }
  };

  return (
    <div className="login-container">
      <img
        src={closeIcon}
        alt="Close"
        className="close-icon"
        onClick={onClose}
      />
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
      <a href="/signup">Create a new account</a>
    </div>
  );
}

export default Login;
