import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Slider from 'react-slick';
import FavoriteButton from '../Buttons/FavoritesButton';
import WatchListButton from '../Buttons/WatchlistButton';
import Loader from '../Buttons/Loader';

const TVDetailsPage = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [officialTrailer, setOfficialTrailer] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cast, setCast] = useState([]);
    const [similarShows, setSimilarShows] = useState([]);
    const [seasons, setSeasons] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const responses = await Promise.all([
                    fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_API_KEY}`).then(res => res.json()),
                    fetch(`https://api.themoviedb.org/3/tv/${id}/similar?api_key=${process.env.REACT_APP_API_KEY}`).then(res => res.json()),
                    fetch(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}`).then(res => res.json()),
                    fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${process.env.REACT_APP_API_KEY}`).then(res => res.json())
                ]);

                const [tvData, similarShowsData, videoData, creditsData] = responses;

                setItem(tvData);
                setSimilarShows(similarShowsData.results);
                
                const trailer = videoData.results.find(video => video.type === 'Trailer' || video.type === 'Teaser');
                setOfficialTrailer(trailer);

                setCast(creditsData.cast);

                // Ensure season numbers are correct
                const validSeasons = tvData.seasons.filter(season => season.season_number > 0);
                setSeasons(validSeasons);

            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
                window.scrollTo(0, 0);
            }
        };

        fetchData();
    }, [id]);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen"><Loader /></div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-white">Error: {error}</div>;
    }

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <div className="container mx-auto py-8 px-4">
                <div className="flex flex-wrap -mx-4">
                    {/* Official Trailer */}
                    <div className="w-full md:w-2/3 lg:w-1/2 px-4 mb-8">
                        {officialTrailer ? (
                            <iframe
                                title="Official Trailer"
                                width="100%"
                                height="315"
                                src={`https://www.youtube.com/embed/${officialTrailer.key}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="rounded-lg shadow-xl"
                            ></iframe>
                        ) : (
                            <div className="text-center">
                                {item && (
                                    <img
                                        src={`https://image.tmdb.org/t/p/original/${item.poster_path}`}
                                        alt={item.name}
                                        className="w-full rounded-lg h-auto"
                                    />
                                )}
                                <p className="mt-2">No official trailer available</p>
                            </div>
                        )}
                    </div>

                    {/* TV Details */}
                    <div className="w-full md:w-1/3 lg:w-1/2 px-4 mb-8">
                        {item && (
                            <>
                                <h1 className="text-4xl font-bold mb-4">{item.name}</h1>
                                <p className="mb-4"><span className="font-semibold">Overview:</span> {item.overview || 'No overview available'}</p>
                                <p><span className="font-semibold">First Air Date:</span> {item.first_air_date}</p>
                                <p><span className="font-semibold">Last Air Date:</span> {item.last_air_date}</p>
                                <p><span className="font-semibold">Number of Seasons:</span> {item.number_of_seasons}</p>
                                <p><span className="font-semibold">Number of Episodes:</span> {item.number_of_episodes}</p>
                                <div className="mt-4">
                                    <FavoriteButton movieId={item.id} media_type={'tv'} />
                                    <WatchListButton movieId={item.id} media_type={'tv'} />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Seasons */}
                <div className="w-full px-4 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Seasons</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {seasons.map(season => (
                            <Link key={season.id} to={`/tv/${id}/season/${season.season_number}`} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition duration-300">
                                <p className="text-white font-semibold">Season {season.season_number}</p>
                                <p className="text-gray-400">Air Date: {season.air_date}</p>
                                <p className="text-gray-400">Episode Count: {season.episode_count}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Cast */}
                <div className="w-full px-4 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Cast</h2>
                    <Slider {...settings}>
                        {cast.length ? (
                            cast.map(actor => (
                                <div key={actor.id} className="flex flex-col items-center p-2">
                                    <img
                                        src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : '/fallback-image.jpg'}
                                        alt={actor.name}
                                        className="w-32 h-48 rounded-lg object-cover mb-2"
                                    />
                                    <p className="text-center">{actor.name}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-white">No cast available</p>
                        )}
                    </Slider>
                </div>

                {/* Similar Shows */}
                <div className="w-full px-4 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Similar Shows</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {similarShows.length ? (
                            similarShows.map(show => (
                                <Link key={show.id} to={`/tv/${show.id}`} className="relative group">
                                    <img
                                        src={show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : '/fallback-image.jpg'}
                                        alt={show.name}
                                        className="w-full h-auto rounded-lg transition-transform transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-75 transition-opacity duration-300 rounded-lg"></div>
                                    <div className="absolute bottom-2 left-2 right-2 p-2 bg-black bg-opacity-70 rounded-lg">
                                        <p className="text-sm font-medium text-white">{show.name}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-white">No similar shows available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TVDetailsPage;
