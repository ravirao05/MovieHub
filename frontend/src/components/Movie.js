import { useEffect, useCallback, useRef, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import "./Movie.css";

export default function Movie() {
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFav, setIsFav] = useState(false);
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
        platforms: '',
        genre: ""
    });
    const [reviewData, setReviewData] = useState([]);
    const [errors, setErrors] = useState({});
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
                    const { data } = await axios.get('http://localhost:8000/api/favourites/');
                    if (data) {
                        if (data.fav.includes(movieId)) setIsFav(true);
                        else setIsFav(false)
                    }
                } catch (e) {
                    console.log(e)
                }
            })();
        }, 3000);
    }, []);

    const toogleFav = async () => {
        const request = await axios.get('http://localhost:8000/api/favourites/', {
            params: {
                id: movieId
            }
        });
        if (request.data) {
            setIsFav(request.data.fav);
            setErrors({});
        } else setErrors(request.response.data);
    }

    const submitReview = async () => {
        const request = await axios.post('http://localhost:8000/api/reviews/', {
            movie: movieId,
            body: review,
            title: "sample",
            rating: "9" + "/10",
        });
        if (request.data) {
            setReview('');
            setCurrentPage(1);
            setReviewData([]);
            setErrors({});
        } else setErrors(request.response.data);
    }
    const fetchData = async () => {
        const { data } = await axios.get('http://localhost:8000/api/reviews/', {
            params: {
                page: currentPage,
                movie: movieId,
            }
        });
        if (data) {
            setReviewData((prevReviews) => [...prevReviews, ...data['results']]);
            setCurrentPage((prevPage) => prevPage + 1);
        }
    }

    // check if user scrolled till end
    // if yes then fetchData()
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const target = entries[0];
            if (target.isIntersecting) {
                fetchData();
            }
        });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [fetchData]);

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
                            Available on: &nbsp;
                            {movieData.platforms.slice(0, -1).split(",").map((tag) => (
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
            <div className='error'>
                {Object.entries(errors).map(([key, message]) => (
                    <p className="error-message">{`${key}: ${message}`}</p>
                ))}
            </div>
            <div class="review-container">
                <h2>Add Review</h2>
                <textarea placeholder="Share your thoughts on this movie..." className="review-textbox" value={review} onChange={(e) => setReview(e.target.value)}></textarea>
                <button className="submit-review" onClick={submitReview}>Submit Review</button>

                <h2>Reviews</h2>
                <ul className="reviews-list">
                    {reviewData.map((review) => (
                        <li key={review.id} className="review">
                            <h3>{review.title}</h3>
                            <p>By <b>@{review.user ? review.user : "IMDB User"}</b></p>
                            <p className="rating">Rating: {review.rating}</p>
                            <p className="date">{review.date}</p>
                            <p>{review.body}</p>
                        </li>
                    ))}
                    <div ref={loaderRef}></div>
                </ul>
            </div>
        </>

    );
};