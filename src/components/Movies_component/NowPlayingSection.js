import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { Link } from "react-router-dom";
import Loader from "../Buttons/Loader";

const NowPlayingSlider = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    fetch(
      `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&api_key=${process.env.REACT_APP_API_KEY}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch now playing movies");
        }
        return res.json();
      })
      .then((data) => {
        setMovies(data.results);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch now playing movies. Please try again later.");
      })
      .finally(() => {
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
  };

  return (
    <>
      <div className="tag">
      <h1 className="text-3xl font-bold mb-4">Now Playing Movies</h1>
      </div>
      <div>
        {isLoading ? (
          <Loader /> // Show loader while loading
        ) : error ? (
          <p className="text-red-500">{error}</p> // Display error message if there's an error
        ) : (
          <Slider {...settings}>
            {movies.map((movie) => (
              <div key={movie.id}>
                <Link to={`movie/${movie.id}`}>
                  <figure className="relative overflow-hidden">
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-auto rounded-sm hover:scale-[1.3] transition-all ease-in-out duration-300"
                    />
                  </figure>
                  <p>{movie.title}</p>
                </Link>
              </div>
            ))}
          </Slider>
        )}
        <div className="text-center mt-4">
          <Link className="font-bold" to="/nowplaying">
            See All
          </Link>
        </div>
      </div>
    </>
  );
};

export default NowPlayingSlider;
