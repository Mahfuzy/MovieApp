import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../Buttons/Loader";

const CategoryDetails = () => {
    const { genre } = useParams();
    const [loading, setLoading] = useState(true);
    const [movieItems, setMovieItems] = useState([]);
    const [tvItems, setTvItems] = useState([]);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            setError(null);
            try {
                const [movieRes, tvRes] = await Promise.all([
                    fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genre}&page=${page}&api_key=${process.env.REACT_APP_API_KEY}`),
                    fetch(`https://api.themoviedb.org/3/discover/tv?with_genres=${genre}&page=${page}&api_key=${process.env.REACT_APP_API_KEY}`),
                ]);

                if (!movieRes.ok || !tvRes.ok) throw new Error('Failed to fetch items');

                const [movieData, tvData] = await Promise.all([
                    movieRes.json(),
                    tvRes.json(),
                ]);

                setMovieItems(movieData.results || []);
                setTvItems(tvData.results || []);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch content. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [genre, page]);

    const prevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const nextPage = () => {
        setPage(page + 1);
    };

    return (
        <div className="text-white bg-slate-900 min-h-screen">
            {loading ? (
                <Loader />
            ) : error ? (
                <p className="text-red-500 text-center py-8">{error}</p>
            ) : (
                <>
                    <div className="container mx-auto px-4 py-8">
                        <h2 className="text-xl font-bold mb-4">Movies</h2>
                        {movieItems.length > 0 ? (
                            <ul className="px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {movieItems.map(item => (
                                    <div key={item.id}>
                                        <Link to={`/movie/${item.id}`}>
                                            <figure className="relative overflow-hidden">
                                                <img
                                                    src={item.poster_path ? `https://image.tmdb.org/t/p/w500/${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                                                    alt={item.title}
                                                    className='w-full h-auto rounded-lg aspect-[2/3] object-cover hover:scale-105 transition ease-in-out duration-300'
                                                />
                                            </figure>
                                            <p className='mt-2 text-sm'>{item.title}</p>
                                        </Link>
                                    </div>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400">No movies found in this genre.</p>
                        )}

                        <h2 className="text-xl font-bold mb-4 mt-8">TV Shows</h2>
                        {tvItems.length > 0 ? (
                            <ul className="px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {tvItems.map(item => (
                                    <div key={item.id}>
                                        <Link to={`/tv/${item.id}`}>
                                            <figure className="relative overflow-hidden">
                                                <img
                                                    src={item.poster_path ? `https://image.tmdb.org/t/p/w500/${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                                                    alt={item.name}
                                                    className='w-full h-auto rounded-lg aspect-[2/3] object-cover hover:scale-105 transition ease-in-out duration-300'
                                                />
                                            </figure>
                                            <p className='mt-2 text-sm'>{item.name}</p>
                                        </Link>
                                    </div>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400">No TV shows found in this genre.</p>
                        )}
                    </div>
                    <div className="flex justify-center py-4">
                        {page > 1 && (
                            <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded mx-2 transition" onClick={prevPage}>Previous Page</button>
                        )}
                        {(movieItems.length > 0 || tvItems.length > 0) && (
                            <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded mx-2 transition" onClick={nextPage}>Next Page</button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default CategoryDetails;
