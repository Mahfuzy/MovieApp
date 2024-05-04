import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Slider from 'react-slick'; 
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const TvShowsDetails = () => {
    const { id } = useParams();
    const [show, setShow] = useState({});
    const [officialTrailer, setOfficialTrailer] = useState(null);
    const [cast, setCast] = useState([]);

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=6a5902d7453bd8f30c5b9881d0fc6aca`)
            .then(res => res.json())
            .then(data => {
                setShow(data);
                // Fetch videos related to the TV show
                fetch(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=6a5902d7453bd8f30c5b9881d0fc6aca`)
                    .then(res => res.json())
                    .then(videoData => {
                        const trailer = videoData.results.find(video => video.type === 'Trailer' || video.type === 'Teaser');
                        setOfficialTrailer(trailer);
                    })
                    .catch(error => console.error('Error fetching videos:', error));
                
                // Fetch cast data for the TV show
                fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=6a5902d7453bd8f30c5b9881d0fc6aca`)
                    .then(res => res.json())
                    .then(data => {
                        setCast(data.cast);
                    })
                    .catch(error => {
                        console.error('Error fetching cast:', error);
                    });
            })
            .catch(error => console.error('Error fetching TV show details:', error));
    }, [id]);

    // Settings for the slider
    const sliderSettings = {
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        lazyLoad: true,
        autoplay: true,
        autoplaySpeed: 2000,
    };

    return ( 
        <div className="pt-8 bg-black text-white">
            <div className="pt-8 flex">
                <div className='mx-auto'>
                    {officialTrailer ? (
                        <iframe
                            title="Official Trailer"
                            width="560"
                            height="315"
                            src={`https://www.youtube.com/embed/${officialTrailer.key}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <p>No official trailer available</p>
                    )}
                </div>
                <div className='w-[50%] mx-auto'>
                    <div>
                        <h1 className="text-3xl font-bold mb-4">{show.name}</h1>
                    </div>
                    <div>
                        <p className="text-lg my-4">Overview: {show.overview || 'No overview available'}</p>
                        <p className="text-lg">Release Date: {show.first_air_date}</p>
                        <p className="text-lg">First Aired Date: {show.first_air_date}</p>
                        <p className="text-lg">Number Of Seasons: {show.number_of_seasons}</p>
                        <p className="text-lg">Number Of Episodes: {show.number_of_episodes}</p>
                        <p className="text-lg">Vote Average: {show.vote_average}</p>
                        <p className="text-lg">Vote Count: {show.vote_count}</p>
                    </div>
                </div>
            </div>
            <div>
                <h2 className="text-2xl mt-8 mb-4 text-white font-bold ml-4">Cast</h2>
                {cast.length === 1 ? (
                    <div className="flex justify-center items-center">
                        <img
                            src={`https://image.tmdb.org/t/p/w500/${cast[0].profile_path}`}
                            alt={cast[0].name}
                            className="h-[325px] rounded-lg"
                        />
                        <p className='text-white'>{cast[0].name}</p>
                    </div>
                ) : (
                    <Slider {...sliderSettings}>
                        {cast.map(actor => (
                            <div key={actor.id}>
                                {actor.profile_path && (
                                    <>
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500/${actor.profile_path}`}
                                            alt={actor.name}
                                            className="h-[325px] rounded-lg"
                                        />
                                        <p className='text-white'>{actor.name}</p>
                                    </>
                                )}
                            </div>
                        ))}
                    </Slider>
                )}
            </div>
        </div>
     );
};
 
export default TvShowsDetails;
