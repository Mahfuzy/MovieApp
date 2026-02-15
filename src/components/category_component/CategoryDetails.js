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
        <div className="text-white bg-slate-900 min-h-screen pt-24">
            {loading ? (
                <Loader />
            ) : error ? (
                <p className="text-red-500 text-center py-8">{error}</p>
            ) : (
                <>
                    <div className="container mx-auto px-4 py-8">
                        <h2 className="text-xl font-bold mb-4">Movies</h2>
                        {movieItems.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {movieItems.map(item => (
                                    <div key={item.id} className="group">
                                        <Link to={`/movie/${item.id}`} className="block">
                                            <div className="relative rounded-lg overflow-hidden bg-gray-800">
                                                <img
                                                    src={item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : 'https://via.placeholder.com/342x513?text=No+Image'}
                                                    alt={item.title}
                                                    className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <div className="flex items-center gap-1 text-xs text-gray-300">
                                                        <span className="text-yellow-400">★</span> {item.vote_average?.toFixed(1)}
                                                        <span className="ml-1">{item.release_date?.slice(0, 4)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                        <div className="mt-2">
                                            <p className="text-sm font-medium truncate">{item.title}</p>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">No movies found in this genre.</p>
                        )}

                        <h2 className="text-xl font-bold mb-4 mt-8">TV Shows</h2>
                        {tvItems.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {tvItems.map(item => (
                                    <div key={item.id} className="group">
                                        <Link to={`/tv/${item.id}`} className="block">
                                            <div className="relative rounded-lg overflow-hidden bg-gray-800">
                                                <img
                                                    src={item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : 'https://via.placeholder.com/342x513?text=No+Image'}
                                                    alt={item.name}
                                                    className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <div className="flex items-center gap-1 text-xs text-gray-300">
                                                        <span className="text-yellow-400">★</span> {item.vote_average?.toFixed(1)}
                                                        <span className="ml-1">{item.first_air_date?.slice(0, 4)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                        <div className="mt-2">
                                            <p className="text-sm font-medium truncate">{item.name}</p>

                                        </div>
                                    </div>
                                ))}
                            </div>
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
            )
            }
        </div >
    );
};

export default CategoryDetails;
