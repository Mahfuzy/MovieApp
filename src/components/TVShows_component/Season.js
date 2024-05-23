import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loader from '../Buttons/Loader'; // Importing the Loader component

const Season = () => {
  const { id, seasonNumber } = useParams();
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true);
      setError(null);

      console.log(`Fetching data for TV show ID: ${id}, Season: ${seasonNumber}`);

      try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?language=en-US&api_key=${process.env.REACT_APP_API_KEY}`);
        
        // Log the response status and URL
        console.log(`Response Status: ${response.status}`);
        console.log(`URL: ${response.url}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch episodes: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Fetched data:', data); // Log the full response data
        
        if (!data.episodes) {
          throw new Error('No episodes data found in the response');
        }

        setEpisodes(data.episodes);
      } catch (error) {
        console.error('Error fetching episodes:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [id, seasonNumber]);

  const baseUrl = 'https://image.tmdb.org/t/p/w500'; // Base URL for TMDb images

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Episodes of Season {seasonNumber}</h1>
      {loading ? (
        <Loader /> // Display the loader while loading
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="space-y-4">
          {episodes && episodes.map((episode) => (
            <li key={episode.id} className="bg-white p-4 rounded-lg shadow-md flex">
              {episode.still_path && (
                <img
                  src={`${baseUrl}${episode.still_path}`}
                  alt={episode.name}
                  className="w-32 h-18 rounded-lg mr-4"
                />
              )}
              <div>
                <Link to={`/tv/${id}/season/${seasonNumber}/episode/${episode.episode_number}`}>
                    <h2 className="text-lg font-semibold">Episode {episode.episode_number}: {episode.name}</h2>
                </Link>
                <p>Air Date: {episode.air_date}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Season;
