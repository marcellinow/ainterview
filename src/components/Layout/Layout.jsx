import React from "react";
import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF5EE]">
      <header className="p-4 border-b">
        <Link to="/" className="text-2xl font-bold">
          <span className="font-mono">{"</>"}</span>
        </Link>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-[#1C1B23] text-white p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-mono text-2xl mr-2">{"</>"}</span>
            <span className="font-bold">AI-nterview</span>
          </div>
          <div className="flex flex-col items-end text-sm">
            <a
              href="https://instagram.com/marcellinojjj"
              className="hover:underline"
            >
              instagram.com/marcellinojjj
            </a>
            <a
              href="https://linkedin.com/in/gabriel-marcellino"
              className="hover:underline"
            >
              linkedin.com/in/gabriel-marcellino
            </a>
            <a
              href="https://github.com/marcellinow"
              className="hover:underline"
            >
              https://github.com/marcellinow
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
