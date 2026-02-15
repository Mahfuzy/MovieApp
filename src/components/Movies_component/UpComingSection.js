import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { Link } from "react-router-dom";
import Loader from "../Buttons/Loader";

const UpComingSlider = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1&api_key=${process.env.REACT_APP_API_KEY}`)
      .then(res => { if (!res.ok) throw new Error("Failed to fetch"); return res.json(); })
      .then(data => setMovies(data.results))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const settings = {
    infinite: true, slidesToShow: 5, slidesToScroll: 2, autoplay: true, autoplaySpeed: 4000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Upcoming</h2>
        <Link to="/upcoming" className="text-sm text-gray-400 hover:text-white transition">See All →</Link>
      </div>
      {loading ? <Loader /> : error ? <p className="text-red-400 text-sm">{error}</p> : (
        <Slider {...settings}>
          {movies.map(movie => (
            <div key={movie.id} className="px-1.5">
              <Link to={`/movie/${movie.id}`} className="group block">
                <div className="relative rounded-lg overflow-hidden bg-gray-800">
                  <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : 'https://via.placeholder.com/342x513?text=No+Image'}
                    alt={movie.title}
                    className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-sm font-medium truncate">{movie.title}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-300 mt-0.5">
                      <span className="text-yellow-400">★</span> {movie.vote_average?.toFixed(1)}
                      <span className="ml-1">{movie.release_date?.slice(0, 4)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default UpComingSlider;
