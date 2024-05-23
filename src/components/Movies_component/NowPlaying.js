import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from '../Buttons/FavoritesButton';
import WatchListButton from '../Buttons/WatchlistButton';
import Loader from '../Buttons/Loader'; // Import Loader component for loading indicator

const NowPlayingMovies = () => {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNowPlayingMovies();
    }, [page]);

    const fetchNowPlayingMovies = () => {
        setIsPending(true);
        fetch(`https://api.themoviedb.org/3/movie/now_playing?&page=${page}&api_key=${process.env.REACT_APP_API_KEY}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch now playing movies');
                }
                return res.json();
            })
            .then(data => {
                setMovies(data.results);
            })
            .catch(error => {
                console.error('Error fetching now playing movies:', error);
                setError('Failed to fetch now playing movies. Please try again later.');
            })
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
        <div className='text-white bg-slate-900'>
            {isPending && <Loader />} {/* Display loader while loading */}
            {error && <p className="text-red-500">{error}</p>} {/* Display error message if there's an error */}
            <div className="container">
                <ul className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                    {movies && movies.map(movie => (
                        <div key={movie.id}>
                            <Link to={`/movie/${movie.id}`} key={movie.id}>
                                <li className='m-2 rounded-lg'>
                                    <figure className='relative overflow-hidden'>
                                        <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} className='w-full h-auto rounded-lg hover:scale-[1.1] transition duration-300' />
                                    </figure>
                                    <p className='block mt-2 text-center font-bold'>{movie.title}</p>
                                </li>
                            </Link>
                            <div className="flex justify-center">
                                <FavoriteButton movieId={movie.id} media_type={'movie'}/>
                                <WatchListButton movieId={movie.id} media_type={'movie'}/>
                            </div>
                        </div>
                    ))}
                </ul>
                <div className="flex justify-center mt-4">
                    {page > 1 && (
                        <button className="bg-gray-800 text-white py-2 px-4 rounded mx-4" onClick={prevPage}>Previous Page</button>
                    )}
                    {movies.length > 0 && (
                        <button className="bg-gray-800 text-white py-2 px-4 rounded mx-4" onClick={nextPage}>Next Page</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NowPlayingMovies;
