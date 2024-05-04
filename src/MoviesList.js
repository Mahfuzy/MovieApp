import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MoviesList = () => {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [Ispending, setIsPending] = useState(false);

    useEffect(() => {
        fetchMovies();
    }, [page]);

    const fetchMovies = () => {
        setIsPending(true); // Set pending to true before the fetch request
        fetch(`https://api.themoviedb.org/3/discover/movie?&page=${page}&sort_by=popularity.desc&api_key=6a5902d7453bd8f30c5b9881d0fc6aca`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setMovies(data.results);
            })
            .catch(error => console.error('Error fetching movies:', error))
            .finally(() => {
                setTimeout(() => {
                    setIsPending(false); // Set pending to false after a minimal delay
                }, 100); // 100 milliseconds delay
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
            {Ispending && <div className="loader-container"><div className="loader"></div></div>}
            <div className="container">
                <ul className='grid grid-cols-5 gap-4'>
                    {movies.map(movie => (
                        <Link to={`/movies/${movie.id}`} key={movie.id}>
                            <li className='m-2 rounded-lg'>
                                <figure className='relative overflow-hidden'>
                                    <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} className='w-[278px] rounded-lg h-[300px] hover:scale-[1.3] transition ease-in-out hover:duration-500'  />
                                </figure>
                                <p  className='block mt-2 text-center font-bold'>{movie.title}</p>
                            </li>
                        </Link>
                    ))}
                </ul>
                <div className="flex justify-center mt-4">
                    {page > 1 && (
                        <Link to={`/movies?page=${page - 1}`}>
                            <button className="bg-gray-800 text-white py-2 px-4 rounded mx-4" onClick={prevPage}>Previous Page</button>
                        </Link>
                    )}
                    {movies.length > 0 && (
                        <Link to={`/movies?page=${page + 1}`}>
                            <button className="bg-gray-800 text-white py-2 px-4 rounded mx-4"  onClick={nextPage}>Next Page</button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MoviesList;
