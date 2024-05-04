import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopRatedSlider from './TopRatedSection';
import PopularSlider from './PopularSection';
import NowPlayingSlider from './NowPlayingSection';
import UpComingSlider from './UpComingSection';
import "slick-carousel/slick/slick.css";
import Slider from 'react-slick';

const TvDisplay = () => {
    const [movies, setMovies] = useState([]);
    const [backgroundImage, setBackgroundImage] = useState('');

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = () => {
        fetch(`https://api.themoviedb.org/3/discover/tv?&page=1&api_key=6a5902d7453bd8f30c5b9881d0fc6aca`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setMovies(data.results);
                // Set the background image initially
                if (data.results.length > 0) {
                    setBackgroundImage(`url('https://image.tmdb.org/t/p/original/${data.results[0].poster_path}')`);
                }
            })
            .catch(error => console.error('Error fetching movies:', error));
    };

    const settings = {
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        lazyLoad: true,
        autoplay: true,
        autoplaySpeed: 3000,
        centerMode: true,
        centerPadding: '100px', // Adjust this value to control the pop-out effect
        afterChange: (index) => changeBackgroundImage(index)
    };

    const changeBackgroundImage = (index) => {
        const movie = movies[index];
        if (movie) {
            setBackgroundImage(`url('https://image.tmdb.org/t/p/original/${movie.poster_path}')`);
        }
    };

    return (
        <div className='text-white bg-slate-900'>
            <div className="container h-[100vh]" style={{ backgroundImage, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <h1>Discover</h1>
                <ul>
                    <Slider {...settings}>
                        {movies.map((movie, index) => (
                            <li key={movie.id} className={`m-2 rounded-lg pt-72`}>
                                <Link to={`/shows/${movie.id}`}>
                                    <figure>
                                        <img
                                            src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                                            alt={movie.title}
                                            className='w-[500px] rounded-lg h-[325px] transition ease-in-out duration-300 hover:scale-105'
                                        />
                                    </figure>
                                    <p className='block mt-2 text-center font-bold'>{movie.title}</p>
                                </Link>
                            </li>
                        ))}
                    </Slider>
                </ul>
            </div>
            <div className='py-4 px-12'>
                <TopRatedSlider />
                <PopularSlider />
                <NowPlayingSlider />
                <UpComingSlider />
            </div>
        </div>
    );
};


export default TvDisplay;
