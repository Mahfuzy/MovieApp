import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import TopRatedSection from './TopRatedSection';
import PopularSection from './PopularSection';
import AiringTodaySection from './AiringTodaySection';
import OnAirSection from '../../components/TVShows_component/OnAirSection';
import Loader from '../Buttons/Loader';

const TvShows = () => {
    const [tvShows, setTVShows] = useState([]);
    const [backgroundImage, setBackgroundImage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTVShows();
    }, []);

    const fetchTVShows = () => {
        fetch(`https://api.themoviedb.org/3/discover/tv?&page=1&api_key=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json())
            .then(data => {
                setTVShows(data.results);
                if (data.results.length > 0) {
                    setBackgroundImage(`url('https://image.tmdb.org/t/p/original/${data.results[0].poster_path}')`);
                }
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching TV shows:', error);
                setIsLoading(false);
            });
    };

    const settings = {
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        lazyLoad: true,
        autoplay: true,
        autoplaySpeed: 3000,
        centerMode: true,
        centerPadding: '60px',
        afterChange: (index) => changeBackgroundImage(index),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
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

    const changeBackgroundImage = (index) => {
        if (tvShows && tvShows[index]) {
            const tvShow = tvShows[index];
            setBackgroundImage(`url('https://image.tmdb.org/t/p/original/${tvShow.poster_path}')`);
        }
    };

    return (
        <div className="text-white bg-slate-900 min-h-screen">
            <div className="container mx-auto px-4 py-8 relative" style={{ backgroundImage, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', transition: 'background-image 0.5s ease-in-out' }}>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                {isLoading ? (
                    <div className="flex justify-center items-center min-h-screen">
                        <Loader />
                    </div>
                ) : (
                    <>
                        <h1 className="text-center text-4xl mb-8 z-10 relative">Discover</h1>
                        <Slider {...settings} beforeChange={(oldIndex, newIndex) => changeBackgroundImage(newIndex)}>
                            {tvShows.map((show) => (
                                <div key={show.id} className="mx-2 z-10 relative">
                                    <Link to={`/tv/${show.id}`} className="block">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                                            alt={show.title}
                                            className="rounded-lg w-full h-auto transform transition-transform duration-300 hover:scale-105"
                                        />
                                    </Link>
                                </div>
                            ))}
                        </Slider>
                    </>
                )}
            </div>
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
