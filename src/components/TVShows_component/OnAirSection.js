import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import FavoriteButton from '../Buttons/FavoritesButton';
import Loader from '../Buttons/Loader';
import Slider from 'react-slick';

const OnTheAirSlider = () => {
    const [shows, setShows] = useState([]);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        fetchShows();
    }, []);

    const fetchShows = () => {
        setIsPending(true);
        fetch(`https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=1&api_key=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json())
            .then(data => {
                setShows(data.results);
            })
            .catch(error => console.error('Error fetching on-the-air TV shows:', error))
            .finally(() => {
                setTimeout(() => {
                    setIsPending(false);
                }, 100);
            });
    };

    const settings = {
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        lazyLoad: true,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <>
            <div className="tag">
                <h1 className="text-3xl font-bold">On The Air TV Shows</h1>
            </div>
            <div className="relative">
                {isPending && <Loader />}
                <Slider {...settings}>
                    {shows.map(show => (
                        <div key={show.id} className="relative">
                            <Link to={`/tv/${show.id}`}>
                                <img
                                    src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`}
                                    alt={show.name}
                                    className="rounded-lg w-full h-auto hover:scale-[1.1] transition duration-300"
                                />
                            </Link>
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 px-4 py-2">
                                <p className="text-white truncate">{show.name}</p>
                            </div>
                            {/* <div className="absolute top-2 right-2">
                                <FavoriteButton movieId={show.id} media_type="tv" />
                            </div> */}
                        </div>
                    ))}
                </Slider>
                <div className="absolute bottom-4 right-4">
                    <Link to="/on-air" className="text-white font-bold hover:underline">See All</Link>
                </div>
            </div>
        </>
    );
};

export default OnTheAirSlider;
