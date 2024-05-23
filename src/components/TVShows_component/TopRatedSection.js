import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
// import FavoriteButton from "../Buttons/FavoritesButton";
// import WatchListButton from "../Buttons/WatchlistButton";

const TopRatedSlider = () => {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = () => {
    fetch(
      `https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1&api_key=${process.env.REACT_APP_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        setShows(data.results);
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
      <div className="tag mb-6">
        <h1 className="text-3xl font-bold text-white">Top Rated TV Shows</h1>
      </div>
      <div>
        <Slider {...settings}>
          {shows.map((show) => (
            <div key={show.id} className="px-2">
              <Link to={`/tv/${show.id}`}>
                <figure className="relative overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`}
                    alt={show.name}
                    className="w-full h-auto transform transition-transform duration-500 hover:scale-105"
                  />
                  <figcaption className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white text-lg">
                    <p className="font-semibold">{show.name}</p>
                  </figcaption>
                </figure>
              </Link>
              {/* <div className="flex justify-between items-center mt-2">
                <FavoriteButton movieId={show.id} media_type={'tv'} />
                <WatchListButton movieId={show.id} media_type={'tv'} />
              </div> */}
            </div>
          ))}
        </Slider>
        <div className="text-center mt-6">
          <Link className="font-bold text-blue-500 hover:text-blue-400 transition duration-300" to="/top-rated">
            See All
          </Link>
        </div>
      </div>
    </>
  );
};

export default TopRatedSlider;
