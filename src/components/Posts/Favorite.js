import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const FavoritesPage = () => {
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [favoriteTVShows, setFavoriteTVShows] = useState([]);

    useEffect(() => {
        fetchFavoriteMovies();
        fetchFavoriteTVShows();
    }, []);

    const fetchFavoriteMovies = () => {
        fetch(`https://api.themoviedb.org/3/account/21231805/favorite/movies?api_key=${process.env.REACT_APP_API_KEY}`, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YTU5MDJkNzQ1M2JkOGYzMGM1Yjk4ODFkMGZjNmFjYSIsInN1YiI6IjY2MjdjYmE0MTc2YTk0MDE3ZjgyMGY1MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gvOGt5ts31M9wuYa4RprICQOUtMoezvGVMPa8I7z_Ho'
            }
        })
        .then(response => response.json())
        .then(data => {
            setFavoriteMovies(data.results);
        })
        .catch(error => console.error('Error fetching favorite movies:', error));
    };

    const fetchFavoriteTVShows = () => {
        fetch(`https://api.themoviedb.org/3/account/21231805/favorite/tv?api_key=${process.env.REACT_APP_API_KEY}`, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YTU5MDJkNzQ1M2JkOGYzMGM1Yjk4ODFkMGZjNmFjYSIsInN1YiI6IjY2MjdjYmE0MTc2YTk0MDE3ZjgyMGY1MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gvOGt5ts31M9wuYa4RprICQOUtMoezvGVMPa8I7z_Ho'
            }
        })
        .then(response => response.json())
        .then(data => {
            setFavoriteTVShows(data.results);
        })
        .catch(error => console.error('Error fetching favorite TV shows:', error));
    };

    return (
        <div className="flex flex-col items-center px-4 py-8 space-y-8">
            <section className="w-full">
                <h1 className="text-xl font-bold mb-4">Favorite Movies</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {favoriteMovies.map(movie => (
                        <div key={movie.id} className="flex flex-col shadow-md rounded overflow-hidden">
                            <Link to={`/movie/${movie.id}`}>
                            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} className="w-full h-auto" />
                            
                            <div className="p-4">
                                <h2 className="font-semibold">{movie.title}</h2>
                               
                                <p className="mt-2 text-sm text-gray-600">{movie.overview}</p>
                            </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            <section className="w-full">
                <h1 className="text-xl font-bold mb-4">Favorite TV Shows</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {favoriteTVShows.map(show => (
                        <div key={show.id} className="flex flex-col shadow-md rounded overflow-hidden">
                            <Link to={`/tv/${show.id}`}>    
                            <img src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`} alt={show.name} className="w-full h-auto" />
                            <div className="p-4">
                                <h2 className="font-semibold">{show.name}</h2>
                                <p className="mt-2 text-sm text-gray-600">{show.overview}</p>
                            </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default FavoritesPage;
