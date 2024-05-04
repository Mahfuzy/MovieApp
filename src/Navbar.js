import React from "react";
import { Link } from "react-router-dom";
import AuthChecker from "./AuthChecker";
import SignOut from "./SignOut";

const Navbar = ({ handleSearch }) => {
  const user = AuthChecker();

  return (
    <nav className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Your Logo
        </Link>
        <div className="flex items-center">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-gray-400">
                Home
              </Link>
            </li>
            <li>
              <Link to="/categories" className="hover:text-gray-400">
                Categories
              </Link>
            </li>
            <li>
              <Link to="/mylist" className="hover:text-gray-400">
                My List
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-gray-400">
                Profile
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-gray-400">
                About
              </Link>
            </li>
            {user ? (
              <li>
                <SignOut />
              </li>
            ) : (
              <li>
                <Link to="/login" className="hover:text-gray-400">
                  Login
                </Link>{" "}
                or{" "}
                <Link to="/signup" className="hover:text-gray-400">
                  Sign Up
                </Link>
              </li>
            )}
          </ul>
          <div className="flex items-center ml-4">
            <input
              className="w-48 px-4 bg-slate-500 rounded-lg text-white focus:outline-none"
              type="text"
              placeholder="Search..."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
