import { Button } from "@material-tailwind/react";
import { useState, useEffect } from "react";

const WatchListButton = ({ media_type, movieId }) => {
  const [isWatchList, setIsWatchList] = useState(false);

  useEffect(() => {

  }, [movieId]);

  const handleWatchListToggle = () => {
    const url = `https://api.themoviedb.org/3/account/21231805/watchlist`;
    const payload = {
      media_type: media_type,
      media_id: movieId,
      watchlist: !isWatchList // Toggle watchlist status
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YTU5MDJkNzQ1M2JkOGYzMGM1Yjk4ODFkMGZjNmFjYSIsInN1YiI6IjY2MjdjYmE0MTc2YTk0MDE3ZjgyMGY1MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gvOGt5ts31M9wuYa4RprICQOUtMoezvGVMPa8I7z_Ho'
      },
      body: JSON.stringify(payload)
    };

    fetch(url, options)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to toggle watchlist');
        }
        setIsWatchList(!isWatchList); // Update watchlist status locally
        return res.json();
      })
      .then(json => {
        console.log('Watchlist status toggled successfully:', json);
        // You may handle additional logic here if needed
      })
      .catch(err => console.error('Error toggling watchlist:', err));
  };

  return (
    <div className="flex items-center gap-4">
      <Button className="flex items-center gap-3" onClick={handleWatchListToggle}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={isWatchList ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
          />
        </svg>
        {isWatchList ? "Remove from watchlist" : "Add to watchlist"}
      </Button>
    </div>
  );
};

export default WatchListButton;
