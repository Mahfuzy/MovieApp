import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import Search from '../HO_components/SearchBar';

const Navbar = () => {
  const location = useLocation();
  const history = useHistory();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navbarRef = useRef(null);

  const tvShowPaths = ['/tv-shows', '/popular-tv-shows', '/on-air', '/airing-today', '/top-rated'];
  const isOnTvPage = tvShowPaths.includes(location.pathname) || location.pathname.startsWith('/tv/');

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleSearchSubmit = (query) => {
    history.push(`/search/${encodeURIComponent(query)}`);
    closeMobileMenu();
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        closeMobileMenu();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const linkClass = (path) =>
    `hover:text-white transition-colors duration-200 text-sm ${location.pathname === path ? 'text-white font-medium' : 'text-gray-300'
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen
          ? 'bg-gray-900/95 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-b from-black/70 to-transparent'
        }`}
      ref={navbarRef}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Movies<span className="text-red-500">Hub</span>
          </span>
        </Link>

        {/* Center nav links (desktop) */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className={linkClass('/')}>Home</Link>
          <Link to="/categories" className={linkClass('/categories')}>Categories</Link>
          <Link to="/favorites" className={linkClass('/favorites')}>Favorites</Link>
          <Link to="/watchlist" className={linkClass('/watchlist')}>Watchlist</Link>
          <Link
            to={isOnTvPage ? '/' : '/tv-shows'}
            className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
          >
            {isOnTvPage ? 'Movies' : 'TV Shows'}
          </Link>
        </nav>

        {/* Right side: search (desktop) */}
        <div className="hidden md:flex items-center">
          <Search onSearchSubmit={handleSearchSubmit} />
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="text-white/80 hover:text-white focus:outline-none transition"
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-white/5 px-4 py-4 space-y-3">
          <Link to="/" onClick={closeMobileMenu} className={`block ${linkClass('/')}`}>Home</Link>
          <Link to="/categories" onClick={closeMobileMenu} className={`block ${linkClass('/categories')}`}>Categories</Link>
          <Link to="/favorites" onClick={closeMobileMenu} className={`block ${linkClass('/favorites')}`}>Favorites</Link>
          <Link to="/watchlist" onClick={closeMobileMenu} className={`block ${linkClass('/watchlist')}`}>Watchlist</Link>
          <Link
            to={isOnTvPage ? '/' : '/tv-shows'}
            onClick={closeMobileMenu}
            className="block text-sm text-gray-300 hover:text-white transition"
          >
            {isOnTvPage ? 'Movies' : 'TV Shows'}
          </Link>
          <div className="pt-2 border-t border-white/10">
            <Search onSearchSubmit={handleSearchSubmit} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
