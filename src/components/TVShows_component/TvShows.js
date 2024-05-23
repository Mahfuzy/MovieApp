import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import TopRatedSection from './TopRatedSection';
import PopularSection from './PopularSection';
import AiringTodaySection from './AiringTodaySection';
import OnAirSection from '../../components/TVShows_component/OnAirSection';
import FavoriteButton from '../Buttons/FavoritesButton';
import WatchListButton from '../Buttons/WatchlistButton';

const TvShows = () => {
    const [tvShows, setTVShows] = useState([]);
    const [backgroundImage, setBackgroundImage] = useState('');
    

    useEffect(() => {
        fetchTVShows();
    }, []);

    const fetchTVShows = () => {
        fetch(`https://api.themoviedb.org/3/discover/tv?&page=1&api_key=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setTVShows(data.results);
                // Set the background image initially
                if (data.results.length > 0) {
                    setBackgroundImage(`url('https://image.tmdb.org/t/p/original/${data.results[0].poster_path}')`);
                }
            })
            .catch(error => console.error('Error fetching TV shows:', error));
    };

    const settings = {
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        lazyLoad: true,
        autoplay: true,
        autoplaySpeed: 3000,
        centerMode: true,
        centerPadding: '60px', // Adjust this value to control the pop-out effect
        afterChange: (index) => changeBackgroundImage(index)
    };

    const changeBackgroundImage = (index) => {
        if (tvShows && tvShows[index]) {
            const tvShow = tvShows[index];
            setBackgroundImage(`url('https://image.tmdb.org/t/p/original/${tvShow.poster_path}')`);
        }
    };


    return (
        <div className='text-white bg-slate-900 min-h-screen'>
           <div className="container mx-auto px-4 py-8" style={{ backgroundImage, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}>
               <h1 className="text-center text-4xl mb-8">Discover</h1>
               <Slider {...settings} beforeChange={(oldIndex, newIndex) => changeBackgroundImage(newIndex)}>
                   {tvShows.map((show, index) => (
                       <div key={show.id} className="mx-2">
                           <Link to={`/tv/${show.id}`} className="block">
                               <img
                                   src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                                   alt={show.title}
                                   className='rounded-lg w-full h-auto'
                               />
                               {/* <p className='mt-2 text-center font-semibold text-lg'>{show.title}</p> */}
                           </Link>
                           {/* <FavoriteButton movieId={show.id} media_type={'tv'}/>
                           <WatchListButton movieId={show.id} media_type={'tv'} /> */}
                       </div>
                   ))}
               </Slider>
           </div>
           <div className='py-8 px-4'>
               <TopRatedSection/>
               <PopularSection/>
               <OnAirSection/>
               <AiringTodaySection/>
           </div>
       </div>
   );
};

export default TvShows;
