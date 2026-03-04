import React, { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import { api } from "../api";

function Home({ blogs: blogsProp }) {
  const [blogs, setBlogs] = useState(Array.isArray(blogsProp) ? blogsProp : []);
  const [loading, setLoading] = useState(!Array.isArray(blogsProp));
  const [error, setError] = useState("");

  useEffect(() => {
    // If parent still passes blogs, keep working.
    if (Array.isArray(blogsProp)) {
      setBlogs(blogsProp);
      setLoading(false);
      return;
    }

    // Otherwise fetch from backend.
    (async () => {
      try {
        setError("");
        setLoading(true);
        const data = await api.getBlogs();
        setBlogs(data);
      } catch (e) {
        setError(e.message || "Failed to load blogs");
      } finally {
        setLoading(false);
      }
    })();
  }, [blogsProp]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <h1
          className="text-4xl md:text-5xl font-extrabold mb-4
          bg-gradient-to-r from-blue-600 to-purple-600
          text-transparent bg-clip-text"
        >
          Discover Amazing Blogs
        </h1>

        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-lg">
          Read, explore, and share knowledge with our modern React blogging platform.
        </p>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading blogs...
          </p>
        ) : error ? (
          <p className="text-center text-red-500">
            {error}
          </p>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No blogs available
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
