import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { auth } from "../api";

function Navbar({ toggleTheme, darkMode }) {
  const navigate = useNavigate();
  const loggedIn = auth.isLoggedIn();

  const handleLoginClick = (e) => {
    // Keep your UI the same, but if already logged in,
    // clicking "Login" will log out and send to /login.
    if (loggedIn) {
      e.preventDefault();
      auth.clearToken();
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link
          to="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
        >
          Blogify
        </Link>

        <div className="flex items-center space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300"
              } hover:text-blue-600 transition`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/add"
            className={({ isActive }) =>
              `text-sm font-medium ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300"
              } hover:text-blue-600 transition`
            }
          >
            Add Blog
          </NavLink>

          <NavLink
            to="/login"
            onClick={handleLoginClick}
            className={({ isActive }) =>
              `text-sm font-medium ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300"
              } hover:text-blue-600 transition`
            }
          >
            {loggedIn ? "Logout" : "Login"}
          </NavLink>

          <NavLink
            to="/signup"
            className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition"
          >
            Sign Up
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
