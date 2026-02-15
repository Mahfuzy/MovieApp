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

                const [tvRes, similarRes, videosRes, creditsRes] = await Promise.all([
                    fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_API_KEY}`),
                    fetch(`https://api.themoviedb.org/3/tv/${id}/similar?api_key=${process.env.REACT_APP_API_KEY}`),
                    fetch(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}`),
                    fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${process.env.REACT_APP_API_KEY}`)
                ]);

                if (!tvRes.ok) throw new Error('Failed to fetch TV details');
                const tvData = await tvRes.json();
                setItem(tvData);
                setSeasons(tvData.seasons?.filter(s => s.season_number > 0) || []);

                if (similarRes.ok) {
                    const similarData = await similarRes.json();
                    setSimilarShows(similarData.results || []);
                }
                if (videosRes.ok) {
                    const videoData = await videosRes.json();
                    const trailer = videoData.results.find(v => v.type === 'Trailer' || v.type === 'Teaser');
                    setOfficialTrailer(trailer);
                }
                if (creditsRes.ok) {
                    const creditsData = await creditsRes.json();
                    setCast(creditsData.cast || []);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
                window.scrollTo(0, 0);
            }
        };
        fetchData();
    }, [id]);

    const castSettings = {
        dots: false,
        infinite: cast.length > 6,
        speed: 400,
        slidesToShow: 6,
        slidesToScroll: 2,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 3, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 1 } }
        ]
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen bg-gray-900 pt-20"><Loader /></div>;
    }
    if (error) {
        return <div className="text-white text-center min-h-screen bg-gray-900 pt-24">Error: {error}</div>;
    }



    const statusColor = item?.status === 'Returning Series' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400';

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            {/* === BACKDROP HERO === */}
            <div className="relative w-full" style={{ minHeight: '70vh' }}>
                {item?.backdrop_path && (
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url('https://image.tmdb.org/t/p/original${item.backdrop_path}')` }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-gray-900/40" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/40 to-transparent" />

                <div className="relative z-10 container mx-auto px-4 pt-28 pb-12 flex flex-col md:flex-row gap-8 items-end md:items-end">
                    {/* Poster */}
                    <div className="flex-shrink-0 w-48 md:w-56 mx-auto md:mx-0">
                        <img
                            src={item?.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                            alt={item?.name}
                            className="w-full rounded-xl shadow-2xl shadow-black/50"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left pb-2">
                        <h1 className="text-3xl md:text-5xl font-bold mb-3">{item?.name}</h1>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mb-4 text-sm">
                            <span className="font-bold text-lg text-yellow-400">
                                ★ {item?.vote_average?.toFixed(1)}
                            </span>
                            <span className="text-gray-400">({item?.vote_count?.toLocaleString()} votes)</span>
                            <span className="w-px h-4 bg-gray-600" />
                            <span>{item?.first_air_date?.slice(0, 4)}</span>
                            {item?.number_of_seasons > 0 && (
                                <>
                                    <span className="w-px h-4 bg-gray-600" />
                                    <span>{item.number_of_seasons} Season{item.number_of_seasons > 1 ? 's' : ''}</span>
                                </>
                            )}
                            {item?.number_of_episodes > 0 && (
                                <>
                                    <span className="w-px h-4 bg-gray-600" />
                                    <span>{item.number_of_episodes} Episodes</span>
                                </>
                            )}
                        </div>

                        {/* Status + language badges */}
                        <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start mb-4">
                            {item?.status && (
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                                    {item.status}
                                </span>
                            )}
                            <span className="uppercase text-xs bg-white/10 px-2 py-1 rounded-full">
                                {item?.original_language}
                            </span>
                        </div>

                        {/* Genres */}
                        {item?.genres?.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-5">
                                {item.genres.map(genre => (
                                    <span key={genre.id} className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium text-gray-200">
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Overview */}
                        <p className="text-gray-300 text-sm md:text-base max-w-2xl leading-relaxed mb-6">
                            {item?.overview || 'No overview available.'}
                        </p>

                        {/* Action buttons */}
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            {item && <FavoriteButton movieId={item.id} media_type={'tv'} />}
                            {item && <WatchListButton movieId={item.id} media_type={'tv'} />}
                        </div>
                    </div>
                </div>
            </div>

            {/* === TRAILER === */}
            {officialTrailer && (
                <div className="container mx-auto px-4 py-10">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Official Trailer
                    </h2>
                    <div className="relative w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl shadow-black/30" style={{ aspectRatio: '16/9' }}>
                        <iframe
                            title="Official Trailer"
                            src={`https://www.youtube.com/embed/${officialTrailer.key}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                        />
                    </div>
                </div>
            )}

            {/* === SEASONS === */}
            {seasons.length > 0 && (
                <div className="container mx-auto px-4 py-8">
                    <h2 className="text-xl font-semibold mb-5">Seasons</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {seasons.map(season => (
                            <Link
                                key={season.id}
                                to={`/tv/${id}/season/${season.season_number}`}
                                className="group"
                            >
                                <div className="rounded-lg overflow-hidden bg-gray-800 mb-2">
                                    <img
                                        src={season.poster_path ? `https://image.tmdb.org/t/p/w342${season.poster_path}` : 'https://via.placeholder.com/342x513?text=No+Poster'}
                                        alt={`Season ${season.season_number}`}
                                        className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <p className="text-sm font-medium">Season {season.season_number}</p>
                                <p className="text-xs text-gray-400">{season.episode_count} Episodes</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* === CAST === */}
            {cast.length > 0 && (
                <div className="container mx-auto px-4 py-8">
                    <h2 className="text-xl font-semibold mb-5">Cast</h2>
                    <Slider {...castSettings}>
                        {cast.slice(0, 20).map(actor => (
                            <div key={actor.id} className="px-2">
                                <div className="group">
                                    <div className="w-full aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-gray-800">
                                        <img
                                            src={actor.profile_path ? `https://image.tmdb.org/t/p/w342${actor.profile_path}` : 'https://via.placeholder.com/342x513?text=No+Photo'}
                                            alt={actor.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <p className="text-sm font-medium truncate">{actor.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{actor.character}</p>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            )}

            {/* === SIMILAR SHOWS === */}
            {similarShows.length > 0 && (
                <div className="container mx-auto px-4 py-8 pb-16">
                    <h2 className="text-xl font-semibold mb-5">Similar Shows</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {similarShows.slice(0, 12).map(show => (
                            <Link key={show.id} to={`/tv/${show.id}`} className="group">
                                <div className="rounded-lg overflow-hidden bg-gray-800 mb-2">
                                    <img
                                        src={show.poster_path ? `https://image.tmdb.org/t/p/w342${show.poster_path}` : 'https://via.placeholder.com/342x513?text=No+Image'}
                                        alt={show.name}
                                        className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <p className="text-sm font-medium truncate">{show.name}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <span className="text-yellow-400">★</span>
                                    <span>{show.vote_average?.toFixed(1)}</span>
                                    <span>•</span>
                                    <span>{show.first_air_date?.slice(0, 4)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TVDetailsPage;
