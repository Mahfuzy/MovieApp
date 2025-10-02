import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const WatchListPage = () => {
    const [watchListMovies, setWatchListMovies] = useState([]);
    const [watchListTVShows, setWatchListTVShows] = useState([]);

    useEffect(() => {
        fetchWatchListMovies();
        fetchWatchListTVShows();
    }, []);

    const fetchWatchListMovies = () => {
        fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.REACT_APP_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            setWatchListMovies(Array.isArray(data.results) ? data.results : []);
        })
        .catch(error => console.error('Error fetching watchlist movies:', error));
    };

    const fetchWatchListTVShows = () => {
        fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.REACT_APP_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            setWatchListTVShows(Array.isArray(data.results) ? data.results : []);
        })
        .catch(error => console.error('Error fetching watchlist TV shows:', error));
    };

    return (
        <div className="flex flex-col items-center px-4 py-8 space-y-8">
            <section className="w-full">
                <h1 className="text-xl font-bold mb-4">Watchlist Movies</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {watchListMovies.map(movie => (
                        <div key={movie.id} className="flex flex-col shadow-md rounded overflow-hidden">
                            <Link to={`/movie/${movie.id}`}>
                            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} className="w-full h-auto" />
                            <div className="p-4">
                                <h2 className="font-semibold">{movie.title}</h2>
                                <p className="mt-2 text-sm text-gray-600">{movie.overview}</p>
                            </div>
                            </Link>
                            
                        </div>
                    ))}
                </div>
            </section>

            <section className="w-full">
                <h1 className="text-xl font-bold mb-4">Watchlist TV Shows</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {watchListTVShows.map(show => (
                        <div key={show.id} className="flex flex-col shadow-md rounded overflow-hidden">
                            <Link to={`/tv/${show.id}`}>
                            <img src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`} alt={show.name} className="w-full h-auto" />
                            <div className="p-4">
                                <h2 className="font-semibold">{show.name}</h2>
                                <p className="mt-2 text-sm text-gray-600">{show.overview}</p>
                            </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default WatchListPage;
