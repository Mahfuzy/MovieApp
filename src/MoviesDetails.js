import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; 


const DetailsPage = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [officialTrailer, setOfficialTrailer] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cast, setCast] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        // Fetch movie details
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=6a5902d7453bd8f30c5b9881d0fc6aca`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch movie details');
                }
                return res.json();
            })
            .then(data => {
                setItem(data);
            })
            .catch(error => {
                setError(error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });

        // Fetch videos for the movie
        fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=6a5902d7453bd8f30c5b9881d0fc6aca`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch videos');
                }
                return res.json();
            })
            .then(data => {
                // Filter only the official trailer
                const trailer = data.results.find(video => video.type === 'Trailer' || video.type === 'Teaser');
                setOfficialTrailer(trailer);
            })
            .catch(error => {
                console.error('Error fetching videos:', error);
            });

        fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=6a5902d7453bd8f30c5b9881d0fc6aca`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch movie credits');
                }
                return res.json();
            })
            .then(data => {
                setCast(data.cast);
            })
            .catch(error => {
                console.error('Error fetching movie credits:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [id]);

    if (isLoading) {
        return (
            <div className="container bg-black flex items-center justify-center h-screen">
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container bg-black flex items-center justify-center h-screen">
                <p className="text-white">{error}</p>
            </div>
        );
    }



    const PrevButton = ({ onClick }) => (
      <button className="slick-prev" onClick={onClick}>
        <FaChevronLeft />
      </button>
    );
    
    const NextButton = ({ onClick }) => (
      <button className="slick-next" onClick={onClick}>
        <FaChevronRight />
      </button>
    );
    
    const settings = {
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      lazyLoad: true,
      autoplay: true,
      autoplaySpeed: 2000,
      prevArrow: <PrevButton />,
      nextArrow: <NextButton />,
    };
    

    return (
        <div className="container bg-black">
            <div className="text-white pt-8 flex">
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
                        <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
                    </div>
                    <div>
                        <p className="text-lg my-4">Overview: {item.overview || 'No overview available'}</p>
                        <p className="text-lg">Release Date: {item.release_date}</p>
                        <p className="text-lg">Runtime: {item.runtime} minutes</p>
                        <p className="text-lg">Vote Average: {item.vote_average}</p>
                        <p className="text-lg">Vote Count: {item.vote_count}</p>
                    </div>
                </div>
            </div>
            <div>
                <h2 className="text-2xl mt-8 mb-4 text-white font-bold ml-4">Cast</h2>
                <Slider {...settings}>
                    {cast.map(actor => (
                        <div key={actor.id}>
                            <img
                                src={`https://image.tmdb.org/t/p/w500/${actor.profile_path}`}
                                alt={actor.name}
                                className="h-[325px] rounded-lg"
                            />
                            <p className='text-white'>{actor.name}</p>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default DetailsPage;
