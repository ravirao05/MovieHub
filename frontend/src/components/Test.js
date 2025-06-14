import { useEffect, useCallback, useRef, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export default function Movie() {
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFav, setIsFav] = useState(false);
    const [favourites, setFavourites] = useState([]);
    const [movieId, setMovieId] = useState('tt15354916');
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
    const [reviewData, setReviewData] = useState([]);
    const [review, setReview] = useState();
    const loaderRef = useRef(null);




    useEffect(() => {
        // getting filter arguments
        setTimeout(() => {
            (async () => {
                const { data } = await axios.get('http://localhost:8000/api/movie/' + movieId + '/');
                setMovieData(data);
            })();
        }, 2000);
    }, []);


    useEffect(() => {
        // getting filter arguments
        setTimeout(() => {
            (async () => {
                try {
                    const { data } = await axios.get('http://localhost:8000/api/profile/');
                    if (data) {
                        setFavourites(data.favourite);
                        data.favourite.map((fav) => {
                            if (fav.id === movieId) {
                                setIsFav(true);
                            }
                        })
                    }
                } catch (e) {
                    console.log(e)
                }
            })();
        }, 3000);
    }, []);


    const toogleFav = async () => {
        if (favourites.includes(movieId)) {
            favourites.splice(favourites.indexOf(movieId), 1)
            console.log(favourites)
        } else {
            setFavourites([...favourites, ...[movieId]])
            console.log([...favourites, ...[movieId]])
        }

        let params = {
            favourite: favourites
        }
        const { data } = await axios.patch('http://localhost:8000/api/profile/', params);
        setIsFav(!isFav)
    }

    return (
        <>
            <div className="movie-container-descriptive">
                <img src={movieData.image.slice(0, -4) + 'QL168_UY631_CR12,0,427,631_.jpg'} alt={movieData.name} className="movie-poster" />
                <div className="movie-info">
                    <div className="movie-header">
                        <h1>{movieData.name}</h1>
                        <p className="date">{movieData.release_date}</p>
                    </div>
                    <button className="toogle-fav" onClick={toogleFav}>{isFav ? "Remove from fav" : "Add to fav"}</button>
                    <p className="rating">Rating: {movieData.rating}</p>
                    <p className="content-rating">Content Rating: {movieData.content_rating}</p>
                    <p className="duration">Duration: {movieData.duration}</p>


                    <p class="summary">{movieData.description}</p>
                    <Link to={movieData.trailer} target="_blank" className="trailer" rel="noreferrer">
                        Watch Trailer
                    </Link>
                    <p>
                        <ul className="tabs">
                            Genre:&nbsp;
                            {movieData.genre.slice(0, -1).split(",").map((g) => (
                                <li key={g}>{g}</li>
                            ))}
                        </ul>
                        <ul className="tabs">
                            Available in: &nbsp;
                            {movieData.language.slice(0, -1).split(",").map((tag) => (
                                <li key={tag}> {tag}</li>
                            ))}
                        </ul>
                        <ul className="tabs">
                            Tags:&nbsp;
                            {movieData.tags.split(",").map((tag) => (
                                <li key={tag}>{tag}</li>
                            ))}
                        </ul>
                    </p>
                </div>
            </div>
        </>

    );
};