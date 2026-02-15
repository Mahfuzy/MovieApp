import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../Buttons/Loader";

const Categories = () => {
    const [movieGenres, setMovieGenres] = useState([]);
    const [tvGenres, setTvGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGenres = async () => {
            setLoading(true);
            setError(null);
            try {
                const [movieRes, tvRes] = await Promise.all([
                    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_API_KEY}`),
                    fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.REACT_APP_API_KEY}`),
                ]);

                if (!movieRes.ok || !tvRes.ok) throw new Error('Failed to fetch genres');

                const [movieData, tvData] = await Promise.all([
                    movieRes.json(),
                    tvRes.json(),
                ]);

                setMovieGenres(movieData.genres || []);
                setTvGenres(tvData.genres || []);
            } catch (err) {
                console.error('Error fetching genres:', err);
                setError('Failed to fetch genres. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();
    }, []);

    return (
        <div className="bg-gray-900 min-h-screen text-white pt-24 pb-8">
            <div className="container mx-auto px-4">
                {loading ? (
                    <Loader />
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-xl font-bold mb-4">Movie Genres</h2>
                            <ul className="space-y-3">
                                {movieGenres.length > 0 ? (
                                    movieGenres.map((genre) => (
                                        <li key={genre.id} className="bg-gray-800 p-4 rounded-lg shadow-lg hover:bg-gray-700 transition">
                                            <Link to={`/categories/${genre.id}`} className="block">{genre.name}</Link>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-400">No movie genres found</li>
                                )}
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-4">TV Show Genres</h2>
                            <ul className="space-y-3">
                                {tvGenres.length > 0 ? (
                                    tvGenres.map((genre) => (
                                        <li key={genre.id} className="bg-gray-800 p-4 rounded-lg shadow-lg hover:bg-gray-700 transition">
                                            <Link to={`/categories/${genre.id}`} className="block">{genre.name}</Link>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-400">No TV show genres found</li>
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
