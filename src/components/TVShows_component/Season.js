import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loader from '../Buttons/Loader';

const Season = () => {
  const { id, seasonNumber } = useParams();
  const [seasonData, setSeasonData] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEp, setExpandedEp] = useState(null);

  useEffect(() => {
    const fetchSeason = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?language=en-US&api_key=${process.env.REACT_APP_API_KEY}`
        );
        if (!res.ok) throw new Error('Failed to fetch season data');
        const data = await res.json();
        setSeasonData(data);
        setEpisodes(data.episodes || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSeason();
    window.scrollTo(0, 0);
  }, [id, seasonNumber]);

  const toggleExpand = (epNum) => {
    setExpandedEp(expandedEp === epNum ? null : epNum);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-900 pt-20"><Loader /></div>;
  if (error) return <div className="text-white text-center min-h-screen bg-gray-900 pt-24">{error}</div>;

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Season header with backdrop */}
      <div className="relative w-full" style={{ minHeight: '40vh' }}>
        {seasonData?.poster_path && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{ backgroundImage: `url('https://image.tmdb.org/t/p/original${seasonData.poster_path}')` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/50" />

        <div className="relative z-10 container mx-auto px-4 pt-28 pb-8">
          <Link to={`/tv/${id}`} className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition mb-4">
            ← Back to Show
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Season {seasonNumber}
          </h1>
          {seasonData?.overview && (
            <p className="text-gray-300 text-sm max-w-2xl leading-relaxed mb-2">{seasonData.overview}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
            <span>{episodes.length} Episodes</span>
            {seasonData?.air_date && (
              <>
                <span className="w-px h-4 bg-gray-600" />
                <span>Premiered {seasonData.air_date}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Episode list */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-3">
          {episodes.map((ep) => {
            const isExpanded = expandedEp === ep.episode_number;


            return (
              <div
                key={ep.id}
                className={`rounded-xl overflow-hidden transition-all duration-300 ${isExpanded ? 'bg-gray-800/80 ring-1 ring-white/10' : 'bg-gray-800/40 hover:bg-gray-800/60'
                  }`}
              >
                {/* Collapsed row — always visible */}
                <button
                  onClick={() => toggleExpand(ep.episode_number)}
                  className="w-full flex items-center gap-4 p-4 text-left cursor-pointer"
                >
                  {/* Episode thumbnail */}
                  <div className="flex-shrink-0 w-28 md:w-36 rounded-lg overflow-hidden bg-gray-700">
                    {ep.still_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${ep.still_path}`}
                        alt={ep.name}
                        className="w-full aspect-video object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-video flex items-center justify-center text-gray-500 text-xs">
                        No Preview
                      </div>
                    )}
                  </div>

                  {/* Episode info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500 font-medium">E{ep.episode_number}</span>
                      <h3 className="text-sm md:text-base font-medium truncate">{ep.name}</h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {ep.air_date && <span>{ep.air_date}</span>}
                      {ep.runtime > 0 && (
                        <>
                          <span className="w-px h-3 bg-gray-600" />
                          <span>{ep.runtime}m</span>
                        </>
                      )}
                      {ep.vote_average > 0 && (
                        <>
                          <span className="w-px h-3 bg-gray-600" />
                          <span className="text-yellow-400">★ {ep.vote_average.toFixed(1)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Expand indicator */}
                  <svg
                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="border-t border-white/5 pt-4">
                      {/* Large still image */}
                      {ep.still_path && (
                        <div className="mb-4 rounded-lg overflow-hidden max-w-xl">
                          <img
                            src={`https://image.tmdb.org/t/p/w780${ep.still_path}`}
                            alt={ep.name}
                            className="w-full aspect-video object-cover"
                          />
                        </div>
                      )}

                      {/* Overview */}
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        {ep.overview || 'No overview available for this episode.'}
                      </p>

                      {/* Guest stars */}
                      {ep.guest_stars?.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Guest Stars</h4>
                          <div className="flex flex-wrap gap-2">
                            {ep.guest_stars.slice(0, 8).map(guest => (
                              <div key={guest.id} className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1">
                                {guest.profile_path ? (
                                  <img
                                    src={`https://image.tmdb.org/t/p/w92${guest.profile_path}`}
                                    alt={guest.name}
                                    className="w-5 h-5 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center text-[8px]">?</div>
                                )}
                                <span className="text-xs text-gray-300">{guest.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Season;
