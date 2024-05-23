import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import AuthChecker from "../auth_components/AuthChecker";
import SignOut from "../auth_components/SignOut";
import Search from '../HO_components/SearchBar';

const Navbar = () => {
  const user = AuthChecker();
  const location = useLocation();
  const history = useHistory();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navbarRef = useRef(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSearchSubmit = (query) => {
    history.push(`/search/${encodeURIComponent(query)}`);
    closeMobileMenu(); // Close mobile menu after search
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        closeMobileMenu(); // Close mobile menu if clicked outside navbar
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <header className="bg-gray-800 text-white py-4 shadow-md">
      <div className="container mx-auto py-4 px-2 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold mr-4">
            Logo
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
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
                <Link to="/favorites" className="hover:text-gray-400">
                  My Favorites
                </Link>
              </li>
              <li>
                <Link to="/watchlist" className="hover:text-gray-400">
                  Watchlist
                </Link>
              </li>
              <li>
                <Link
                  to={location.pathname === '/' ? '/tv-shows' : '/'}
                  className="hover:text-gray-400"
                >
                  {location.pathname === '/' ? 'See TV Shows' : 'See Movies'}
                </Link>
              </li>
            </ul>
            {/* Include Search component for big screens */}
            <Search onSearchSubmit={handleSearchSubmit} />
          </nav>
        </div>
        <div className="md:hidden">
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 text-white p-4 space-y-2 z-50">
          <ul className="space-y-2">
            <li>
              <Link to="/" onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/categories" onClick={closeMobileMenu}>
                Categories
              </Link>
            </li>
            <li>
              <Link to="/favorites" onClick={closeMobileMenu}>
                My Favorites
              </Link>
            </li>
            <li>
              <Link to="/watchlist" onClick={closeMobileMenu}>
                Watchlist
              </Link>
            </li>
            {user ? (
              <li>
                <SignOut onClick={closeMobileMenu} />
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login" onClick={closeMobileMenu}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" onClick={closeMobileMenu}>
                    Sign Up
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link
                to={location.pathname === '/' ? '/tv-shows' : '/'}
                onClick={closeMobileMenu}
              >
                {location.pathname === '/' ? 'See TV Shows' : 'See Movies'}
              </Link>
            </li>
            {/* Include Search component for mobile screens */}
            <li>
              <Search onSearchSubmit={handleSearchSubmit} />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
