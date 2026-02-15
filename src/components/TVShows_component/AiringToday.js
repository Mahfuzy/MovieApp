import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from '../Buttons/FavoritesButton';
import WatchListButton from '../Buttons/WatchlistButton';
import Loader from '../Buttons/Loader';

const AiringTodayTVShows = () => {
  const [tvShows, setTVShows] = useState([]);
  const [page, setPage] = useState(1);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setIsPending(true);
    fetch(`https://api.themoviedb.org/3/tv/airing_today?page=${page}&api_key=${process.env.REACT_APP_API_KEY}`)
      .then(res => { if (!res.ok) throw new Error('Failed to fetch'); return res.json(); })
      .then(data => setTVShows(data.results))
      .catch(err => console.error(err))
      .finally(() => setIsPending(false));
    window.scrollTo(0, 0);
  }, [page]);

  if (isPending) return <div className="flex items-center justify-center min-h-screen bg-gray-900 pt-20"><Loader /></div>;

  return (
    <div className="bg-gray-900 min-h-screen text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Airing Today</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {tvShows.map(show => (
            <div key={show.id} className="group">
              <Link to={`/tv/${show.id}`} className="block">
                <div className="relative rounded-lg overflow-hidden bg-gray-800">
                  <img
                    src={show.poster_path ? `https://image.tmdb.org/t/p/w342${show.poster_path}` : 'https://via.placeholder.com/342x513?text=No+Image'}
                    alt={show.name}
                    className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center gap-1 text-xs text-gray-300">
                      <span className="text-yellow-400">★</span> {show.vote_average?.toFixed(1)}
                      <span className="ml-1">{show.first_air_date?.slice(0, 4)}</span>
                    </div>
                  </div>
                </div>
              </Link>
              <div className="mt-2">
                <p className="text-sm font-medium truncate">{show.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <FavoriteButton movieId={show.id} media_type={'tv'} />
                  <WatchListButton movieId={show.id} media_type={'tv'} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-3 mt-10">
          {page > 1 && (
            <button className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm transition" onClick={() => setPage(page - 1)}>← Previous</button>
          )}
          <span className="text-sm text-gray-400">Page {page}</span>
          {tvShows.length > 0 && (
            <button className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm transition" onClick={() => setPage(page + 1)}>Next →</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiringTodayTVShows;
