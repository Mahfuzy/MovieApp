import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Episode = () => {
    const { id, seasonNumber, episodeNumber } = useParams();
    const [episodeData, setEpisodeData] = useState(null);
    const [videoData, setVideoData] = useState([]);
    const [imageUrl, setImageUrl] = useState(null); // State for storing episode image URL

    useEffect(() => {
        const fetchEpisodeData = async () => {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}?language=en-US&api_key=${process.env.REACT_APP_API_KEY}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch episode data');
                }
                const data = await response.json();
                setEpisodeData(data);
                // Set episode image URL as fallback image
                setImageUrl(`https://image.tmdb.org/t/p/original${data.still_path}`);
            } catch (error) {
                console.error('Error fetching episode data:', error);
            }
        };

        const fetchVideoData = async () => {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}/videos?language=en-US&api_key=${process.env.REACT_APP_API_KEY}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch video data');
                }
                const data = await response.json();
                setVideoData(data.results);  
            } catch(error){
                console.error('Error fetching video data:', error);
            }
        };

        fetchEpisodeData();
        fetchVideoData();
    }, [id, seasonNumber, episodeNumber]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Episode {episodeNumber} of Season {seasonNumber}</h1>
            {episodeData ? (
                
                <div>
                    <div>
                        {videoData && videoData.map(video => (
                            <div key={video.id}>
                                {video.type === 'Trailer' ? (
                                    <div>
                                        <h3>Trailer:</h3>
                                        <iframe
                                            width="560"
                                            height="315"
                                            src={`https://www.youtube.com/embed/${video.key}`}
                                            title={video.name}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                ) : (
                                    // If there is no trailer, display episode image
                                    <img src={imageUrl} alt={`Episode ${episodeNumber}`} className="w-full max-w-lg" />
                                )}
                            </div>
                        ))}
                    </div>
                    <h2 className="text-lg font-semibold mb-2">{episodeData.name}</h2>
                    <p className="mb-2">Air Date: {episodeData.air_date}</p>
                    <p>{episodeData.overview}</p>
                    
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Episode;
