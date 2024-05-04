import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const TvShowsDetails = () => {
    const { id } = useParams();
    const [show, setShow] = useState({});

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=6a5902d7453bd8f30c5b9881d0fc6aca`)
            .then(res => res.json())
            .then(data => {
                setShow(data);
            })
            .catch(error => console.error('Error fetching TV shows:', error));
    }, [id]);

    return ( 
        <div className="text-white pt-8">
            <h1>{show.name}</h1>
            <p>ID: {show.id}</p>
            <p>Overview: {show.overview}</p>
            <p>First Air Date: {show.first_air_date}</p>
            {/* Add other TV show details you want to display */}
        </div>
     );
};
 
export default TvShowsDetails;
