// https://api.themoviedb.org/3/movie/popular?language=en-US&page=1

import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import FavoriteButton from "../Buttons/FavoritesButton";
import WatchListButton from "../Buttons/WatchlistButton";



const PopularSlider = () => {
  const [movies, setMovies] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    fetch(
      `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=${process.env.REACT_APP_API_KEY}`
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
        <h1>Popular Movies</h1>
      </div>
      <div>
        <Slider {...settings}>
          {movies.map((movie) => (
            <div key={movie.id}>
                <Link to={`movie/${movie.id}`}>
                    <figure className="relative overflow-hidden">
                        <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} className=' rounded-lg h-auto hover:scale-[1.3] transition ease-in-out hover:duration-500'  />
                    </figure>
                    <p>{movie.title}</p>
                </Link>
            </div>
          ))}
        </Slider>
        <div className="text-center mt-4">
            <Link className="font-bold" to="/popular">See All</Link>
        </div>
      </div>
    </>
  );
};

export default PopularSlider;
