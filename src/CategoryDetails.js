import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SearchBar from "./SearchBar";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const CategoryDetails = () => {
    const { genre } = useParams();
    const [loading, setLoading] = useState(false);
    const [movies, setMovies] = useState([]); // Initialize movies state with an empty array
    const [searchResults, setSearchResults] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setLoading(true); // Set loading state to true when fetching data

        fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genre}&page=${page}&api_key=6a5902d7453bd8f30c5b9881d0fc6aca`)
            .then(response => response.json())
            .then((data) => {
                setMovies(data.results);
                setLoading(false); // Set loading state to false after data is fetched
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, [genre, page]);

    const handleSearch = (query) => {
        const filteredMovies = movies.filter(movie =>
            movie.title.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredMovies);
    };

    const prevPage = () => {
        setPage(page - 1);
    };

    const nextPage = () => {
        setPage(page + 1);
    };


    return (
        <div className="text-white bg-slate-900">
            <ul className="px-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-y-20 gap-x-6">
                {(searchResults.length > 0 ? searchResults : movies).map(movie => (
                    <div key={movie.id}>
                        <Link to={`/movies/${movie.id}`} >
                        <figure className="relative overflow-hidden">
                            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} className='w-full h-[250px] rounded-sm hover:scale-[1.3] transition-all ease-in-out duration-300' />
                        </figure>
                            <p className='mt-4'>{movie.title}</p>
                        </Link>
                        <p className="my-1">Year: {movie.release_date}</p>
                    </div>
                ))}
            </ul>
            <div className="flex justify-center mt-4">
                    {page > 1 && (
                        <Link to={`/categories/${genre}?page=${page - 1}`}>
                            <button className="bg-gray-800 text-white py-2 px-4 rounded mx-4" onClick={prevPage}>Previous Page</button>
                        </Link>
                    )}
                    {movies.length > 0 && (
                        <Link to={`/categories/${genre}?page=${page + 1}`}>
                            <button className="bg-gray-800 text-white py-2 px-4 rounded mx-4"  onClick={nextPage}>Next Page</button>
                        </Link>
                    )}
                </div>
        </div>
    );
};

export default CategoryDetails;
