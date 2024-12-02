import React, { useState } from "react";
import "./ForgetPassword.css";
import closeIcon from "../../images/close.png"; // Replace with your close icon path

function ForgotPassword({ onClose }) {
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP, Step 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpsuccess, setOtpsuccess] = useState("");

  const handleEmailSubmit = async () => {
    setError("");
    if (!email) {
      setError("Email is required!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8085/user/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "text/plain" }, // Set Content-Type to text/plain
          body: email, // Send the raw string directly
        }
      );

      if (response.status === 404) {
        throw new Error("User not found!");
      } else if (response.ok) {
        setOtpsuccess("OTP sent successfully!");
        setStep(2);
      } else {
        throw new Error("Failed to send OTP. Please try again.");
      }

      //   setStep(2); // Move to OTP verification step
    } catch (error) {
      setError(error.message);
    }
  };

  const handleOtpVerification = async () => {
    setError("");
    if (!otp) {
      setError("OTP is required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8085/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, otp: otp }),
      });

      if (!response.ok) {
        throw new Error("Invalid OTP. Please try again.");
      }

      setStep(3);
      // Move to password reset step
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePasswordReset = async () => {
    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("Both password fields are required!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8085/user/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword }),
        }
      );

      if (response.status === 404) {
        throw new Error("User not found!");
      } else if (!response.ok) {
        throw new Error("Failed to reset password.");
      }

      setSuccess("Password reset successfully!");
      // onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="forgot-password-container">
      {/* Close Icon */}
      <img
        src={closeIcon}
        alt="Close"
        className="close-icon"
        onClick={onClose}
      />
      {/* Steps */}
      {step === 1 && (
        <div>
          <h2>Forgot Password</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
          <button onClick={handleEmailSubmit}>Submit</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Verify OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
          {otpsuccess && <p className="success-message">{otpsuccess}</p>}
          <button onClick={handleOtpVerification}>Verify OTP</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Reset Password</h2>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button onClick={handlePasswordReset}>Reset Password</button>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
