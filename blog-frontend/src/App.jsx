import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BlogDetail from "./pages/BlogDetail";
import Login from "./pages/Login";
import AddBlog from "./pages/AddBlog";
import Signup from "./pages/Signup";
import Footer from "./components/Footer";

import { api } from "./api";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load blogs from backend on app start
  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await api.getBlogs();
        setBlogs(data);
      } catch (error) {
        console.error("Failed to load blogs:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  // Keep local state in sync after creating a blog
  const addBlog = (newBlog) => {
    setBlogs((prev) => [newBlog, ...prev]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />

      <div className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={<Home blogs={blogs} loading={loading} />}
          />

          <Route
            path="/blog/:id"
            element={<BlogDetail blogs={blogs} />}
          />

          <Route path="/login" element={<Login />} />

          <Route
            path="/add"
            element={<AddBlog addBlog={addBlog} />}
          />

          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
