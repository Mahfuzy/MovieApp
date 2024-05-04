import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TvShows = () => {
    const [shows, setShows] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchTvShows();
    });

    const fetchTvShows = () => {
        fetch(`https://api.themoviedb.org/3/discover/tv?api_key=6a5902d7453bd8f30c5b9881d0fc6aca&page=${page}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setShows(data.results);
                setSearchResults(data.results);
            })
            .catch(error => console.error('Error fetching TV shows:', error));
    };

    const handleSearch = (query) => {
        const filteredShows = shows.filter(show =>
            show.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredShows);
    };

    const prevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const nextPage = () => {
        setPage(page + 1);
    };

    return (
        <div className='text-white bg-slate-900'>  
            <div className="container">
                <ul className='grid grid-cols-5 gap-4'>
                    {searchResults.map(show => (
                        <Link to={`/shows/${show.id}`} key={show.id}>
                            <li className='m-2 rounded-lg'>
                                <figure className='relative overflow-hidden'>
                                    <img src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`} alt={show.name} className='w-[278px] rounded-lg h-[300px] hover:scale-[1.3] transition ease-in-out hover:duration-500'  />
                                </figure>
                                <p  className='block mt-2 text-center font-bold'>{show.name}</p>
                            </li>
                        </Link>
                    ))}
                </ul>
                <div className="flex justify-center my-4">
                    {page > 1 && (
                        <button className="bg-gray-800 text-white py-2 px-4 rounded mx-4" onClick={prevPage}>Previous Page</button>
                    )}
                    {shows.length > 0 && (
                        <button className="bg-gray-800 text-white py-2 px-4 rounded mx-4" onClick={nextPage}>Next Page</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TvShows;
