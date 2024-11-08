// src/popup.js
import React from "react";
import ReactDOM from "react-dom/client";
import Extension from "./Components/Extension/Extension";
import "./index.css"; // If any shared styling is needed

const root = ReactDOM.createRoot(document.getElementById("popup-root"));
root.render(
  <React.StrictMode>
    <Extension />
  </React.StrictMode>
);
