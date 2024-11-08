import React, { useState } from "react";
import "./Extension.css";

const Extension = () => {
  const [dropdownValue, setDropdownValue] = useState("");
  const [subfolder, setSubfolder] = useState("");
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process the form data as needed
    console.log("Form submitted:", {
      dropdownValue,
      subfolder,
      heading,
      content,
    });
    setIsFormVisible(false); // Close the form on submit
  };

  return (
    isFormVisible && (
      <div className="form-extension">
        <form onSubmit={handleSubmit} className="form-content">
          <label>
            Select Project:
            <select
              value={dropdownValue}
              onChange={(e) => setDropdownValue(e.target.value)}
              required
            >
              <option value="">--Choose Project--</option>
              <option value="project1">Project 1</option>
              <option value="project2">Project 2</option>
              <option value="project3">Project 3</option>
            </select>
          </label>

          <label>
            Select Subfolder:
            <select
              value={subfolder}
              onChange={(e) => setSubfolder(e.target.value)}
              required
            >
              <option value="">--Choose Subfolder--</option>
              <option value="subfolder1">Subfolder 1</option>
              <option value="subfolder2">Subfolder 2</option>
              <option value="subfolder3">Subfolder 3</option>
            </select>
          </label>

          <label>
            Heading:
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              required
            />
          </label>

          <label>
            Content:
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </label>

          <button type="submit">Submit</button>
        </form>
      </div>
    )
  );
};

export default Extension;
