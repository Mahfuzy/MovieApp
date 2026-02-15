import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../Buttons/Loader';

const WatchListPage = () => {
    const [watchListMovies, setWatchListMovies] = useState([]);
    const [watchListTVShows, setWatchListTVShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWatchlist = async () => {
            setLoading(true);
            setError(null);
            const token = process.env.REACT_APP_TMDB_TOKEN;
            const accountId = process.env.REACT_APP_TMDB_ACCOUNT_ID || '21231805';

            if (!token) {
                setError('TMDB token not configured. Please set REACT_APP_TMDB_TOKEN.');
                setLoading(false);
                return;
            }

            try {
                const [moviesRes, tvRes] = await Promise.all([
                    fetch(`https://api.themoviedb.org/3/account/${accountId}/watchlist/movies?language=en-US&page=1&sort_by=created_at.asc`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`https://api.themoviedb.org/3/account/${accountId}/watchlist/tv?language=en-US&page=1&sort_by=created_at.asc`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                if (!moviesRes.ok || !tvRes.ok) throw new Error('Failed to fetch watchlist');

                const [moviesData, tvData] = await Promise.all([moviesRes.json(), tvRes.json()]);
                setWatchListMovies(Array.isArray(moviesData.results) ? moviesData.results : []);
                setWatchListTVShows(Array.isArray(tvData.results) ? tvData.results : []);
            } catch (err) {
                console.error('Error fetching watchlist:', err);
                setError('Failed to fetch watchlist. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchWatchlist();
    }, []);

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
                {error && <p className="text-red-400 text-center text-sm">{error}</p>}

                <section>
                    <h1 className="text-2xl font-bold mb-6">Watchlist Movies</h1>
                    {watchListMovies.length === 0 ? (
                        <p className="text-gray-500 text-sm">No movies in your watchlist yet. Add some from movie detail pages!</p>
                    ) : (
                        <CardGrid items={watchListMovies} type="movie" />
                    )}
                </section>

                <section>
                    <h1 className="text-2xl font-bold mb-6">Watchlist TV Shows</h1>
                    {watchListTVShows.length === 0 ? (
                        <p className="text-gray-500 text-sm">No TV shows in your watchlist yet. Add some from TV show detail pages!</p>
                    ) : (
                        <CardGrid items={watchListTVShows} type="tv" />
                    )}
                </section>
            </div>
        </div>
    );
};

export default WatchListPage;
