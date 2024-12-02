// import React, { useState, useEffect } from "react";
// import Cookies from "js-cookie";
// import "./AddsubFolder.css";

// function AddSubfolder({ projectId, onClose, onSubfolderAdded, projectName }) {
//   const [subfolderName, setSubfolderName] = useState("");
//   const [subfolders, setSubfolders] = useState([]);
//   const [error, setError] = useState("");
//   const [showDeletePopup, setShowDeletePopup] = useState(false);
//   const [subfolderToDelete, setSubfolderToDelete] = useState(null);
//   const [showEditPopup, setShowEditPopup] = useState(false);
//   const [subfolderToEdit, setSubfolderToEdit] = useState(null);

//   useEffect(() => {
//     // Fetch existing subfolders on load
//     fetchSubfolders();
//   }, []);

//   const fetchSubfolders = async () => {
//     const token = Cookies.get("token");
//     try {
//       const response = await fetch(
//         `http://localhost:8085/subfolder/${projectId}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.ok) {
//         const fetchedSubfolders = await response.json();
//         setSubfolders(fetchedSubfolders);
//       } else {
//         setError("Failed to fetch subfolders.");
//         setSubfolders();
//       }
//     } catch (error) {
//       console.error("Error fetching subfolders:", error.message);
//       setError("Error fetching subfolders.");
//     }
//   };

//   const handleAddSubfolder = async () => {
//     if (!subfolderName.trim()) {
//       setError("Subfolder name cannot be empty.");
//       return;
//     }
//     if (subfolderName.length > 17) {
//       setError("Subfolder name cannot exceed 17 characters.");
//       return;
//     }

//     setError(""); // Clear previous error
//     const token = Cookies.get("token");

//     try {
//       const response = await fetch("http://localhost:8085/subfolder/add", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           projectId: projectId,
//           subFolderName: subfolderName,
//         }),
//       });

//       const result = await response.json();
//       if (response.ok) {
//         // const newSubfolder = await response.json();
//         setSubfolders([...subfolders, result]);
//         setSubfolderName("");
//         fetchSubfolders();
//         setError(result.message);
//       } else {
//         setError(result.message);
//       }
//     } catch (error) {
//       console.error("Error adding subfolder:", error.message);
//       setError("Error adding subfolder. Please try again.");
//     }
//   };

//   const handleDeleteClick = (subfolder) => {
//     setSubfolderToDelete(subfolder);
//     setShowDeletePopup(true);
//   };

//   const handleEditClick = (subfolder) => {
//     setSubfolderToEdit(subfolder);
//     setShowEditPopup(true);
//   };

//   const handleConfirmEdit = async () => {
//     if (!subfolderName.trim()) {
//       setError("Subfolder name cannot be empty.");
//       return;
//     }
//     if (subfolderName.length > 17) {
//       setError("Subfolder name cannot exceed 17 characters.");
//       return;
//     }

//     const token = Cookies.get("token");
//     try {
//       const response = await fetch("http://localhost:8085/subfolder/update", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           id: subfolderToEdit.id,
//           subFolderName: subfolderName, // Include the new name
//         }),
//       });

//       if (response.ok) {
//         // Update the subfolders state with the edited subfolder name
//         setSubfolders((prev) =>
//           prev.map((folder) =>
//             folder.id === subfolderToEdit.id
//               ? { ...folder, subFolderName: subfolderName }
//               : folder
//           )
//         );
//         setShowEditPopup(false); // Close the popup
//         setSubfolderToEdit(null); // Clear the edit subfolder state
//         setSubfolderName(""); // Clear the input field
//       } else {
//         const result = await response.json();
//         setError(result.message || "Failed to update subfolder.");
//       }
//     } catch (error) {
//       console.error("Error updating subfolder:", error.message);
//       setError("Error updating subfolder. Please try again.");
//     }
//   };

//   const handleConfirmDelete = async () => {
//     const token = Cookies.get("token");
//     const subfolderId = subfolderToDelete.id;
//     try {
//       const response = await fetch(
//         `http://localhost:8085/subfolder/remove/${subfolderId}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.ok) {
//         setSubfolders((prev) =>
//           prev.filter((folder) => folder.id !== subfolderToDelete.id)
//         ); // Update list without deleted subfolder
//         setShowDeletePopup(false);
//         setSubfolderToDelete(null);
//       } else {
//         setError("Failed to delete subfolder.");
//       }
//     } catch (error) {
//       console.error("Error deleting subfolder:", error.message);
//       setError("Error deleting subfolder. Please try again.");
//     }
//   };

//   return (
//     <div className="email-form">
//       <h2>Candidates List</h2>

//       {/* Display List of Emails */}
//       <div className="email-list">
//         <ul>
//           {subfolders.map((folder) => (
//             <li key={folder.id} className="subfolder-item">
//               <span>{folder.subFolderName}</span>
//               <div className="action-buttons">
//                 <button
//                   className="remove-button"
//                   onClick={() => handleDeleteClick(folder)}
//                 >
//                   Remove
//                 </button>
//                 <button
//                   className="remove-button"
//                   onClick={() => handleEditClick(folder)}
//                 >
//                   Edit
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Form to Add New Email */}
//       <input
//         type="text"
//         placeholder="Enter subfolder name"
//         value={subfolderName}
//         onChange={(e) => setSubfolderName(e.target.value)}
//       />
//       <div className="message-area">
//         {error && <div className="error-message">{error}</div>}
//       </div>

//       <button onClick={handleAddSubfolder}>Save Subfolder</button>

//       {showDeletePopup && (
//         <div className="delete-popup-overlay">
//           <div className="delete-popup">
//             <p>Do you want to delete this subfolder?</p>
//             <button onClick={handleConfirmDelete}>Yes</button>
//             <button onClick={() => setShowDeletePopup(false)}>No</button>
//           </div>
//         </div>
//       )}

