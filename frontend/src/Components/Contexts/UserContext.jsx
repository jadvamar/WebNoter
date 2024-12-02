import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    const email = Cookies.get("email");
    const name = Cookies.get("name");

    // Check if token exists; if so, validate it
    if (token) {
      validateToken(token)
        .then((isValid) => {
          if (isValid && email && name) {
            setUser({ name, token, email });
            console.log("after validating token");
            fetchProjects(email); // Fetch projects if token is valid
          } else {
            // clearCookies(); // Clear cookies if token is invalid
          }
        })
        .catch(() => clearCookies()); // Handle any errors by clearing cookies
    }
  }, []);

  // Function to validate token with backend
  const validateToken = async (token) => {
    console.log("came in validate token");
    try {
      const response = await fetch(`http://localhost:8085/user/validateToken`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) console.log("token validated");
      else console.log("token not validated");
      return response.ok;
      // Returns true if token is valid, otherwise false
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  };

  // Function to log in the user and set cookies
  const loginUser = (userData) => {
    setUser(userData);
    console.log(
      "login user data after login - > " +
        userData.token +
        " " +
        userData.email +
        " " +
        userData.name
    );
    Cookies.set("token", userData.token, { expires: 1, path: "/" });
    Cookies.set("name", userData.name, { expires: 1, path: "/" });
    Cookies.set("email", userData.email, { expires: 1, path: "/" });

    fetchProjects(userData.email);
  };

  // Function to fetch project data based on email
  const fetchProjects = async (email) => {
    const token = Cookies.get("token");
    console.log("fetch in context");
    try {
      const response = await fetch(
        `http://localhost:8085/project/getProjects?email=${email}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const projectData = await response.json();
      setProjects(projectData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Function to clear all cookies
  const clearCookies = () => {
    Cookies.remove("token");
    Cookies.remove("name");
    Cookies.remove("email");
    setUser(null);
    setProjects(null);
  };

  // Function to log out the user and clear cookies
  const logoutUser = () => {
    clearCookies();
    window.location.reload();
  };

  return (
    <UserContext.Provider value={{ user, projects, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
