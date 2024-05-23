import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { Link } from "react-router-dom";
import Loader from "../Buttons/Loader"; // Import Loader component for loading indicator

const TopRatedSlider = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    setLoading(true);
    setError(null);

    fetch(
      `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1&api_key=${process.env.REACT_APP_API_KEY}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch top-rated movies");
        }
        return res.json();
      })
      .then((data) => {
        setMovies(data.results);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch top-rated movies. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
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
      <div>
        <h1 className="text-3xl font-bold mb-4">Top Rated Movies</h1>
      </div>
      <div className="movie-slider">
        {loading && <Loader />} {/* Display loader while loading */}
        {error && <p className="text-red-500">{error}</p>} {/* Display error message if there's an error */}
        {!loading && !error && (
          <Slider {...settings}>
            {movies.map((movie) => (
              <div key={movie.id}>
                <Link to={`movie/${movie.id}`}>
                  <figure className="relative overflow-hidden">
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                      alt={movie.title}
                      className="rounded-lg h-auto hover:scale-[1.3] transition ease-in-out hover:duration-500"
                    />
                  </figure>
                  <p className="text-center mt-2">{movie.title}</p>
                </Link>
              </div>
            ))}
          </Slider>
        )}
        <div className="text-center mt-4">
          <Link className="font-bold" to="/toprated">
            See All
          </Link>
        </div>
      </div>
    </>
  );
};

export default TopRatedSlider;
