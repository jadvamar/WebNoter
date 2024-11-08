// src/App.js
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./Routes"; // Update the import name to match your Routes component
import "./App.css";
import Extension from "./Components/Extension/Extension";

function App() {
  return (
    <Router>
      <div className="App">
        {/* <Extension /> */}
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
