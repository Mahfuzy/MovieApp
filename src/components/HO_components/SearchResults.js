import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const SearchResults = () => {
  const { query } = useParams();
  const [movieResults, setMovieResults] = useState([]);
  const [tvShowResults, setTvShowResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_API_KEY;
    setLoading(true);
    setError(null);

    const fetchResults = async () => {
      try {
        const movieResponse = await fetch(
          `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&query=${encodeURIComponent(query)}&api_key=${apiKey}`
        );

        if (!movieResponse.ok) {
          throw new Error('Failed to fetch movie search results');
        }

        const movieData = await movieResponse.json();
        setMovieResults(movieData.results || []);

        const tvShowResponse = await fetch(
          `https://api.themoviedb.org/3/search/tv?include_adult=false&language=en-US&page=1&query=${encodeURIComponent(query)}&api_key=${apiKey}`
        );

        if (!tvShowResponse.ok) {
          throw new Error('Failed to fetch TV show search results');
        }

        const tvShowData = await tvShowResponse.json();
        setTvShowResults(tvShowData.results || []);

      } catch (error) {
        console.error('Error fetching search results:', error);
        setError('Failed to fetch search results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {movieResults.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-2">Movies</h2>
              <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {movieResults.map((result) => (
                  <li key={result.id} className="bg-white p-4 rounded-lg shadow-md">
                    <Link to={`/movie/${result.id}`} className="block">
                    <img
                      src={
                        result.poster_path
                          ? `https://image.tmdb.org/t/p/w500/${result.poster_path}`
                          : 'https://via.placeholder.com/500x750?text=No+Image'
                      }
                      alt={result.title}
                      className="w-full h-auto rounded-md mb-2"
                    />
                    <p className="text-lg font-semibold">{result.title}</p>
                    </Link>
                    
                  </li>
                ))}
              </ul>
            </>
          )}
          {tvShowResults.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mt-8 mb-2">TV Shows</h2>
              <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tvShowResults.map((result) => (
                  <li key={result.id} className="bg-white p-4 rounded-lg shadow-md">
                    <Link to={`/tv/${result.id}`} className="block">
                    <img
                      src={
                        result.poster_path
                          ? `https://image.tmdb.org/t/p/w500/${result.poster_path}`
                          : 'https://via.placeholder.com/500x750?text=No+Image'
                      }
                      alt={result.name}
                      className="w-full h-auto rounded-md mb-2"
                    />
                    <p className="text-lg font-semibold">{result.name}</p>
                    
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          {movieResults.length === 0 && tvShowResults.length === 0 && (
            <p>No search results found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
