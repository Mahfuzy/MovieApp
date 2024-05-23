import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import FavoriteButton from '../Buttons/FavoritesButton';
import WatchListButton from '../Buttons/WatchlistButton';
import Loader from '../Buttons/Loader';

const DetailsPage = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [officialTrailer, setOfficialTrailer] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cast, setCast] = useState([]);
    const [similarMovies, setSimilarMovies] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const itemResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_API_KEY}`);
                const itemData = await itemResponse.json();
                setItem(itemData);

                const similarMoviesResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${process.env.REACT_APP_API_KEY}`);
                const similarMoviesData = await similarMoviesResponse.json();
                setSimilarMovies(similarMoviesData.results);

                const videosResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}`);
                const videoData = await videosResponse.json();
                const trailer = videoData.results.find(video => video.type === 'Trailer' || video.type === 'Teaser');
                setOfficialTrailer(trailer);

                const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.REACT_APP_API_KEY}`);
                const creditsData = await creditsResponse.json();
                setCast(creditsData.cast);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        window.scrollTo(0, 0);
    }, [id]);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 3,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            }
        ]
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen"><Loader /></div>;
    }

    if (error) {
        return <div className="text-white text-center mt-4">Error: {error}</div>;
    }

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <div className="container mx-auto py-8">
                <div className="flex flex-wrap">
                    <div className="w-full md:w-2/3 lg:w-1/2 p-4">
                        {officialTrailer ? (
                            <iframe
                                title="Official Trailer"
                                width="100%"
                                height="315"
                                src={`https://www.youtube.com/embed/${officialTrailer.key}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="rounded-lg shadow-xl w-full h-64 md:h-80"
                            ></iframe>
                        ) : (
                            <p className="text-white">No official trailer available</p>
                        )}
                    </div>

                    <div className="w-full md:w-1/3 lg:w-1/2 p-4">
                        <h1 className="text-4xl font-bold mb-4">{item?.title}</h1>
                        <p className="mb-4"><span className="font-semibold">Overview:</span> {item?.overview || 'No overview available'}</p>
                        <p><span className="font-semibold">Release Date:</span> {item?.release_date}</p>
                        <p><span className="font-semibold">Runtime:</span> {item?.runtime} minutes</p>
                        <p><span className="font-semibold">Vote Average:</span> {item?.vote_average}</p>
                        <p><span className="font-semibold">Vote Count:</span> {item?.vote_count}</p>
                        <div className="mt-4 flex items-center space-x-4">
                            {item && <FavoriteButton movieId={item.id} media_type={'movie'} />}
                            {item && <WatchListButton movieId={item} media_type={'movie'} />}
                        </div>
                    </div>
                </div>

                <div className="w-full p-4">
                    <h2 className="text-2xl font-semibold mb-4">Cast</h2>
                    <Slider {...settings}>
                        {cast.map(actor => (
                            <div key={actor.id} className="flex flex-col items-center p-2">
                                <img
                                    src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : '/fallback-image.jpg'}
                                    alt={actor.name}
                                    className="w-32 h-32 rounded-full object-cover mb-2"
                                />
                                <p className="text-sm font-medium">{actor.name}</p>
                            </div>
                        ))}
                    </Slider>
                </div>

                <div className="w-full p-4">
                    <h2 className="text-2xl font-semibold mb-4">Similar Movies</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {similarMovies.map(movie => (
                            <div key={movie.id} className="relative group">
                                <Link to={`/movie/${movie.id}`}>
                                    <img
                                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/fallback-image.jpg'}
                                        alt={movie.title}
                                        className="w-full h-auto rounded-lg transition-transform transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-75 transition-opacity duration-300 rounded-lg"></div>
                                    <div className="absolute bottom-2 left-2 right-2 p-2 bg-black bg-opacity-70 rounded-lg">
                                        <p className="text-sm font-medium">{movie.title}</p>
                                        <p className="text-sm font-medium">{movie.title}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
    );
};

export default DetailsPage;

