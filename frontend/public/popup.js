import React from "react";
import { createRoot } from "react-dom/client";
import Extension from "../src/Components/Extension/Extension";
import "./popup.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Extension />
  </React.StrictMode>
);
