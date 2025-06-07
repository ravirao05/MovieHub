import { useEffect, useCallback, useRef, useState } from "react";
import axios from "axios";

function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [movies, setMovies] = useState([]);
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const years = Array.from({ length: 100 }, (_, index) => 2024 - index);
    const [filterArgs, setFilterArgs] = useState({
        genres: [],
        languages: []
    });
    const [filters, setFilters] = useState({
        genre: '',
        rating: '',
        release_date: '',
        language: ''
    });
    const loaderRef = useRef(null);
    const fetchData = useCallback(async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const { data } = await axios.get('http://localhost:8000/api/', {
                'params': {
                    'page': currentPage,
                    'search': query,
                    'rating': filters.rating,
                    'language': filters.language,
                    'year': filters.year,
                }
            });
            setMovies((prevMovies) => [...prevMovies, ...data['results']]);
            setCurrentPage((prevPage) => prevPage + 1);
            setIsLoading(false);
        } catch (error) {
            if (error.response.status !== 404) {
                console.log(error)
            }
        }
    }, [currentPage, isLoading]);

    const getData = async () => {
        setIsLoading(true);
        const { data } = await axios.get('http://localhost:8000/api/', {
            'params': {
                'search': query,
                'rating': filters.rating,
                'language': filters.language,
                'year': filters.year,

            }
        });
        setMovies(data['results']);
        setIsLoading(false);
    };

    useEffect(() => {
        (async () => {
            console.log(filters);

            setIsLoading(true);
            const { data } = await axios.get('http://localhost:8000/api/', {
                'params': {
                    'search': query,
                    'rating': filters.rating,
                    'genre': filters.genre,
                    'language': filters.language,
                    'year': filters.year,

                }
            });
            setMovies(data['results']);
            console.log(movies)
            setIsLoading(false);
        })();
    }, [filters]);

    useEffect(() => {
        // fetching initial movie list
        (async () => {
            setIsLoading(true);
            const { data } = await axios.get('http://localhost:8000/api/');
            setMovies(data['results']);
            setIsLoading(false);
        })();
    }, []);

    useEffect(() => {
        // getting filter arguments
        (async () => {
            const { data } = await axios.get("http://localhost:8000/api/filters/");
            setFilterArgs({ 'genres': data.genres, 'languages': data.languages });
        })();
    }, []);

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
        <div className="dashboard">
            <div class="search-bar">
                <input type="text" placeholder="Search..." value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setTimeout(() => getData(), 300);
                        console.log(e.target.value);
                    }}
                />
            </div>
            <div className="filters">
                <div className="filter-item">
                    <label htmlFor="genre">Genre:</label>
                    <select id="genre" name="genre" value={filters.genre} onChange={(event) => setFilters({ ...filters, genre: event.target.value })}>
                        <option value="">All</option>
                        {filterArgs['genres'].map((element) => (
                            <option value={element}>{element}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-item">
                    <label htmlFor="language">Language:</label>
                    <select id="language" name="language" value={filters.language} onChange={(event) => setFilters({ ...filters, language: event.target.value })}>
                        <option value="">All</option>
                        {filterArgs['languages'].map((element) => (
                            <option value={element}>{element}</option>
                        ))}
                    </select>
                </div>
                <div class="filter-item">
                    <label htmlFor="rating">Rating:</label>
                    <select id="rating" name="rating" value={filters.rating}
                        onChange={(event) => {
                            setFilters((prevFilters) => ({
                                ...prevFilters,
                                rating: event.target.value
                            }));
                        }}
                    >
                        <option value="">All</option>
                        {[9, 8, 7, 6, 5, 4, 3, 2, 1].map((rating) => (
                            <option key={rating} value={rating}>
                                {rating} and above
                            </option>
                        ))}
                    </select>
                </div>
                <div class="filter-item">
                    <label htmlFor="releaseY">Released in:</label>
                    <select
                        value={filters.releaseY}
                        onChange={(event) => setFilters({ ...filters, release_year: event.target.value })}
                    >
                        {years.map((year) => (
                            <option value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div class="movies-container">
                {movies.map((movie) => (
                    <div class="movie-item" key={movie.id}>
                        <a href={'/movie/' + movie.id}>
                            <img src={movie.image.slice(0, -3) + 'QL225_UY621_CR0,0,447,621r.jpg'} alt={movie.name} />
                            <div class="movie-info">
                                <h3>{movie.name}</h3>
                                <p>{movie.description}</p>
                                <span class='rating'>Rating: {movie.rating}</span>
                                <span>Release Date: {movie.release_date}</span>
                                <span>Content Rating: {movie.content_rating}</span>
                                <span>Duration: {movie.duration.slice(2)}</span>
                                <span>Language: {movie.language}</span>
                            </div>
                        </a>
                    </div>
                ))}
                <div ref={loaderRef}></div>
            </div>
        </div >
    );
};

export default Home;
