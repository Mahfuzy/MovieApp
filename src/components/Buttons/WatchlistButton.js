import { Button } from "@material-tailwind/react";
import { useState, useEffect } from "react";

const WatchListButton = ({ media_type, movieId }) => {
  const [isWatchList, setIsWatchList] = useState(false);

  useEffect(() => {
    // Check current watchlist status on mount
    const checkWatchlistStatus = async () => {
      try {
        const token = process.env.REACT_APP_TMDB_TOKEN;
        if (!token) return;
        const res = await fetch(
          `https://api.themoviedb.org/3/account/${process.env.REACT_APP_TMDB_ACCOUNT_ID || '21231805'}/watchlist/${media_type === 'movie' ? 'movies' : 'tv'}?language=en-US&page=1&sort_by=created_at.asc`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) return;
        const data = await res.json();
        const found = data.results?.find((item) => item.id === movieId);
        setIsWatchList(!!found);
      } catch (err) {
        // Silently fail — user just won't see initial state
      }
    };
    checkWatchlistStatus();
  }, [movieId, media_type]);

  const handleWatchListToggle = () => {
    const token = process.env.REACT_APP_TMDB_TOKEN;
    if (!token) {
      console.warn('REACT_APP_TMDB_TOKEN is not set.');
      return;
    }
    const url = `https://api.themoviedb.org/3/account/${process.env.REACT_APP_TMDB_ACCOUNT_ID || '21231805'}/watchlist`;
    const payload = {
      media_type: media_type,
      media_id: movieId,
      watchlist: !isWatchList,
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to toggle watchlist');
        }
        setIsWatchList(!isWatchList);
        return res.json();
      })
      .catch((err) => console.error('Error toggling watchlist:', err));
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
