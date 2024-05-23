import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopRatedSection from '../../components/Movies_component/TopRatedSection';
import PopularSection from '../../components/Movies_component/PopularSection';
import NowPlayingSection from '../../components/Movies_component/NowPlayingSection';
import UpComingSection from '../../components/Movies_component/UpComingSection';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [backgroundImage, setBackgroundImage] = useState('');

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = () => {
        fetch(`https://api.themoviedb.org/3/discover/movie?&page=1&api_key=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json())
            .then(data => {
                setMovies(data.results);
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
        autoplaySpeed: 2000,
        centerMode: true,
        centerPadding: '60px',
        beforeChange: (current, next) => changeBackgroundImage(next),
    };

    const changeBackgroundImage = (index) => {
        const movie = movies[index];
        if (movie) {
            setBackgroundImage(`url('https://image.tmdb.org/t/p/original/${movie.poster_path}')`);
        }
    };

    return (
        <div className='text-white bg-slate-900 min-h-screen'>
            <div className="container mx-auto px-4 py-8" style={{ backgroundImage, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <h1 className="text-center text-4xl mb-8">Discover</h1>
                <Slider {...settings}>
                    {movies.map((movie, index) => (
                        <div key={movie.id} className="mx-2">
                            <Link to={`/movie/${movie.id}`} className="block">
                                <figure className='relative overflow-hidden'>
                                    <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    className='rounded-lg w-full h-auto'
                                />
                                </figure>
                                
                                {/* <p className='mt-2 text-center font-semibold text-lg'>{movie.title}</p> */}
                            </Link>
                            {/* <FavoriteButton movieId={movie.id} media_type={'movie'} />
                            <WatchListButton movieId={movie.id} media_type={'movie'} /> */}
                        </div>
                    ))}
                </Slider>
            </div>
            <div className='py-8 px-4'>
                <TopRatedSection />
                <PopularSection />
                <NowPlayingSection />
                <UpComingSection />
            </div>
        </div>
    );
};

export default Home;
