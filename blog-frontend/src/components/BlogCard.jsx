import { Link } from "react-router-dom";

function BlogCard({ blog }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-44 object-cover"
      />

      <div className="p-5">
        <h2 className="text-xl font-semibold mb-2">
          {blog.title}
        </h2>

        <p className="text-gray-600 mb-4">
          {blog.description}
        </p>

        {/* ✅ IMPORTANT */}
        <Link
          to={`/blog/${blog.id}`}
          className="text-blue-600 font-semibold hover:underline"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
}

export default BlogCard;
