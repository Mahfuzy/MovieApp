import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { Link } from "react-router-dom";
import Loader from "../Buttons/Loader"; // Import Loader component for loading indicator

const UpComingSlider = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    fetch(
      `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1&api_key=${process.env.REACT_APP_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results);
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch((err) => {
        console.log(err.message);
        setError("Failed to fetch upcoming movies. Please try again later."); // Set error message if fetching fails
        setLoading(false); // Set loading to false when there's an error
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
      <h1 className="text-3xl font-bold mb-4">Up Coming Movies</h1>
      </div>
      <div>
        {loading ? ( // Display loader while loading
          <Loader />
        ) : error ? ( // Display error message if there's an error
          <p className="text-red-500">{error}</p>
        ) : (
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
                  <p>{movie.title}</p>
                </Link>
              </div>
            ))}
          </Slider>
        )}
        <div className="text-center mt-4">
          <Link className="font-bold" to="/upcoming">
            See All
          </Link>
        </div>
      </div>
    </>
  );
};

export default UpComingSlider;
