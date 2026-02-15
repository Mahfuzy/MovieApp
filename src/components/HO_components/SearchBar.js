import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link, useHistory } from 'react-router-dom';

const Search = ({ onSearchSubmit }) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setResults([]);
        if (!query) setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [query]);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const apiKey = process.env.REACT_APP_API_KEY;
        const [movieRes, tvRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=1`),
          fetch(`https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=1`)
        ]);

        const [movies, tvShows] = await Promise.all([movieRes.json(), tvRes.json()]);

        const combined = [
          ...(movies.results || []).map(m => ({ ...m, type: 'movie' })),
          ...(tvShows.results || []).map(t => ({ ...t, type: 'tv' }))
        ].sort((a, b) => b.popularity - a.popularity).slice(0, 6);

        setResults(combined);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    // Redirect to search results page
    history.push(`/search/${encodeURIComponent(query)}`);
    setResults([]);
    setIsExpanded(false);
    setQuery('');
  };

  const handleResultClick = () => {
    setQuery('');
    setResults([]);
    setIsExpanded(false);
  };

  const expandSearch = () => {
    setIsExpanded(true);
  };

  return (
    <div ref={searchRef} className="relative z-50">
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className={`flex items-center bg-white/10 backdrop-blur-md rounded-full border border-white/10 transition-all duration-300 ${isExpanded ? 'w-64 bg-black/40 border-white/30' : 'w-10 h-10 bg-transparent border-transparent'
          }`}>
          <button
            type="button"
            onClick={expandSearch}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition rounded-full"
            aria-label="Search"
          >
            <FaSearch className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            onFocus={() => setIsExpanded(true)}
            placeholder="Search movies & TV..."
            className={`bg-transparent text-white text-sm placeholder-white/40 outline-none pr-4 transition-all duration-300 ${isExpanded ? 'w-full opacity-100' : 'w-0 opacity-0 overflow-hidden'
              }`}
          />
        </div>
      </form>

      {/* Live Search Results Dropdown */}
      {isExpanded && query.trim().length >= 2 && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden backdrop-blur-lg bg-opacity-95">
          {loading ? (
            <div className="p-4 text-center text-gray-400 text-sm">Searching...</div>
          ) : results.length > 0 ? (
            <ul className="py-2">
              {results.map((item) => (
                <li key={`${item.type}-${item.id}`}>
                  <Link
                    to={`/${item.type === 'movie' ? 'movie' : 'tv'}/${item.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition"
                    onClick={handleResultClick}
                  >
                    <img
                      src={item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : 'https://via.placeholder.com/92x138?text=No+Image'}
                      alt={item.title || item.name}
                      className="w-10 h-14 rounded object-cover bg-gray-800"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{item.title || item.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                        <span className="uppercase tracking-wider text-[10px] border border-gray-600 px-1 rounded">{item.type}</span>
                        <span>{(item.release_date || item.first_air_date)?.slice(0, 4)}</span>
                        <span className="flex items-center gap-1 text-yellow-500">
                          ★ {item.vote_average?.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
              <li className="border-t border-gray-700 mt-1 pt-1">
                <button
                  onClick={handleSubmit}
                  className="w-full text-center py-2 text-sm text-blue-400 hover:text-blue-300 transition"
                >
                  See all results for "{query}"
                </button>
              </li>
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-400 text-sm">No results found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
