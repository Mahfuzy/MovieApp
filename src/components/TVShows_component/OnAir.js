import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from '../Buttons/FavoritesButton';
import WatchListButton from '../Buttons/WatchlistButton';
import Loader from '../Buttons/Loader';

const OnAirTVShows = () => {
    const [tvShows, setTVShows] = useState([]);
    const [page, setPage] = useState(1);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        fetchOnAirTVShows();
    }, [page]);

    const fetchOnAirTVShows = () => {
        setIsPending(true);
        fetch(`https://api.themoviedb.org/3/tv/on_the_air?&page=${page}&api_key=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json())
            .then(data => {
                setTVShows(data.results);
            })
            .catch(error => console.error('Error fetching on air TV shows:', error))
            .finally(() => {
                setIsPending(false);
            });
    };
    
    const prevPage = () => {
        setPage(page - 1);
    };

    const nextPage = () => {
        setPage(page + 1);
    };

    return (
        <div className="bg-gray-900 min-h-screen">
            {isPending && <Loader />}
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold text-center text-white mb-8">On Air TV Shows</h1>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {tvShows.map(tvShow => (
                        <li key={tvShow.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                            <Link to={`/tv/${tvShow.id}`}>
                                <img src={`https://image.tmdb.org/t/p/w500/${tvShow.poster_path}`} alt={tvShow.name} className="w-full h-auto hover:opacity-80 transition-opacity duration-300" />
                            </Link>
                            <div className="p-4">
                                <p className="text-white text-lg font-semibold truncate">{tvShow.name}</p>
                                <div className="flex justify-center mt-4">
                                    <FavoriteButton movieId={tvShow.id} media_type="tv" />
                                    <WatchListButton movieId={tvShow.id} media_type="tv" />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-center mt-8">
                    {page > 1 && (
                        <button className="bg-gray-800 text-white py-2 px-4 rounded mx-4" onClick={prevPage}>Previous Page</button>
                    )}
                    {tvShows.length > 0 && (
                        <button className="bg-gray-800 text-white py-2 px-4 rounded mx-4" onClick={nextPage}>Next Page</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnAirTVShows;
