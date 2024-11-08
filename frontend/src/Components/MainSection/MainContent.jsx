import React, { useState, useEffect } from "react";
import "./MainContent.css";
import AddCandidate from "../AddCandidate/AddCandidate"; // Import the AddCandidate component
import Cookies from "js-cookie";

function MainContent() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [subfolderVisibility, setSubfolderVisibility] = useState({});
  const [showAddCandidate, setShowAddCandidate] = useState(false); // State to manage the modal visibility

  // Fetch projects when component loads
  useEffect(() => {
    const fetchProjects = async () => {
      const token = Cookies.get("token"); // Retrieve token from cookies
      const email = Cookies.get("email"); // Get the email from cookies or context

      try {
        const response = await fetch(
          `http://localhost:8085/project/getProjects?email=${email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Send token in Authorization header
            },
          }
        );

        // Ensure the response is valid
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const projectData = await response.json();
        console.log("Fetched Projects:", projectData); // Log to inspect

        // Update state with the fetched data
        setProjects(projectData);
        console.log(projects);
      } catch (error) {
        console.error("Error fetching projects:", error.message);
      }
    };

    fetchProjects();
  }, []);

  const handleAddProject = async () => {
    if (projectName.trim()) {
      const token = Cookies.get("token"); // Retrieve the token from cookies

      try {
        const response = await fetch(
          "http://localhost:8085/project/addProject",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Send token in Authorization header
            },
            body: JSON.stringify({
              name: projectName,
              email: Cookies.get("email"), // Send email to backend
            }),
          }
        );

        const newProject = await response.json(); // Directly parse the JSON response

        // Add the new project to the state
        setProjects((prevProjects) => [...prevProjects, newProject]);
        setProjectName(""); // Clear the input field after adding the project
      } catch (error) {
        console.error("Error adding project:", error.message);
      }
    }
  };

  const toggleSubfolder = (projectId) => {
    setSubfolderVisibility((prevVisibility) => ({
      ...prevVisibility,
      [projectId]: !prevVisibility[projectId],
    }));
  };

  const toggleAddCandidateModal = () => {
    setShowAddCandidate(!showAddCandidate); // Toggle modal visibility
  };

  return (
    <div className="main-content">
      {/* Left Section - 30% width with links */}
      <div className="left-section">
        <h2>Projects</h2>
        <div className="link-actions">
          <button onClick={toggleAddCandidateModal}>Add Candidates</button>
        </div>

        {/* Dynamically render project links */}
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id}>
              <button onClick={() => toggleSubfolder(project.id)}>
                {project.projectName} {/* Display project name */}
              </button>
              {subfolderVisibility[project.id] && (
                <div className="subfolder-list">
                  <button className="subfolder-button">Subfolder A</button>
                  <button className="subfolder-button">Subfolder B</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No projects available</p> // Message to show if no projects are available
        )}
      </div>

      {/* Right Section - 70% width with "Add Project" */}
      <div className="right-section">
        <div className="add-project">
          <input
            type="text"
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <button onClick={handleAddProject}>Add Project</button>
        </div>
      </div>

      {/* Add Candidate Modal Popup */}
      {showAddCandidate && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={toggleAddCandidateModal}>
              X
            </button>
            <div className="amar">
              <AddCandidate />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainContent;
