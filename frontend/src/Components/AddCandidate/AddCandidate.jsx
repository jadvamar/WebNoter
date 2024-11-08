import React, { useState } from "react";
import "./AddCandidate.css";

function EmailForm() {
  const [emails, setEmails] = useState([
    "example1@mail.com",
    "example2@mail.com",
  ]);
  const [newEmail, setNewEmail] = useState("");

  const handleAddEmail = () => {
    if (newEmail.trim() && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail]);
      setNewEmail("");
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  return (
    <div className="email-form">
      <h2>Candidates List</h2>

      {/* Display List of Emails */}
      <div className="email-list">
        <ul>
          {emails.map((email, index) => (
            <li key={index}>
              {email}{" "}
              <button
                className="remove-button"
                onClick={() => handleRemoveEmail(email)}
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
    </div>
  );
}

export default EmailForm;
