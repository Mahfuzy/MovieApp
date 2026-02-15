import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loader from '../Buttons/Loader';

const SearchResults = () => {
  const { query } = useParams();
  const [results, setResults] = useState({ movies: [], tvShows: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      const apiKey = process.env.REACT_APP_API_KEY;

      try {
        const [movieRes, tvRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&query=${encodeURIComponent(query)}&api_key=${apiKey}`),
          fetch(`https://api.themoviedb.org/3/search/tv?include_adult=false&language=en-US&page=1&query=${encodeURIComponent(query)}&api_key=${apiKey}`),
        ]);

        if (!movieRes.ok || !tvRes.ok) throw new Error('Failed to fetch search results');

        const [movieData, tvData] = await Promise.all([movieRes.json(), tvRes.json()]);

        setResults({
          movies: movieData.results || [],
          tvShows: tvData.results || [],
        });
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to fetch search results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-900 pt-20"><Loader /></div>;

  const CardGrid = ({ items, type }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map(item => (
        <div key={item.id} className="group">
          <Link to={`/${type}/${item.id}`} className="block">
            <div className="relative rounded-lg overflow-hidden bg-gray-800">
              <img
                src={item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : 'https://via.placeholder.com/342x513?text=No+Image'}
                alt={item.title || item.name}
                className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="flex items-center gap-1 text-xs text-gray-300">
                  <span className="text-yellow-400">★</span> {item.vote_average?.toFixed(1)}
                  <span className="ml-1">{(item.release_date || item.first_air_date)?.slice(0, 4)}</span>
                </div>
              </div>
            </div>
          </Link>
          <p className="text-sm font-medium truncate mt-2">{item.title || item.name}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-gray-900 min-h-screen text-white pt-20">
      <div className="container mx-auto px-4 py-8 space-y-12">
        <h1 className="text-2xl font-bold mb-8">Search Results for "{query}"</h1>

        {error && <p className="text-red-400 text-center">{error}</p>}

        {!loading && !error && results.movies.length === 0 && results.tvShows.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No results found for "{query}"</p>
            <p className="text-sm mt-2">Try checking your spelling or using different keywords.</p>
          </div>
        )}

        {results.movies.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Movies</h2>
              <span className="text-xs text-gray-400 uppercase tracking-wider">{results.movies.length} Results</span>
            </div>
            <CardGrid items={results.movies} type="movie" />
          </section>
        )}

        {results.tvShows.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">TV Shows</h2>
              <span className="text-xs text-gray-400 uppercase tracking-wider">{results.tvShows.length} Results</span>
            </div>
            <CardGrid items={results.tvShows} type="tv" />
          </section>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
