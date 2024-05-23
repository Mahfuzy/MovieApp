import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Categories = () => {
    const [movieGenres, setMovieGenres] = useState([]);
    const [tvGenres, setTvGenres] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMovieGenres();
        fetchTvGenres();
    }, []);

    const fetchMovieGenres = () => {
        fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_API_KEY}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch movie genres');
                }
                return response.json();
            })
            .then((data) => {
                setMovieGenres(data.genres);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching movie genres:', error);
                setLoading(false);
            });
    };

    const fetchTvGenres = () => {
        fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.REACT_APP_API_KEY}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch TV genres');
                }
                return response.json();
            })
            .then((data) => {
                setTvGenres(data.genres);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching TV genres:', error);
                setLoading(false);
            });
    };

    return (
        <div>
            <div className="container mx-auto px-4 py-8">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-xl font-bold mb-4">Movie Genres</h2>
                            <ul className="text-white space-y-4">
                                {movieGenres.length > 0 ? (
                                    movieGenres.map((genre) => (
                                        <li key={genre.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                                            <Link to={`/categories/${genre.id}`}>{genre.name}</Link>
                                        </li>
                                    ))
                                ) : (
                                    <li>No movie genres found</li>
                                )}
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-4">TV Show Genres</h2>
                            <ul className="text-white space-y-4">
                                {tvGenres.length > 0 ? (
                                    tvGenres.map((genre) => (
                                        <li key={genre.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                                            <Link to={`/categories/${genre.id}`}>{genre.name}</Link>
                                        </li>
                                    ))
                                ) : (
                                    <li>No TV show genres found</li>
                                )}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;
