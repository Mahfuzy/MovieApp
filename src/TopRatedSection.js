import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { Link } from "react-router-dom";



const TopRatedSlider = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    fetch(
      `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1&api_key=6a5902d7453bd8f30c5b9881d0fc6aca`
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
      <div>
        <h1>Top Rated Movies</h1>
      </div>
      <div className="movie-slider">
        <Slider {...settings}>
          {movies.map((movie) => (
             <div key={movie.id} className="relative overflow-hidden">
             <Link to={`movies/${movie.id}`}>
                 <figure className='relative'>
                     <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} className=' rounded-lg h-[350px] hover:scale-[1.3] transition ease-in-out hover:duration-500'  />
                     <p>{movie.title}</p>
                 </figure>
             </Link>
          
         </div>
          ))}
        </Slider>
        <div className="text-center mt-4">
            <Link className="font-bold" to="/toprated">See All</Link>
        </div>
      </div>
    </>
  );
};

export default TopRatedSlider;
