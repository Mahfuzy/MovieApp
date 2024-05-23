import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import FavoriteButton from "../Buttons/FavoritesButton";
import WatchListButton from "../Buttons/WatchlistButton";
import Loader from "../Buttons/Loader";

const AiringTodaySlider = () => {
  const [shows, setShows] = useState([]);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = () => {
    setIsPending(true);
    fetch(
      `https://api.themoviedb.org/3/tv/airing_today?language=en-US&page=1&api_key=${process.env.REACT_APP_API_KEY}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((data) => {
        setShows(data.results);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  const settings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    lazyLoad: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <>
      <div className="tag">
        <h1 className="text-3xl font-bold text-white">Airing Today TV Shows</h1>
      </div>
      <div className="relative">
        {isPending && <Loader />}
        <Slider {...settings}>
          {shows.map((show) => (
            <div key={show.id} className="focus:outline-none">
              <Link to={`/tv/${show.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`}
                  alt={show.name}
                  className="rounded-lg h-[350px] object-cover hover:scale-105 transition duration-300"
                />
              </Link>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4">
                <Link to={`/tv/${show.id}`}>
                  <h2 className="text-white font-semibold">{show.name}</h2>
                </Link>
                <div className="flex justify-center mt-2">
                  <FavoriteButton movieId={show.id} media_type="tv" />
                  <WatchListButton movieId={show.id} media_type="tv" />
                </div>
              </div>
            </div>
          ))}
        </Slider>
        <div className="absolute bottom-4 right-4">
          <Link className="text-white font-bold" to="/airing-today">
            See All
          </Link>
        </div>
      </div>
    </>
  );
};

export default AiringTodaySlider;
