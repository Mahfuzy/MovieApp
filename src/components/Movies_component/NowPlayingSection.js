// https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import FavoriteButton from "../Buttons/FavoritesButton";
import WatchListButton from "../Buttons/WatchlistButton";



const NowPlayingSlider = () => {
  const [movies, setMovies] = useState([]);
  const history = useHistory();

  const addFavorite = (movieId) => {
    const url = `https://api.themoviedb.org/3/account/21231805/favorite`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YTU5MDJkNzQ1M2JkOGYzMGM1Yjk4ODFkMGZjNmFjYSIsInN1YiI6IjY2MjdjYmE0MTc2YTk0MDE3ZjgyMGY1MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gvOGt5ts31M9wuYa4RprICQOUtMoezvGVMPa8I7z_Ho'
        },
        body: JSON.stringify({
            media_type: 'movie',
            media_id: movieId,
            favorite: true
        })
    };

    fetch(url, options)
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to add favorite');
            }
            return res.json();
        })
        .then(json => {
            console.log('Favorite added successfully:', json);
            // Redirect to the favorites page after adding the favorite
            history.push("/favorites");
        })
        .catch(err => console.error('Error adding favorite:', err));
};


  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    fetch(
      `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&api_key=${process.env.REACT_APP_API_KEY}`
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
        <h1>Now Playing</h1>
      </div>
      <div>
        <Slider {...settings}>
          {movies.map((movie) => (
             <div key={movie.id}>
             <Link to={`movie/${movie.id}`}>
                    <figure className='relative overflow-hidden'>
                     <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} className='w-full h-auto rounded-sm hover:scale-[1.3] transition-all ease-in-out duration-300'  />
                     </figure>
                     <p>{movie.title}</p>   
             </Link>
         </div>
          ))}
        </Slider>
        <div className="text-center mt-4">
            <Link className="font-bold" to="/nowplaying">See All</Link>
        </div>
      </div>
    </>
  );
};

export default NowPlayingSlider;
