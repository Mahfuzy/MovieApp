// TopRatedSlider.js
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import FavoriteButton from "../Buttons/FavoritesButton";
import WatchListButton from "../Buttons/WatchlistButton";


const TopRatedSlider = () => {
  const [shows, setShows] = useState([]);
  const history = useHistory();
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
      <div className="tag">
        <h1>Top Rated TV Shows</h1>
      </div>
      <div>
        <Slider {...settings}>
          {shows.map((show) => (
            <div key={show.id} >
              <Link to={`/tv/${show.id}`}>
                <figure className="relative overflow-hidden">
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`}
                    alt={show.name}
                    className="rounded-lg h-auto hover:scale-[1.3] transition ease-in-out hover:duration-500"
                  />
                  
                </figure>
                <p>{show.name}</p>
              </Link>
              
            </div>
          ))}
        </Slider>
        <div className="text-center mt-4">
          <Link className="font-bold" to="/top-rated">
            See All
          </Link>
        </div>
      </div>
    </>
  );
};

export default TopRatedSlider;