//       {showEditPopup && (
//         <div className="delete-popup-overlay">
//           <div className="delete-popup">
//             <p>Enter new Subfolder name of {subfolderToEdit.subFolderName}</p>
//             <input
//               type="text"
//               placeholder="Enter subfolder name"
//               value={subfolderName}
//               onChange={(e) => setSubfolderName(e.target.value)}
//             />
//             <button onClick={handleConfirmEdit()}>Save</button>
//             <button onClick={() => setShowEditPopup(false)}>Cancel</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AddSubfolder;

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "./AddsubFolder.css";

function AddSubfolder({ projectId, onClose, onSubfolderAdded, projectName }) {
  const [subfolderName, setSubfolderName] = useState("");
  const [subfolders, setSubfolders] = useState([]);
  const [error, setError] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [subfolderToDelete, setSubfolderToDelete] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [subfolderToEdit, setSubfolderToEdit] = useState(null);

  useEffect(() => {
    fetchSubfolders();
  }, []);

  const fetchSubfolders = async () => {
    const token = Cookies.get("token");
    try {
      const response = await fetch(
        `http://localhost:8085/subfolder/${projectId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const fetchedSubfolders = await response.json();
        setSubfolders(fetchedSubfolders);
      } else {
        setError("Failed to fetch subfolders.");
        setSubfolders([]);
      }
    } catch (error) {
      console.error("Error fetching subfolders:", error.message);
      setError("Error fetching subfolders.");
      setSubfolders([]);
    }
  };

  const handleAddSubfolder = async () => {
    if (!subfolderName.trim()) {
      setError("Subfolder name cannot be empty.");
      return;
    }
    if (subfolderName.length > 17) {
      setError("Subfolder name cannot exceed 17 characters.");
      return;
    }

    setError(""); // Clear previous error
    const token = Cookies.get("token");

    try {
      const response = await fetch("http://localhost:8085/subfolder/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId: projectId,
          subFolderName: subfolderName,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setSubfolders([...subfolders, result]); // Update subfolders locally
        setSubfolderName("");
        setError(result.message);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Error adding subfolder:", error.message);
      setError("Error adding subfolder. Please try again.");
    }
  };

  const handleDeleteClick = (subfolder) => {
    setSubfolderToDelete(subfolder);
    setShowDeletePopup(true);
  };

  const handleEditClick = (subfolder) => {
    setSubfolderToEdit(subfolder);
    setShowEditPopup(true);
  };

  const handleConfirmEdit = async () => {
    if (!subfolderName.trim()) {
      setError("Subfolder name cannot be empty.");
      return;
    }
    if (subfolderName.length > 17) {
      setError("Subfolder name cannot exceed 17 characters.");
      return;
    }

    const token = Cookies.get("token");
    try {
      const response = await fetch("http://localhost:8085/subfolder/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: subfolderToEdit.id,
          subFolderName: subfolderName, // Include the new name
        }),
      });

      if (response.ok) {
        setSubfolders((prev) =>
          prev.map((folder) =>
            folder.id === subfolderToEdit.id
              ? { ...folder, subFolderName: subfolderName }
              : folder
          )
        );
        setShowEditPopup(false);
        setSubfolderToEdit(null);
        setSubfolderName("");
      } else {
        const result = await response.json();
        setError(result.message || "Failed to update subfolder.");
      }
    } catch (error) {
      console.error("Error updating subfolder:", error.message);
      setError("Error updating subfolder. Please try again.");
    }
  };

  const handleConfirmDelete = async () => {
    const token = Cookies.get("token");
    const subfolderId = subfolderToDelete.id;
    try {
      const response = await fetch(
        `http://localhost:8085/subfolder/remove/${subfolderId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSubfolders((prev) =>
          prev.filter((folder) => folder.id !== subfolderToDelete.id)
        );
        setShowDeletePopup(false);
        setSubfolderToDelete(null);
      } else {
        setError("Failed to delete subfolder.");
      }
    } catch (error) {
      console.error("Error deleting subfolder:", error.message);
      setError("Error deleting subfolder. Please try again.");
    }
  };

  return (
    <div className="email-form">
      <h2>Candidates List</h2>

      <div className="email-list">
        <ul>
          {subfolders.map((folder) => (
            <li key={folder.id} className="subfolder-item">
              <span>{folder.subFolderName}</span>
              <div className="action-buttons">
                <button
                  className="remove-button"
                  onClick={() => handleDeleteClick(folder)}
                >
                  Remove
                </button>
                <button
                  className="remove-button"
                  onClick={() => handleEditClick(folder)}
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <input
        type="text"
        placeholder="Enter subfolder name"
        value={subfolderName}
        onChange={(e) => setSubfolderName(e.target.value)}
      />
      <div className="message-area">
        {error && <div className="error-message">{error}</div>}
      </div>

      <button onClick={handleAddSubfolder}>Save Subfolder</button>

      {showDeletePopup && (
        <div className="delete-popup-overlay">
          <div className="delete-popup">
            <p>Do you want to delete this subfolder?</p>
            <button onClick={handleConfirmDelete}>Yes</button>
            <button onClick={() => setShowDeletePopup(false)}>No</button>
          </div>
        </div>
      )}

      {showEditPopup && (
        <div className="delete-popup-overlay">
          <div className="delete-popup">
            <p>Enter new Subfolder name of {subfolderToEdit.subFolderName}</p>
            <input
              type="text"
              placeholder="Enter subfolder name"
              value={subfolderName}
              onChange={(e) => setSubfolderName(e.target.value)}
            />
            <button onClick={handleConfirmEdit}>Save</button>
            <button onClick={() => setShowEditPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddSubfolder;
