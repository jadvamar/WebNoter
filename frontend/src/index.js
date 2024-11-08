import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { UserProvider } from "./Components/Contexts/UserContext"; // Import UserProvider

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      {" "}
      {/* Wrap App with UserProvider */}
      <App />
    </UserProvider>
  </React.StrictMode>
);
