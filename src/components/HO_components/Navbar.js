import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import Search from '../HO_components/SearchBar';

const Navbar = () => {
  const location = useLocation();
  const history = useHistory();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTvGenres] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [isMobileMoviesOpen, setIsMobileMoviesOpen] = useState(false);
  const [isMobileTvOpen, setIsMobileTvOpen] = useState(false);

  const navbarRef = useRef(null);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

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

  // Fetch Genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [movieRes, tvRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_API_KEY}`),
          fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.REACT_APP_API_KEY}`),
        ]);

        if (movieRes.ok && tvRes.ok) {
          const movieData = await movieRes.json();
          const tvData = await tvRes.json();
          setMovieGenres(movieData.genres || []);
          setTvGenres(tvData.genres || []);
        }
      } catch (error) {
        console.error("Failed to fetch genres", error);
      }
    };
    fetchGenres();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
      if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !navbarRef.current.contains(event.target)) {
        closeMobileMenu();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const linkClass = (path) =>
    `hover:text-white transition-colors duration-200 text-sm ${location.pathname === path ? 'text-white font-medium' : 'text-gray-300'
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled || isMobileMenuOpen
        ? 'bg-gray-900/95 backdrop-blur-md shadow-lg'
        : 'bg-gray-900 md:bg-transparent md:bg-gradient-to-b md:from-black/70 md:to-transparent'
        }`}
      ref={navbarRef}
    >
      <div className="w-full mx-auto px-4 sm:px-6 h-16 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 flex-shrink-0 relative z-[60]"
          onClick={closeMobileMenu}
        >
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight whitespace-nowrap">
            Movies<span className="text-red-500">Hub</span>
          </span>
        </Link>

        {/* Center nav links (desktop) */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className={linkClass('/')}>Home</Link>

          {/* Categories Dropdown */}
          <div className="relative group" ref={dropdownRef}>
            <button
              className={`flex items-center gap-1 text-sm hover:text-white transition-colors duration-200 ${isCategoryDropdownOpen ? 'text-white' : 'text-gray-300'}`}
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              onMouseEnter={() => setIsCategoryDropdownOpen(true)}
            >
              Categories
              <svg className={`w-4 h-4 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isCategoryDropdownOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-6 grid grid-cols-2 gap-8"
                onMouseLeave={() => setIsCategoryDropdownOpen(false)}
              >
                {/* Movies Column */}
                <div>
                  <h3 className="text-red-500 font-bold mb-3 uppercase text-xs tracking-wider flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
                    Movies
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {movieGenres.map(genre => (
                      <Link
                        key={genre.id}
                        to={`/categories/${genre.id}`}
                        className="text-gray-400 hover:text-white text-sm transition-colors hover:bg-white/5 p-1 rounded"
                        onClick={() => setIsCategoryDropdownOpen(false)}
                      >
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* TV Shows Column */}
                <div>
                  <h3 className="text-blue-500 font-bold mb-3 uppercase text-xs tracking-wider flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    TV Shows
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {tvGenres.map(genre => (
                      <Link
                        key={genre.id}
                        to={`/categories/${genre.id}`}
                        className="text-gray-400 hover:text-white text-sm transition-colors hover:bg-white/5 p-1 rounded"
                        onClick={() => setIsCategoryDropdownOpen(false)}
                      >
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

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
        <div className="md:hidden relative z-[60]">
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="text-white/80 hover:text-white focus:outline-none transition p-1"
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

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[110] transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Sidebar */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-[100dvh] w-[70%] max-w-[280px] bg-gray-900 border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out z-[120] md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gray-800/50 flex-shrink-0">
            <span className="text-white font-bold text-lg tracking-tight">
              Movies<span className="text-red-500">Hub</span>
            </span>
            <button
              onClick={closeMobileMenu}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-white/10 bg-gray-800/30 flex-shrink-0">
            <Search onSearchSubmit={handleSearchSubmit} />
          </div>

          {/* Scrollable Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${location.pathname === '/' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-300 hover:bg-white/5 active:bg-white/10'}`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium">Home</span>
            </Link>

            <Link
              to="/favorites"
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${location.pathname === '/favorites' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-300 hover:bg-white/5 active:bg-white/10'}`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="font-medium">Favorites</span>
            </Link>

            <Link
              to="/watchlist"
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${location.pathname === '/watchlist' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-300 hover:bg-white/5 active:bg-white/10'}`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="font-medium">Watchlist</span>
            </Link>

            <Link
              to={isOnTvPage ? '/' : '/tv-shows'}
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-300 hover:bg-white/5 active:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              <span className="font-medium">{isOnTvPage ? 'Movies' : 'TV Shows'}</span>
            </Link>

            {/* Categories Section */}
            <div className="pt-4 mt-2 border-t border-white/10">
              <button
                onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                className="w-full flex items-center justify-between px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 focus:outline-none"
              >
                <span>Categories</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isMobileCategoriesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isMobileCategoriesOpen && (
                <div className="space-y-4 animate-fadeIn pl-2">
                  {/* Mobile Movies */}
                  <div>
                    <button
                      onClick={() => setIsMobileMoviesOpen(!isMobileMoviesOpen)}
                      className="w-full flex items-center justify-between px-3 text-xs text-red-400 font-bold mb-2 uppercase tracking-wide focus:outline-none"
                    >
                      <span>Movies</span>
                      <svg
                        className={`w-3 h-3 transition-transform duration-200 ${isMobileMoviesOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isMobileMoviesOpen && (
                      <div className="space-y-0.5 animate-fadeIn">
                        {movieGenres.slice(0, 8).map(genre => (
                          <Link
                            key={genre.id}
                            to={`/categories/${genre.id}`}
                            onClick={closeMobileMenu}
                            className="block px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          >
                            {genre.name}
                          </Link>
                        ))}
                        {movieGenres.length > 8 && (
                          <Link
                            to="/categories"
                            onClick={closeMobileMenu}
                            className="block px-3 py-2 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                          >
                            View All Movies →
                          </Link>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Mobile TV Shows */}
                  <div>
                    <button
                      onClick={() => setIsMobileTvOpen(!isMobileTvOpen)}
                      className="w-full flex items-center justify-between px-3 text-xs text-blue-400 font-bold mb-2 uppercase tracking-wide focus:outline-none"
                    >
                      <span>TV Shows</span>
                      <svg
                        className={`w-3 h-3 transition-transform duration-200 ${isMobileTvOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isMobileTvOpen && (
                      <div className="space-y-0.5 animate-fadeIn">
                        {tvGenres.slice(0, 8).map(genre => (
                          <Link
                            key={genre.id}
                            to={`/categories/${genre.id}`}
                            onClick={closeMobileMenu}
                            className="block px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          >
                            {genre.name}
                          </Link>
                        ))}
                        {tvGenres.length > 8 && (
                          <Link
                            to="/categories"
                            onClick={closeMobileMenu}
                            className="block px-3 py-2 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                          >
                            View All TV Shows →
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;