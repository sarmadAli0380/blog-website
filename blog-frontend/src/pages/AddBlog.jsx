import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, auth } from "../api";

function AddBlog({ addBlog }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // backend requires token for POST /api/blogs
    if (!auth.isLoggedIn()) {
      navigate("/login");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const created = await api.createBlog({
        title,
        description,
        content,
        image,
      });

      // If your app still uses local state via addBlog, keep it in sync too.
      if (typeof addBlog === "function") addBlog(created);

      navigate("/");
    } catch (e) {
      setError(e.message || "Failed to publish blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">

        <h2
          className="text-3xl font-extrabold text-center mb-6
          bg-gradient-to-r from-blue-600 to-purple-600
          text-transparent bg-clip-text"
        >
          Create New Blog
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            placeholder="Blog Title"
            className="w-full px-4 py-3 rounded-lg border
            border-gray-300 dark:border-gray-700
            bg-transparent dark:text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Short Description"
            className="w-full px-4 py-3 rounded-lg border
            border-gray-300 dark:border-gray-700
            bg-transparent dark:text-white
            focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Image URL (optional)"
            className="w-full px-4 py-3 rounded-lg border
            border-gray-300 dark:border-gray-700
            bg-transparent dark:text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <textarea
            placeholder="Write your blog content here..."
            rows="6"
            className="w-full px-4 py-3 rounded-lg border
            border-gray-300 dark:border-gray-700
            bg-transparent dark:text-white
            focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full font-semibold text-white
            bg-gradient-to-r from-blue-600 to-purple-600
            hover:opacity-90 transition shadow-lg disabled:opacity-60"
          >
            {loading ? "Publishing..." : "Publish Blog"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddBlog;
