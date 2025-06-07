import { useEffect, useCallback, useRef, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';

function Movie() {
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const { movieId } = useParams();
    const [movieData, setMovieData] = useState({
        name: '',
        image: '',
        description: '',
        rating: 0,
        release_date: '',
        content_rating: "",
        trailer: '',
        duration: '',
        tags: '',
        language: '',
        genre: ""
    });
    useEffect(() => {
        (async () => {
            const { data } = await axios.get('http://localhost:8000/api/movie/' + movieId + '/');
            setMovieData(data);
            // for (var _ in data){
            //     movieData[_] = data[_];
            //     console.log(movieData);
            // }
        })();
    }, []);

    // check if user scrolled till end
    // if yes then fetchData()
    // useEffect(() => {
    //     const observer = new IntersectionObserver((entries) => {
    //         const target = entries[0];
    //         if (target.isIntersecting) {
    //             fetchData();
    //         }
    //     });

    //     if (loaderRef.current) {
    //         observer.observe(loaderRef.current);
    //     }

    //     return () => {
    //         if (loaderRef.current) {
    //             observer.unobserve(loaderRef.current);
    //         }
    //     };
    // }, [fetchData]);

    return (
        <div className="movie-container">
            <img src={movieData.image.slice(0, -4) + 'QL225_UY621_CR0,0,447,621r.jpg'} alt={movieData.name} className="movie-poster" />
            <div className="movie-info">
                <h1>{movieData.name}</h1>
                {<p className="tagline">{`Released: ${movieData.release_date.slice(0, 3)}`}</p> }
                <p className="tagline">Rating: {movieData.rating}</p>
                <p className="tagline">Content Rating: {movieData.content_rating}</p>
                <p className="tagline">Duration: {movieData.duration.slice(2)}</p>
                <p className="tagline">Language: {movieData.language}</p>
                <p className="tagline">Genre: {movieData.genre.slice(0,-1)}</p>
                <p>{movieData.description}</p>
                <a href={movieData.trailer} target="_blank" rel="noreferrer">
                    Watch Trailer
                </a>
                <ul className="movie-tags">
                    {movieData.tags.split(",").map((tag) => (
                        <li key={tag}>{tag}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Movie;
