import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Slider from 'react-slick';
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
                const [itemRes, similarRes, videosRes, creditsRes] = await Promise.all([
                    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_API_KEY}`),
                    fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${process.env.REACT_APP_API_KEY}`),
                    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}`),
                    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.REACT_APP_API_KEY}`)
                ]);

                if (!itemRes.ok) throw new Error('Failed to fetch movie details');
                const itemData = await itemRes.json();
                setItem(itemData);

                if (similarRes.ok) {
                    const similarData = await similarRes.json();
                    setSimilarMovies(similarData.results || []);
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
            }
        };
        fetchData();
        window.scrollTo(0, 0);
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

    const ratingPercent = Math.round((item?.vote_average || 0) * 10);


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
                            alt={item?.title}
                            className="w-full rounded-xl shadow-2xl shadow-black/50"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left pb-2">
                        <h1 className="text-3xl md:text-5xl font-bold mb-3">{item?.title}</h1>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mb-4 text-sm">
                            <span className="font-bold text-lg text-yellow-400">
                                ★ {item?.vote_average?.toFixed(1)}
                            </span>
                            <span className="text-gray-400">({item?.vote_count?.toLocaleString()} votes)</span>
                            <span className="w-px h-4 bg-gray-600" />
                            <span>{item?.release_date?.slice(0, 4)}</span>
                            {item?.runtime > 0 && (
                                <>
                                    <span className="w-px h-4 bg-gray-600" />
                                    <span>{Math.floor(item.runtime / 60)}h {item.runtime % 60}m</span>
                                </>
                            )}
                            <span className="w-px h-4 bg-gray-600" />
                            <span className="uppercase text-xs bg-white/10 px-2 py-0.5 rounded">
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
                            {item && <FavoriteButton movieId={item.id} media_type={'movie'} />}
                            {item && <WatchListButton movieId={item.id} media_type={'movie'} />}
                        </div>
                    </div>
                </div>
            </div>

            {/* === TRAILER === */}
            {officialTrailer && (
                <div className="container mx-auto px-4 py-10">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
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

            {/* === SIMILAR MOVIES === */}
            {similarMovies.length > 0 && (
                <div className="container mx-auto px-4 py-8 pb-16">
                    <h2 className="text-xl font-semibold mb-5">Similar Movies</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {similarMovies.slice(0, 12).map(movie => (
                            <Link key={movie.id} to={`/movie/${movie.id}`} className="group">
                                <div className="rounded-lg overflow-hidden bg-gray-800 mb-2">
                                    <img
                                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : 'https://via.placeholder.com/342x513?text=No+Image'}
                                        alt={movie.title}
                                        className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <p className="text-sm font-medium truncate">{movie.title}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <span className="text-yellow-400">★</span>
                                    <span>{movie.vote_average?.toFixed(1)}</span>
                                    <span>•</span>
                                    <span>{movie.release_date?.slice(0, 4)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailsPage;
