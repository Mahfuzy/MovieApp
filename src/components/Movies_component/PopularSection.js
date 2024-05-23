import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import Loader from '../Buttons/Loader'; // Import Loader component for loading indicator
import 'slick-carousel/slick/slick.css';

const PopularSlider = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    setIsLoading(true);
    setError(null);

    fetch(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=${process.env.REACT_APP_API_KEY}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch popular movies');
        }
        return res.json();
      })
      .then((data) => {
        setMovies(data.results);
      })
      .catch((err) => {
        console.error('Error fetching popular movies:', err);
        setError('Failed to fetch popular movies. Please try again later.');
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
      <h1 className="text-3xl font-bold mb-4">Popular Movies</h1>
      </div>
      <div>
        {isLoading && <Loader />} {/* Display loader while loading */}
        {error && <p className="text-red-500">{error}</p>} {/* Display error message if there's an error */}
        {!isLoading && !error && (
          <Slider {...settings}>
            {movies.map((movie) => (
              <div key={movie.id}>
                <Link to={`movie/${movie.id}`}>
                  <figure className="relative overflow-hidden">
                    <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} className="rounded-lg h-auto hover:scale-[1.3] transition ease-in-out hover:duration-500" />
                  </figure>
                  <p>{movie.title}</p>
                </Link>
              </div>
            ))}
          </Slider>
        )}
        <div className="text-center mt-4">
          <Link className="font-bold" to="/popular">See All</Link>
        </div>
      </div>
    </>
  );
};

export default PopularSlider;
