import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import Loader from '../Buttons/Loader';

const OnTheAirSlider = () => {
    const [shows, setShows] = useState([]);
    const [isPending, setIsPending] = useState(true);

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=1&api_key=${process.env.REACT_APP_API_KEY}`)
            .then(res => { if (!res.ok) throw new Error("Failed to fetch"); return res.json(); })
            .then(data => setShows(data.results))
            .catch(err => console.error(err))
            .finally(() => setIsPending(false));
    }, []);

    const settings = {
        infinite: true, slidesToShow: 5, slidesToScroll: 2, autoplay: true, autoplaySpeed: 4000,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    };

    return (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">On The Air</h2>
                <Link to="/on-air" className="text-sm text-gray-400 hover:text-white transition">See All →</Link>
            </div>
            {isPending ? <Loader /> : (
                <Slider {...settings}>
                    {shows.map(show => (
                        <div key={show.id} className="px-1.5">
                            <Link to={`/tv/${show.id}`} className="group block">
                                <div className="relative rounded-lg overflow-hidden bg-gray-800">
                                    <img
                                        src={show.poster_path ? `https://image.tmdb.org/t/p/w342${show.poster_path}` : 'https://via.placeholder.com/342x513?text=No+Image'}
                                        alt={show.name}
                                        className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <p className="text-white text-sm font-medium truncate">{show.name}</p>
                                        <div className="flex items-center gap-1 text-xs text-gray-300 mt-0.5">
                                            <span className="text-yellow-400">★</span> {show.vote_average?.toFixed(1)}
                                            <span className="ml-1">{show.first_air_date?.slice(0, 4)}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </Slider>
            )}
        </div>
    );
};

export default OnTheAirSlider;
