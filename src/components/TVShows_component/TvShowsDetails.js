import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Slider from 'react-slick';
import FavoriteButton from '../Buttons/FavoritesButton';
import WatchListButton from '../Buttons/WatchlistButton';

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

                console.log('Seasons Data:', validSeasons); // Log season data to verify

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
        return <div className="text-center text-white">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-white">Error: {error}</div>;
    }

    return (
        <div className="bg-gray-900 min-h-screen">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-wrap">
                    {/* Official Trailer */}
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
                                <p className="text-white mt-2">No official trailer available</p>
                            </div>
                        )}
                    </div>

                    {/* TV Details */}
                    <div className="w-full md:w-1/3 lg:w-1/2 p-4 text-white">
                        {item && (
                            <>
                                <h1 className="text-4xl font-semibold mb-4">{item.name}</h1>
                                <p className="mb-4">Overview: {item.overview || 'No overview available'}</p>
                                <p>First Air Date: {item.first_air_date}</p>
                                <p>Last Air Date: {item.last_air_date}</p>
                                <p>Number of Seasons: {item.number_of_seasons}</p>
                                <p>Number of Episodes: {item.number_of_episodes}</p>
                                <FavoriteButton movieId={item.id} media_type={'tv'} />
                                <WatchListButton movieId={item.id} media_type={'tv'} />
                            </>
                        )}
                    </div>
                </div>

                <div className="w-full p-4">
                    <h2 className="text-2xl font-semibold mb-4 text-white">Seasons</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {seasons.map(season => (
                            <div key={season.id} className="bg-gray-800 rounded-lg p-4">
                                <Link to={`/tv/${id}/season/${season.season_number}`}>
                                    <p className="text-white font-semibold">Season {season.season_number}</p>
                                    <p className="text-gray-400">Air Date: {season.air_date}</p>
                                    <p className="text-gray-400">Episode Count: {season.episode_count}</p>
                                    {/* <p className="text-gray-400">Overview: {season.overview}</p> */}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cast */}
                <div className="w-full p-4">
                    <h2 className="text-2xl font-semibold mb-4 text-white">Cast</h2>
                    <Slider {...settings}>
                        {cast.length ? (
                            cast.map(actor => (
                                <div key={actor.id} className="flex flex-col items-center">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                                        alt={actor.name}
                                        className="w-32 h-48 rounded-lg object-cover mb-2"
                                    />
                                    <p className="text-white text-center">{actor.name}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-white">No cast available</p>
                        )}
                    </Slider>
                </div>

                {/* Similar Shows */}
                <div className="w-full p-4">
                    <h2 className="text-2xl font-semibold mb-4 text-white">Similar Shows</h2>
                    <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {similarShows.length ? (
                            similarShows.map(show => (
                                <div key={show.id} className='relative'>
                                    <Link to={`/tv/${show.id}`}>
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                                            alt={show.name}
                                            className="w-full h-auto rounded-lg"
                                        />
                                    </Link>
                                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                                    <div className="p-2 bg-black bg-opacity-80">
                                        <p className="text-sm font-medium text-white">{show.name}</p>
                                    </div>
                                </div>
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
