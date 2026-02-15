import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import TopRatedSection from './TopRatedSection';
import PopularSection from './PopularSection';
import AiringTodaySection from './AiringTodaySection';
import OnAirSection from '../../components/TVShows_component/OnAirSection';
import Loader from '../Buttons/Loader';

const TvShows = () => {
    const [tvShows, setTVShows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [fadeIn, setFadeIn] = useState(true);

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${process.env.REACT_APP_API_KEY}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch TV shows');
                return res.json();
            })
            .then(data => {
                setTVShows(data.results.filter(show => show.backdrop_path));
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching TV shows:', error);
                setIsLoading(false);
            });
    }, []);

    // Auto-rotate every 8 seconds
    useEffect(() => {
        if (tvShows.length === 0) return;
        const interval = setInterval(() => {
            setFadeIn(false);
            setTimeout(() => {
                setActiveIndex(prev => (prev + 1) % tvShows.length);
                setFadeIn(true);
            }, 500);
        }, 8000);
        return () => clearInterval(interval);
    }, [tvShows.length]);

    const goToSlide = useCallback((index) => {
        if (index === activeIndex) return;
        setFadeIn(false);
        setTimeout(() => {
            setActiveIndex(index);
            setFadeIn(true);
        }, 400);
    }, [activeIndex]);

    const activeShow = tvShows[activeIndex];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-900">
                <Loader />
            </div>
        );
    }

    return (
        <div className="text-white bg-gray-900 min-h-screen">
            {/* === HERO SECTION === */}
            <div className="relative w-full overflow-hidden" style={{ height: '90vh', minHeight: '550px' }}>

                {/* Mobile Background (Poster) */}
                {activeShow && (
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 md:hidden"
                        style={{
                            backgroundImage: `url('https://image.tmdb.org/t/p/original${activeShow.poster_path}')`,
                            opacity: fadeIn ? 1 : 0,
                        }}
                    />
                )}

                {/* Desktop Background (Backdrop) */}
                {activeShow && (
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 hidden md:block"
                        style={{
                            backgroundImage: `url('https://image.tmdb.org/t/p/original${activeShow.backdrop_path}')`,
                            opacity: fadeIn ? 1 : 0,
                        }}
                    />
                )}

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-gray-900/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/30 to-transparent" />

                {/* Content */}
                {activeShow && (
                    <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 lg:px-20 pb-16 md:pb-20">
                        <p className="text-sm font-semibold tracking-widest uppercase text-blue-400 mb-3">
                            ✦ Trending TV Shows
                        </p>
                        <h1
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-2xl transition-all duration-500"
                            style={{
                                opacity: fadeIn ? 1 : 0,
                                transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
                            }}
                        >
                            {activeShow.name}
                        </h1>
                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-300">
                            <span className="flex items-center gap-1">
                                <span className="text-yellow-400">★</span>
                                {activeShow.vote_average?.toFixed(1)}
                            </span>
                            <span>{activeShow.first_air_date?.slice(0, 4)}</span>
                            <span className="bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded text-xs">
                                {activeShow.original_language?.toUpperCase()}
                            </span>
                        </div>
                        <p
                            className="text-gray-300 text-sm md:text-base max-w-xl mb-8 line-clamp-3 transition-all duration-500 delay-100"
                            style={{
                                opacity: fadeIn ? 1 : 0,
                                transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
                            }}
                        >
                            {activeShow.overview || 'No overview available.'}
                        </p>
                        <div className="flex items-center gap-4">
                            <Link
                                to={`/tv/${activeShow.id}`}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                                View Details
                            </Link>
                        </div>

                        {/* Dot indicators */}
                        <div className="flex items-center gap-2 mt-8">
                            {tvShows.slice(0, 10).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`h-1 rounded-full transition-all duration-300 ${index === activeIndex
                                        ? 'w-8 bg-blue-500'
                                        : 'w-4 bg-white/30 hover:bg-white/50'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* === SECTIONS === */}
            <div className="py-8 px-4">
                <TopRatedSection />
                <PopularSection />
                <OnAirSection />
                <AiringTodaySection />
            </div>
        </div>
    );
};

export default TvShows;
