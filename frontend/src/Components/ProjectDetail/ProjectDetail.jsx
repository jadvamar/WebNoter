import React, { useEffect, useState } from "react";
import "./ProjectDetail.css";
import Cookies from "js-cookie";

function ProjectDetail({ projectId }) {
  const [projectData, setProjectData] = useState([]); // List of subfolders
  const [notesData, setNotesData] = useState([]); // Data to display when a subfolder is clicked
  const [showPopup, setShowPopup] = useState(false); // State to show delete confirmation popup
  const [showEditPopup, setShowEditPopup] = useState(false); // State to show edit popup
  const [noteIdToDelete, setNoteIdToDelete] = useState(null); // Store note ID to delete
  const [noteToEdit, setNoteToEdit] = useState(null); // Store note being edited
  const [noDataAvailable, setNoDataAvailable] = useState(false);

  useEffect(() => {
    if (projectId) {
      const fetchProjectData = async () => {
        try {
          const token = Cookies.get("token");
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

          if (!response.ok) throw new Error("Failed to fetch project details");

          const data = await response.json();
          setProjectData(data);
        } catch (error) {
          console.error("Error fetching project data:", error.message);
        }
      };

      fetchProjectData();
    }
  }, [projectId]);

  const handleSubfolderClick = async (subfolderId) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `http://localhost:8085/data/${subfolderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNotesData(data);
        setNoDataAvailable(data.length === 0); // Set no data message if empty data
      } else {
        setNotesData([]);
        setNoDataAvailable(true); // Set no data message if response is not ok
      }
    } catch (error) {
      console.error("Error fetching notes data:", error.message);
      setNotesData([]);
      setNoDataAvailable(true);
    }
  };

  const removeNote = async (noteId) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `http://localhost:8085/data/remove/${noteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete note");

      // Filter out the deleted note from the state to update the UI
      setNotesData((prevNotes) =>
        prevNotes.filter((note) => note.id !== noteId)
      );
    } catch (error) {
      console.error("Error removing note:", error.message);
    }
  };

  const saveEditedNote = async () => {
    try {
      const token = Cookies.get("token");
      const currentDate = new Date(); // Get the current date

      const response = await fetch(`http://localhost:8085/data/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: noteToEdit.id,
          heading: noteToEdit.heading || null,
          link: noteToEdit.link || null,
          date: noteToEdit.date || currentDate.toISOString(), // Send today's date if not provided
          description: noteToEdit.description || null,
          subFolderId: noteToEdit.subFolderId || null, // Add subFolderId if applicable
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to update note");
      }

      // Update the notes data in state
      setNotesData((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteToEdit.id ? { ...note, ...noteToEdit } : note
        )
      );
      setShowEditPopup(false); // Close the popup after saving
      alert("Note updated successfully!");
    } catch (error) {
      console.error("Error saving note:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const handleEditClick = (note) => {
    setNoteToEdit(note); // Store the note to be edited
    setShowEditPopup(true); // Show the edit popup
  };

  if (!projectData.length) return <p>Select a project to see Folders.</p>;

  return (
    <div className="project-detail-container">
      <div className="project-content">
        <p>Folders</p>
        {projectData.map((subFolder, index) => (
          <div key={index} className="subfolder">
            <button
              className="project-buttons"
              onClick={() => handleSubfolderClick(subFolder.id)}
            >
              {subFolder.subFolderName}
            </button>
          </div>
        ))}
      </div>

      <div className="additional-content">
        <p>Data</p>
        {noDataAvailable ? (
          <div className="no-data-message">No data available</div>
        ) : (
          notesData.map((item) => (
            <div key={item.id} className="note-card">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="note-link"
              >
                {item.link}
              </a>
              <div className="note-header">
                <span className="note-heading">{item.heading}</span>
                <span className="note-date">
                  {new Date(item.date).toLocaleDateString()}
                </span>
              </div>
              <div className="note-description">{item.description}</div>
              <button
                className="remove-note-btn"
                onClick={() => removeNote(item.id)}
              >
                Delete
              </button>
              <button
                className="edit-note-btn"
                onClick={() => handleEditClick(item)}
              >
                Edit
              </button>
            </div>
          ))
        )}
      </div>

      {/* Edit Note Popup */}
      {showEditPopup && noteToEdit && (
        <div className="popup-overlay">
          <div className="edit-popup">
            <h3>Edit Note</h3>
            <label>
              Heading:
              <input
                type="text"
                value={noteToEdit.heading}
                onChange={(e) =>
                  setNoteToEdit((prev) => ({
                    ...prev,
                    heading: e.target.value,
                  }))
                }
              />
            </label>
            <label>
              Description:
              <textarea
                value={noteToEdit.description}
                onChange={(e) =>
                  setNoteToEdit((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </label>
            <div className="popup-buttons">
              <button onClick={saveEditedNote} className="save-btn">
                Save
              </button>
              <button
                onClick={() => setShowEditPopup(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetail;
