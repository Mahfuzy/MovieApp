import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from '../Buttons/FavoritesButton';
import WatchListButton from '../Buttons/WatchlistButton';

const TopRatedTVShows = () => {
    const [tvShows, setTVShows] = useState([]);
    const [page, setPage] = useState(1);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        const fetchTopRatedTVShows = () => {
            setIsPending(true);
            fetch(`https://api.themoviedb.org/3/tv/top_rated?&page=${page}&api_key=${process.env.REACT_APP_API_KEY}`)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    setTVShows(data.results);
                })
                .catch(error => console.error('Error fetching top rated TV shows:', error))
                .finally(() => {
                    setTimeout(() => {
                        setIsPending(false);
                    }, 100);
                });
        };
        fetchTopRatedTVShows();
    }, [page]);

    const prevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const nextPage = () => {
        setPage(page + 1);
    };

    return (
        <div className="text-white bg-slate-900 min-h-screen py-8">
            {isPending && <div className="loader-container"><div className="loader"></div></div>}
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8">Top Rated TV Shows</h1>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {tvShows.map(tvShow => (
                        <li key={tvShow.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <Link to={`/tv/${tvShow.id}`}>
                                <figure className="relative">
                                    <img src={`https://image.tmdb.org/t/p/w500/${tvShow.poster_path}`} alt={tvShow.name} className="w-full h-72 object-cover transition-transform transform hover:scale-105 duration-300" />
                                    <figcaption className="absolute bottom-0 bg-gradient-to-t from-black to-transparent text-white p-2 w-full">
                                        <p className="text-lg font-semibold">{tvShow.name}</p>
                                    </figcaption>
                                </figure>
                            </Link>
                            <div className="flex justify-around items-center p-2">
                                <FavoriteButton movieId={tvShow.id} media_type={'tv'} />
                                <WatchListButton movieId={tvShow.id} media_type={'tv'} />
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-center mt-8">
                    {page > 1 && (
                        <button className="bg-gray-800 text-white py-2 px-4 rounded mx-2 hover:bg-gray-700 transition duration-300" onClick={prevPage}>Previous Page</button>
                    )}
                    {tvShows.length > 0 && (
                        <button className="bg-gray-800 text-white py-2 px-4 rounded mx-2 hover:bg-gray-700 transition duration-300" onClick={nextPage}>Next Page</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopRatedTVShows;
