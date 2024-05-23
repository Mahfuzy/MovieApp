import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
// import FavoriteButton from "../Buttons/FavoritesButton";
// import WatchListButton from "../Buttons/WatchlistButton";

const PopularSlider = () => {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = () => {
    fetch(
      `https://api.themoviedb.org/3/tv/popular?language=en-US&page=1&api_key=${process.env.REACT_APP_API_KEY}`
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
    <div className="bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8">Popular TV Shows</h1>
        <Slider {...settings}>
          {shows.map((show) => (
            <div key={show.id} className="group rounded-lg overflow-hidden relative">
              <Link to={`/tv/${show.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`}
                  alt={show.name}
                  className="w-full h-auto rounded-lg transition-transform transform hover:scale-105 duration-300 group-hover:brightness-90"
                />
                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 p-4 w-full text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-lg font-semibold">{show.name}</p>
                </div>
              </Link>
              {/* <div className="absolute top-2 right-2 z-10">
                <FavoriteButton movieId={show.id} media_type={'tv'} />
                <WatchListButton movieId={show.id} media_type={'tv'} />
              </div> */}
            </div>
          ))}
        </Slider>
        <div className="text-center mt-8">
          <Link className="font-bold text-white hover:underline" to="/popular-tv-shows">
            See All
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PopularSlider;
