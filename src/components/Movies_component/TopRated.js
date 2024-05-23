import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from '../Buttons/FavoritesButton';
import WatchListButton from '../Buttons/WatchlistButton';

const TopRatedMovies = () => {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        fetchTopRatedMovies();
    }, [page]);

    const fetchTopRatedMovies = () => {
        setIsPending(true);
        fetch(`https://api.themoviedb.org/3/movie/top_rated?&page=${page}&api_key=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setMovies(data.results);
            })
            .catch(error => console.error('Error fetching top rated movies:', error))
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
        <div className='text-white bg-slate-900'>
            {isPending && <div className="loader-container"><div className="loader"></div></div>}
            <div className="container">
                <ul className='grid grid-cols-5 gap-4'>
                    {movies && movies.map(movie => (
                        <div>
                            <Link to={`/movie/${movie.id}`} key={movie.id}>
                                <li className='m-2 rounded-lg'>
                                    <figure className='relative overflow-hidden'>
                                        <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} className='w-[278px] rounded-lg h-[300px] hover:scale-[1.3] transition ease-in-out hover:duration-500'  />
                                    </figure>
                                    <p  className='block mt-2 text-center font-bold'>{movie.title}</p>
                                </li>
                            </Link>
                            <FavoriteButton movieId={movie.id} media_type={'movie'}/>
                            <WatchListButton movieId={movie.id} media_type={'movie'}/>
                        </div>
                        
                    ))}
                </ul>
                <div className="flex justify-center mt-4">
                    {page > 1 && (
                        <Link to={`/top-rated?page=${page - 1}`}>
                            <button className="bg-gray-800 text-white py-2 px-4 rounded mx-4" onClick={prevPage}>Previous Page</button>
                        </Link>
                    )}
                    {movies.length > 0 && (
                        <Link to={`/top-rated?page=${page + 1}`}>
                            <button className="bg-gray-800 text-white py-2 px-4 rounded mx-4"  onClick={nextPage}>Next Page</button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopRatedMovies;
