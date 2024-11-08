import React, { useState } from "react";
import closeIcon from "../../../images/close.png"; // Adjust the path as necessary
import "./Signup.css";

function Signup({ onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8085/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        setSuccess("Signup successful!");
        setName("");
        setEmail("");
        setPassword("");
      } else {
        const data = await response.json();
        setError(data.message || "Signup failed!");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="signup-container">
      <img
        src={closeIcon}
        alt="Close"
        className="close-icon"
        onClick={onClose}
      />
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        {success && <p className="success-message">{success}</p>}
        <button type="submit">Signup</button>
      </form>
      <p className="login-link">
        Already have an account? <a onClick={onClose}>Login here</a>
      </p>
    </div>
  );
}

export default Signup;
