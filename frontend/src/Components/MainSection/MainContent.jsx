import React, { useState, useEffect, useContext } from "react";
import "./MainContent.css";
import AddSubfolder from "../AddSubfolder/AddsubFolder";
import AddCandidate from "../AddCandidate/AddCandidate";
import ProjectDetail from "../ProjectDetail/ProjectDetail";
import Cookies from "js-cookie";
import { UserContext } from "../Contexts/UserContext";

function MainContent() {
  const { loginUser } = useContext(UserContext);
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [subfolderVisibility, setSubfolderVisibility] = useState({});
  const [showAddSubfolder, setShowAddSubfolder] = useState(false);
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const token = Cookies.get("token");
    const email = Cookies.get("email");
    if (!token || !email) return; // Skip fetching if not logged in

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

      if (!response.ok) throw new Error("Failed to fetch projects");

      const projectData = await response.json();
      setProjects(projectData);
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    }
  };

  const handleAddProject = async () => {
    if (projectName.trim()) {
      const token = Cookies.get("token");
      try {
        const response = await fetch(
          "http://localhost:8085/project/addProject",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: projectName,
              email: Cookies.get("email"),
            }),
          }
        );

        if (response.ok) {
          setError("Project added successfully");
          setProjectName("");
          fetchProjects();
          return;
        } else if (response.status === 409) {
          setError("Project already exists");
        } else {
          setError("Error occurred while adding new project");
        }
      } catch (error) {
        console.error("Error adding project:", error.message);
      }
    } else {
      setError("Project name cannot be empty.");
    }
  };

  const toggleSubfolder = (projectId) => {
    setSubfolderVisibility((prevVisibility) => ({
      ...prevVisibility,
      [projectId]: !prevVisibility[projectId],
    }));
  };

  const openAddSubfolderModal = (projectId, projectName) => {
    setSelectedProjectId(projectId);
    setSelectedProjectName(projectName);
    setShowAddSubfolder(true);
  };

  const toggleAddCandidateModal = (projectId) => {
    setSelectedProjectId(projectId);
    setShowAddCandidate(!showAddCandidate);
  };

  const handleCloseSubfolderModal = () => {
    setShowAddSubfolder(false);
    setSelectedProjectId(null);
    setSelectedProjectName("");
  };

  const handleSubfolderAdded = (newSubfolder) => {
    setProjects((prevProjects) =>
      prevProjects.map((proj) =>
        proj.id === newSubfolder.projectId
          ? { ...proj, subfolders: [...(proj.subfolders || []), newSubfolder] }
          : proj
      )
    );
  };

  const handleProjectButtonClick = (projectId) => {
    setSelectedProjectId(projectId);
  };

  const confirmDeleteProject = (projectId) => {
    setProjectToDelete(projectId);
    setShowDeletePopup(true);
  };

  const deleteProject = async () => {
    const token = Cookies.get("token");
    const email = Cookies.get("email");
    try {
      const response = await fetch("http://localhost:8085/project/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ useremail: email, projectId: projectToDelete }),
      });

      if (response.ok) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== projectToDelete)
        );
        setShowDeletePopup(false);
        setProjectToDelete(null);
        setError("");
      } else if (response.status === 409) {
        setError("Only admin can delete this project");
      } else {
        setError("Failed to delete project.");
      }
    } catch (error) {
      console.error("Error deleting project:", error.message);
      setError("Error deleting project. Please try again.");
    }
  };

  const closeDeletePopup = () => {
    setShowDeletePopup(false);
    setError("");
  };

  return (
    <div className="main-content">
      <div className="left-section">
        <h2>Projects</h2>
        {projects.length === 0 ? (
          loginUser ? (
            <p>Please create a project</p>
          ) : (
            <p>Please login</p>
          )
        ) : (
          projects.map((project) => (
            <div key={project.id} className="project-container">
              <button
                onClick={() => {
                  toggleSubfolder(project.id);
                  handleProjectButtonClick(project.id);
                }}
              >
                {project.projectName}
              </button>
              {subfolderVisibility[project.id] && (
                <div className="actions">
                  <button
                    onClick={() =>
                      openAddSubfolderModal(project.id, project.projectName)
                    }
                  >
                    Add Folder
                  </button>
                  <button onClick={() => toggleAddCandidateModal(project.id)}>
                    Add Candidates
                  </button>
                  <button onClick={() => confirmDeleteProject(project.id)}>
                    Delete Project
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="right-section">
        <div className="add-project">
          <input
            type="text"
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          {error && <div className="error-message">{error}</div>}
          <button onClick={handleAddProject}>Add Project</button>
        </div>
        <div className="project-detail-container">
          <ProjectDetail projectId={selectedProjectId} />
        </div>
      </div>

      {showDeletePopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>
              Are you sure you want to delete {selectedProjectName} this
              project?
            </h3>
            {error2 && <div className="error-message">{error2}</div>}
            <button onClick={deleteProject}>Yes</button>
            <button onClick={closeDeletePopup}>No</button>
          </div>
        </div>
      )}

      {showAddSubfolder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowAddSubfolder(false)}
            >
              X
            </button>
            <AddSubfolder
              projectId={selectedProjectId}
              onClose={handleCloseSubfolderModal}
              onSubfolderAdded={handleSubfolderAdded}
              projectName={selectedProjectName}
            />
          </div>
        </div>
      )}

      {showAddCandidate && selectedProjectId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowAddCandidate(false)}
            >
              X
            </button>
            <AddCandidate projectId={selectedProjectId} />
          </div>
        </div>
      )}
    </div>
  );
}

export default MainContent;
