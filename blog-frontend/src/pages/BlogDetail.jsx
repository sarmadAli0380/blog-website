import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";

function BlogDetail({ blogs }) {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If parent still passes blogs, this continues to work.
    if (Array.isArray(blogs) && blogs.length > 0) {
      const found = blogs.find((b) => String(b.id) === String(id));
      if (found) {
        setBlog(found);
        setLoading(false);
        return;
      }
    }

    // Otherwise fetch from backend.
    (async () => {
      try {
        setError("");
        setLoading(true);
        const b = await api.getBlogById(id);
        setBlog(b);
      } catch (e) {
        setError(e.message || "Blog not found");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, blogs]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading...
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="text-center mt-10 text-gray-500">
        {error || "Blog not found"}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-72 object-cover rounded mb-6"
      />

      <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
        {blog.title}
      </h1>

      <p className="text-sm text-gray-500 mb-6">
        By {blog.author} • {new Date(blog.date).toDateString()}
      </p>

      {/* Keep your exact UI behavior */}
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
}

export default BlogDetail;
