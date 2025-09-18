import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 shadow-md">
        {/* Logo (clickable) */}
        <Link to="/" className="text-3xl font-bold tracking-wide">
          Chat<span className="text-blue-500">Mate</span>
        </Link>

        {/* Links */}
        <nav className="flex space-x-6">
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition duration-200"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
          Your Smart Chat Assistant
        </h2>
        <p className="text-gray-400 max-w-2xl mb-8 text-lg md:text-xl">
          Talk with ChatMate — your friendly AI companion that helps you with
          everything from quick answers to deep conversations.
        </p>

        <Link
          to="/login"
          className="px-6 py-3 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg transition duration-200"
        >
          Start Chatting
        </Link>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} ChatMate. All rights reserved.
      </footer>
    </div>
  );
}
