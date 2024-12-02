import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Extension.css";
import Cookies from "js-cookie";

/* global chrome */ // Add this to declare chrome as a global variable

const Extension = () => {
  const [dropdownValue, setDropdownValue] = useState("");
  const [subfolder, setSubfolder] = useState("");
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");
  const [projects, setProjects] = useState([]);
  const [subfolders, setSubfolders] = useState([]);
  const [link, setLink] = useState("https://github.com");
  const [date, setDate] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    getCurrentTabLink();
    setDate(new Date().toISOString()); // Set current date
  }, []);

  // Fetch projects from API
  const fetchProjects = async () => {
    const email = Cookies.get("email");
    const token = Cookies.get("token");
    try {
      const response = await fetch(
        `http://localhost:8085/project/getProjects?email=${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Fetch subfolders based on selected project ID
  const fetchSubfolders = async (projectId) => {
    const token = Cookies.get("token");
    try {
      const response = await fetch(
        `http://localhost:8085/subfolder/${projectId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setSubfolders(data);
    } catch (error) {
      console.error("Error fetching subfolders:", error);
    }
  };

  // Get current browser tab URL
  const getCurrentTabLink = () => {
    const urll = window.location.href;
    console.log("this is urlu " + urll);
    setLink(urll);
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        setLink(activeTab.url || ""); // Set the current tab URL
      });
    }
  };

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    setDropdownValue(projectId);
    setSubfolder("");
    setSubfolders([]);
    if (projectId) {
      fetchSubfolders(projectId);
    }
  };

  const handleSubmitdata = async () => {
    const token = Cookies.get("token");

    try {
      const response = await fetch("http://localhost:8085/data/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: content,
          heading: heading,
          subFolderId: subfolder,
          link: link,
          date: date || new Date().toISOString(), // Default date if not provided
        }),
      });

      // Only parse JSON if response is ok and has content
      const result =
        response.ok && response.headers.get("content-length") > 0
          ? await response.json()
          : { message: "No content in response" };

      if (response.ok) {
        setSuccessMessage("Data submitted successfully!");
        setErrorMessage("");
      } else {
        setErrorMessage(result.error || "Unknown error occurred");
      }
    } catch (error) {
      setErrorMessage("Error submitting data: " + error.message);
      setSuccessMessage("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSubmitdata();
  };

  const handleAddProject = () => {
    navigate("/");
  };

  const handleAddSubfolder = () => {
    navigate("/");
  };

  return (
    <div className="form-extension">
      <form onSubmit={handleSubmit} className="form-content">
        <label>
          Select Project:
          <select value={dropdownValue} onChange={handleProjectChange} required>
            <option value="">--Choose Project--</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.projectName}
              </option>
            ))}
          </select>
          <button type="button" onClick={handleAddProject}>
            Add New Project
          </button>
        </label>

        <label>
          Select Subfolder:
          <select
            value={subfolder}
            onChange={(e) => setSubfolder(e.target.value)}
            required
          >
            <option value="">--Choose Subfolder--</option>
            {subfolders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.subFolderName}
              </option>
            ))}
          </select>
          <button type="button" onClick={handleAddSubfolder}>
            Add New Subfolder
          </button>
        </label>

        <label>
          Heading:
          <input
            type="text"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
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

      {/* Display success or error message */}
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default Extension;
