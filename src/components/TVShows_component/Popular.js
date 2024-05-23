import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from '../Buttons/FavoritesButton';
import WatchListButton from '../Buttons/WatchlistButton';
import Loader from '../Buttons/Loader';

const PopularTVShows = () => {
    const [tvShows, setTVShows] = useState([]);
    const [page, setPage] = useState(1);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        fetchPopularTVShows();
    }, [page]);

    const fetchPopularTVShows = () => {
        setIsPending(true);
        fetch(`https://api.themoviedb.org/3/tv/popular?&page=${page}&api_key=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json())
            .then(data => {
                setTVShows(data.results);
            })
            .catch(error => console.error('Error fetching popular TV shows:', error))
            .finally(() => {
                setTimeout(() => {
                    setIsPending(false);
                }, 100);
            });
    };
    
    const prevPage = () => {
        setPage(page - 1);
    };

    const nextPage = () => {
        setPage(page + 1);
    };

    return (
        <div className='bg-gray-900 text-white min-h-screen'>
            {isPending && <Loader />}
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8">Popular TV Shows</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {tvShows.map(tvShow => (
                        <div key={tvShow.id} className="relative">
                            <Link to={`/tv/${tvShow.id}`}>
                                <img
                                    src={`https://image.tmdb.org/t/p/w500/${tvShow.poster_path}`}
                                    alt={tvShow.name}
                                    className="rounded-lg w-full h-auto transition duration-300 transform hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-70 transition-opacity duration-300"></div>
                                <div className="absolute bottom-0 left-0 p-4">
                                    <p className="text-lg font-semibold">{tvShow.name}</p>
                                </div>
                            </Link>
                            <div className="absolute top-2 right-2">
                                <FavoriteButton movieId={tvShow.id} media_type="tv" />
                                <WatchListButton movieId={tvShow.id} media_type="tv" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-8">
                    {page > 1 && (
                        <button className="bg-gray-800 text-white py-2 px-4 rounded mx-2" onClick={prevPage}>Previous Page</button>
                    )}
                    {tvShows.length > 0 && (
                        <button className="bg-gray-800 text-white py-2 px-4 rounded mx-2" onClick={nextPage}>Next Page</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PopularTVShows;
