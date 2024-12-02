import React, { useState } from "react";
import closeIcon from "../../../images/close.png"; // Adjust the path as necessary
import "./Signup.css";

function Signup({ onClose, onToggle }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" }); // Unified for success and error messages

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validation checks
    if (!name || !email || !password || !reenterPassword) {
      setMessage({ type: "error", text: "All fields are required!" });
      return;
    }
    if (!isValidEmail(email)) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }
    if (password.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters long.",
      });
      return;
    }
    if (password !== reenterPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
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
        setMessage({ type: "success", text: "Signup successful!" });
        setName("");
        setEmail("");
        setPassword("");
        setReenterPassword("");
      } else if (response.status === 409) {
        // HTTP 409 Conflict indicates user already exists
        setMessage({
          type: "error",
          text: "User already exists. Please use a different email.",
        });
      } else {
        const data = await response.json();
        setMessage({ type: "error", text: data.message || "Signup failed!" });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again later.",
      });
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
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit(e);
        }}
      >
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
        <input
          type="password"
          placeholder="Re-enter Password"
          value={reenterPassword}
          onChange={(e) => setReenterPassword(e.target.value)}
          required
        />
        {message.text && (
          <p
            className={`message ${
              message.type === "success" ? "success-message" : "error-message"
            }`}
          >
            {message.text}
          </p>
        )}
        <button type="submit">Signup</button>
      </form>
      <div className="newToZomato">
        Already have an account?{" "}
        <div className="createAcc" onClick={onToggle}>
          Log in
        </div>
      </div>
    </div>
  );
}

export default Signup;
