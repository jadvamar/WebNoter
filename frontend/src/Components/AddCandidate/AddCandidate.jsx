import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "./AddCandidate.css";

function EmailForm({ projectId }) {
  const [emails, setEmails] = useState([]); // Array of objects with id and email
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState(""); // State for email error
  const [adminError, setAdminError] = useState(""); // State for admin error

  useEffect(() => {
    // Fetch emails on component load
    fetchEmails();
  }, []);

  // Function to fetch emails from the backend
  const fetchEmails = async () => {
    const token = Cookies.get("token");

    try {
      const response = await fetch(
        `http://localhost:8085/candidate/getEmails?projectId=${projectId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const emailList = await response.json();

        // Set the emails state with both ID and email addresses
        setEmails(
          emailList.map((user) => ({ id: user.id, email: user.email }))
        );
      } else {
        console.error("Failed to fetch emails");
      }
    } catch (error) {
      console.error("Error fetching emails:", error.message);
    }
  };

  const validateAndAddEmail = async () => {
    const loggedInUserEmail = Cookies.get("email");
    const token = Cookies.get("token");

    console.log(loggedInUserEmail + " " + token + " " + projectId);

    // Reset error messages before each request
    setEmailError("");
    setAdminError("");

    try {
      const response = await fetch("http://localhost:8085/candidate/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          adminEmail: loggedInUserEmail,
          projectId: projectId,
          candidateEmail: newEmail,
        }),
      });

      const contentType = response.headers.get("Content-Type");

      let result;
      if (contentType && contentType.includes("application/json")) {
        result = await response.json(); // If JSON, parse it
      } else {
        result = await response.text(); // Otherwise, handle as plain text
      }

      if (response.ok) {
        setEmails([...emails, { id: result.id, email: newEmail }]); // Update with new email and ID
        setNewEmail("");
        setEmailError("");
        setAdminError("");
      } else if (
        response.status === 400 &&
        result === "Invalid email address."
      ) {
        setEmailError("The email is not valid.");
      } else if (
        response.status === 403 &&
        result === "You can't add candidates. Only the admin can."
      ) {
        setAdminError("You can't add candidates. Only the admin can.");
      } else {
        setEmailError(
          result || "An unexpected error occurred. Please try again."
        );
      }
    } catch (error) {
      console.error("Error adding email:", error.message);
      setEmailError("Failed to add email. Please try again.");
    }
  };

  const handleAddEmail = () => {
    if (newEmail.trim() && !emails.some((e) => e.email === newEmail)) {
      validateAndAddEmail();
    }
  };

  const handleRemoveEmail = async (emailToRemove) => {
    const token = Cookies.get("token");
    const loggedInUserEmail = Cookies.get("email");
    // Reset error messages
    setEmailError("");
    setAdminError("");

    try {
      const response = await fetch("http://localhost:8085/candidate/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          adminEmail: loggedInUserEmail,
          projectId: projectId,
          candidateEmail: emailToRemove,
        }),
      });

      const contentType = response.headers.get("Content-Type");
      let result;
      if (contentType && contentType.includes("application/json")) {
        result = await response.json(); // If JSON, parse it
      } else {
        result = await response.text(); // Otherwise, handle as plain text
      }

      if (response.ok) {
        // Remove email from the state list after successful removal
        setEmails((prevEmails) =>
          prevEmails.filter((email) => email.email !== emailToRemove)
        );
        setAdminError("Email removed successfully.");
      } else if (response.status === 403) {
        setAdminError("You don't have permission to remove this candidate.");
      } else if (response.status === 409) {
        setAdminError("You cannot remove yourself.");
      } else {
        setEmailError("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error removing email:", error.message);
      setEmailError("Failed to remove email. Please try again.");
    }
  };

  return (
    <div className="email-form">
      <h2>Candidates List</h2>

      {/* Display List of Emails */}
      <div className="email-list">
        <ul>
          {emails.map((emailObj) => (
            <li key={emailObj.id}>
              {emailObj.email}
              <button
                className="remove-button"
                onClick={() => handleRemoveEmail(emailObj.email)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Form to Add New Email */}
      <div className="email-input">
        <input
          type="email"
          placeholder="Enter new email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button onClick={handleAddEmail}>Add Email</button>
      </div>

      {/* Display Error Messages */}
      {emailError && <div className="error-message">{emailError}</div>}
      {adminError && <div className="error-message">{adminError}</div>}
    </div>
  );
}

export default EmailForm;
