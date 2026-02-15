import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../Buttons/Loader';

const Episode = () => {
    const { id, seasonNumber, episodeNumber } = useParams();
    const [episodeData, setEpisodeData] = useState(null);
    const [videoData, setVideoData] = useState([]);
    const [imageUrl, setImageUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [episodeRes, videoRes] = await Promise.all([
                    fetch(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}?language=en-US&api_key=${process.env.REACT_APP_API_KEY}`),
                    fetch(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}/videos?language=en-US&api_key=${process.env.REACT_APP_API_KEY}`),
                ]);

                if (!episodeRes.ok) throw new Error('Failed to fetch episode data');

                const epData = await episodeRes.json();
                setEpisodeData(epData);
                if (epData.still_path) {
                    setImageUrl(`https://image.tmdb.org/t/p/original${epData.still_path}`);
                }

                if (videoRes.ok) {
                    const vidData = await videoRes.json();
                    setVideoData(vidData.results || []);
                }
            } catch (err) {
                console.error('Error fetching episode data:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, [id, seasonNumber, episodeNumber]);

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Episode {episodeNumber} of Season {seasonNumber}</h1>
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : episodeData ? (
                    <div>
                        <div>
                            {videoData.map(video => (
                                <div key={video.id}>
                                    {video.type === 'Trailer' ? (
                                        <div className="mb-4">
                                            <h3 className="text-lg font-semibold mb-2">Trailer:</h3>
                                            <iframe
                                                width="100%"
                                                height="315"
                                                src={`https://www.youtube.com/embed/${video.key}`}
                                                title={video.name}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="rounded-lg max-w-2xl"
                                            ></iframe>
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                        {imageUrl && (
                            <img src={imageUrl} alt={`Episode ${episodeNumber}`} className="w-full max-w-lg rounded-lg mb-4" />
                        )}
                        <h2 className="text-lg font-semibold mb-2">{episodeData.name}</h2>
                        <p className="mb-2 text-gray-400">Air Date: {episodeData.air_date}</p>
                        <p className="text-gray-300">{episodeData.overview || 'No overview available.'}</p>
                    </div>
                ) : (
                    <p className="text-gray-400">No episode data available.</p>
                )}
            </div>
        </div>
    );
};

export default Episode;
