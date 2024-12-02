// import React from "react";
// import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";
// import Extension from "./Components/Extension/Extension";
// import { UserProvider } from "./Components/Contexts/UserContext"; // Import UserProvider

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <UserProvider>
//       {" "}
//       {/* Wrap App with UserProvider */}
//       <App />
//     </UserProvider>
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Extension from "./Components/Extension/Extension";
import { UserProvider } from "./Components/Contexts/UserContext"; // Import UserProvider

const root = ReactDOM.createRoot(document.getElementById("root"));

// Check if the component is rendering for the extension popup
if (document.getElementById("popup-root")) {
  // Render the Extension component inside popup-root
  root.render(
    <React.StrictMode>
      <UserProvider>
        <Extension />
      </UserProvider>
    </React.StrictMode>
  );
} else {
  // Otherwise, render the main app for the website
  root.render(
    <React.StrictMode>
      <UserProvider>
        <App />
      </UserProvider>
    </React.StrictMode>
  );
}
