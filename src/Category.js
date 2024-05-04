import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const Categories = () => {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=6a5902d7453bd8f30c5b9881d0fc6aca')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then((data) => {
                setGenres(data.genres); 
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);


    return (
        <div>
            <ul className="text-white grid grid-cols-5 gap-4 p-4 justify-center items-center h-screen">
                {genres.length > 0 ? (
                    genres.map(genre => (
                        <Link to={`/categories/${genre.id}`} key={genre.id}>
                            <li className="bg-gray-800 p-4 rounded-lg shadow-lg">{genre.name}</li>
                        </Link>
                    ))
                ) : (
                    <li>No genres found</li>
                )}
            </ul>
        </div>
    );
};

export default Categories;
