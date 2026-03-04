import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">
            React Blog
          </h2>
          <p className="text-sm">
            A blogging platform can easily add 
            blog and can easily post it and read it.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link to="/add" className="hover:text-white">
                Add Blog
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white">
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className="hover:text-white">
                Signup
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact / Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Contact
          </h3>
          <p className="text-sm">Email: farhanhaider6550@gmail.com</p>
          <p className="text-sm">Phone: +92 318 6335510</p>
          <p className="text-sm mt-2">
            © {new Date().getFullYear()} Blogify
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-800 text-center text-sm py-3">
        Copyright 2025-2026 by Refsnes Data. All Rights Reserved
      </div>
    </footer>
  );
}

export default Footer;
