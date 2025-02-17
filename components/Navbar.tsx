"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link"; // Use Next.js Link component
import { Menu, X } from "lucide-react"; // Icons for menu toggle


const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // Access localStorage only on the client side (after mount)
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUsername(JSON.parse(storedUser).username);
      }
    }
  }, []);

  return (
    <nav className="navbar-nav">
      <Link href="/" className="flex items-center space-x-3 text-white p-3 rounded-lg">
        <span>a Board</span>
      </Link>
      {/* <h1 className="">a Board</h1> */}

      {/* Search + Actions */}
      <div className="md:flex hidden items-center space-x-4">
        {username ? (
          <button className="bg-green-700 px-4 py-2 rounded text-sm">
            {username}
          </button>
        ) : (
          <Link href="/sign-in">
            <button className="bg-green-700 px-4 py-2 rounded text-sm">
              Sign In
            </button>
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden p-2" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>
    </nav>
  );
};

export default Navbar;
