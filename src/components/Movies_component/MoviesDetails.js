import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link, useHistory } from 'react-router-dom';
import FavoriteButton from '../Buttons/FavoritesButton';
import WatchListButton from '../Buttons/WatchlistButton';

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
        slidesToShow: 4,
        slidesToScroll: 3,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 0,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 0,
                    infinite: true,
                    dots: false
                }
            }
        ]
    };

    if (isLoading) {
        return <div className="text-white">Loading...</div>;
    }

    if (error) {
        return <div className="text-white">Error: {error}</div>;
    }

    return (
        <div className="bg-gray-900 min-h-screen">
            <div className="container mx-auto">
                <div className="flex flex-wrap">
                    {/* Official Trailer */}
                    <div className="w-full md:w-2/3 lg:w-1/2 p-4">
                        {officialTrailer ? (
                            <iframe
                                title="Official Trailer"
                                width="560"
                                height="315"
                                src={`https://www.youtube.com/embed/${officialTrailer.key}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="rounded-lg shadow-xl"
                            ></iframe>
                        ) : (
                            <p className="text-white">No official trailer available</p>
                        )}
                    </div>

                    {/* Movie Details */}
                    <div className="w-full md:w-1/3 lg:w-1/2 p-4 text-white">
                        <h1 className="text-4xl font-semibold mb-4">{item?.title}</h1>
                        <p className="mb-4">Overview: {item?.overview || 'No overview available'}</p>
                        <p>Release Date: {item?.release_date}</p>
                        <p>Runtime: {item?.runtime} minutes</p>
                        <p>Vote Average: {item?.vote_average}</p>
                        <p>Vote Count: {item?.vote_count}</p>
                        {item && <FavoriteButton movieId={item.id} media_type={'movie'} />}
                        {item && <WatchListButton movieId={item} media_type={'movie'}/>}
                    </div>
                </div>

                {/* Cast */}
                <div className="w-full p-4">
                    <h2 className="text-2xl font-semibold mb-4 text-white">Cast</h2>
                    <Slider {...settings}>
                        {cast && cast.map(actor => (
                            <div key={actor.id} className="flex items-center gap-2">
                                <img
                                    src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : '/fallback-image.jpg'}
                                    alt={actor.name}
                                    className="w-[300px] h-[300px] rounded-lg"
                                />
                                <div>
                                    <p className="font-medium text-white">{actor.name}</p>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>

                {/* Similar Movies */}
                <div className="w-full p-4">
                    <h2 className="text-2xl font-semibold mb-4 text-white">Similar Movies</h2>
                    <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-3 gap-4 lg:grid-cols-5">
                        {similarMovies && similarMovies.map(movie => (
                            <div key={movie.id} className="relative group">
                                <Link to={`/movie/${movie.id}`}>
                                    <img
                                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/fallback-image.jpg'}
                                        alt={movie.title}
                                        className="w-full h-auto rounded-lg"
                                    />
                                </Link>
                                <div className="absolute bg-black opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                                <div className="p-2 bg-black bg-opacity-80">
                                    <p className="text-sm font-medium text-white">{movie.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsPage;
