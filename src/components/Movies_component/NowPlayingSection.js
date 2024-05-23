// https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { Link } from "react-router-dom";




const NowPlayingSlider = () => {
  const [movies, setMovies] = useState([]);




  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    fetch(
      `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&api_key=${process.env.REACT_APP_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results);
      })
      .catch((err) => console.log(err.message));
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
        <h1>Now Playing</h1>
      </div>
      <div>
        <Slider {...settings}>
          {movies.map((movie) => (
             <div key={movie.id}>
             <Link to={`movie/${movie.id}`}>
                    <figure className='relative overflow-hidden'>
                     <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} className='w-full h-auto rounded-sm hover:scale-[1.3] transition-all ease-in-out duration-300'  />
                     </figure>
                     <p>{movie.title}</p>   
             </Link>
         </div>
          ))}
        </Slider>
        <div className="text-center mt-4">
            <Link className="font-bold" to="/nowplaying">See All</Link>
        </div>
      </div>
    </>
  );
};

export default NowPlayingSlider;
