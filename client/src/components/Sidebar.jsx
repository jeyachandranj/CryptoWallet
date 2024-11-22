// Sidebar.js
import React, { useState } from "react";
import { Link } from 'react-router-dom'
import {
  FaHome,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Sidebar = ({randomId}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed md:relative inset-y-0 left-0 z-30 w-64 bg-gray-800 p-5 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } md:block`}
      >
        <div className="mt-16">
          <h1 className="text-white text-2xl font-bold mb-6">Dashboard</h1>
          <nav>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/dashboard"
                  className="flex items-center p-2 text-gray-300 hover:bg-gray-700 rounded-md"
                >
                  <FaHome className="mr-3" /> Home
                </Link>
              </li>
              <li>
                <Link
                  to="/referralTree"
                  className="flex items-center p-2 text-gray-300 hover:bg-gray-700 rounded-md"
                >
                  <FaUser className="mr-3" /> Matrix
                </Link>
              </li>
             
              
            </ul>
          </nav>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Toggle Button */}
      <button
        className="text-white p-2 md:hidden fixed top-4 left-4 z-40 rounded-md hover:bg-gray-700 transition duration-200"
        onClick={toggleSidebar}
        style={{ backgroundColor: "transparent" }}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

     
    </div>
  );
};

export default Sidebar;
