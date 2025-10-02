import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const CategoryDetails = () => {
    const { genre } = useParams();
    const [loading, setLoading] = useState(false);
    const [movieItems, setMovieItems] = useState([]);
    const [tvItems, setTvItems] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setLoading(true);
        const fetchItems = (category) => {
            fetch(`https://api.themoviedb.org/3/discover/${category}?with_genres=${genre}&page=${page}&api_key=${process.env.REACT_APP_API_KEY}`)
                .then(response => response.json())
                .then((data) => {
                    if (category === 'movie') {
                        setMovieItems(data.results);
                    } else {
                        setTvItems(data.results);
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setLoading(false);
                });
        };
        fetchItems('movie');
        fetchItems('tv');
    }, [genre, page]); // Listen for changes in genre and page

    const prevPage = () => {
        setPage(page - 1);
    };

    const nextPage = () => {
        setPage(page + 1);
    };

    return (
        <div className="text-white bg-slate-900">
            {loading ? (
                <p className="text-center text-white">Loading...</p>
            ) : (
                <>
                    <div className="container mx-auto px-4 py-8">
                        <h2 className="text-xl font-bold mb-4">Movies</h2>
                        <ul className="px-4 grid grid-cols-5 md:grid-cols-3 lg:grid-cols-5 gap-y-20 gap-x-6">
                            {movieItems.map(item => (
                                <div key={item.id}>
                                    <Link to={`/movie/${item.id}`} >
                                        <figure className="relative overflow-hidden">
                                            <img src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`} alt={item.title} className='w-full h-auto rounded-sm hover:scale-[1.3] transition-all ease-in-out duration-300' />
                                        </figure>
                                        <p className='mt-4'>{item.title}</p>
                                    </Link>
                                </div>
                            ))}
                        </ul>
                        <h2 className="text-xl font-bold mb-4 mt-8">TV Shows</h2>
                        <ul className="px-4 grid grid-cols-5 md:grid-cols-3 lg:grid-cols-5 gap-y-20 gap-x-6">
                            {tvItems.map(item => (
                                <div key={item.id}>
                                    <Link to={`/tv/${item.id}`} >
                                        <figure className="relative overflow-hidden">
                                            <img src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`} alt={item.name} className='w-full h-auto rounded-sm hover:scale-[1.3] transition-all ease-in-out duration-300' />
                                        </figure>
                                        <p className='mt-4'>{item.name}</p>
                                    </Link>
                                </div>
                            ))}
                        </ul>
                    </div>
                    <div className="flex justify-center mt-4">
                        {page > 1 && (
                            <button className="bg-gray-800 text-white py-2 px-4 rounded mx-4" onClick={prevPage}>Previous Page</button>
                        )}
                        {(movieItems.length > 0 || tvItems.length > 0) && (
                            <button className="bg-gray-800 text-white py-2 px-4 rounded mx-4" onClick={nextPage}>Next Page</button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default CategoryDetails;
