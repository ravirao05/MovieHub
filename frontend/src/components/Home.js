import { useEffect, useCallback, useRef, useState } from "react";
import axios from "axios";

function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [movies, setMovies] = useState([]);
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const years = Array.from({ length: 100 }, (_, index) => 2024 - index);
    const [noMoreMovie, setNoMoreMovie] = useState(false);
    const [profilePicture, setProfilePicture] = useState('')
    const [profileHref, setProfileHref] = useState('')
    const [filterArgs, setFilterArgs] = useState({
        genres: [],
        languages: []
    });
    const [filters, setFilters] = useState({
        genre: '',
        rating: '',
        year: '',
        language: ''
    });
    const loaderRef = useRef(null);

    const fetchData = useCallback(async () => {
        if (isLoading || noMoreMovie) return;

        setIsLoading(true);
        try {
            const { data } = await axios.get('http://localhost:8000/api/', {
                'params': {
                    'page': currentPage,
                    'search': query,
                    'rating__gte': filters.rating,
                    'genre__icontains': filters.genre,
                    'language__icontains': filters.language,
                    'release_date__icontains': filters.year,
                }
            });
            if (data) {
                setMovies((prevMovies) => [...prevMovies, ...data['results']]);
                setCurrentPage((prevPage) => prevPage + 1);
            }
        } catch (error) {
            console.log(error);
            if (error.response.status === 404) {
                setNoMoreMovie(true);
            } else {
                console.log(error);
            }
        }
        setIsLoading(false);
    }, [currentPage,]);

    const search = async () => {
        setIsLoading(true);
        const { data } = await axios.get('http://localhost:8000/api/', {
            'params': {
                'search': query,
                'rating__gte': filters.rating,
                'genre__icontains': filters.genre,
                'language__icontains': filters.language,
                'release_date__icontains': filters.year,
            }
        });
        if (data) setMovies(data['results']);
        setIsLoading(false);
    };

    useEffect(() => {
        if (query) {
            setTimeout(() => search(), 700);
        } else {
            search();
        }
    }, [filters, query]);

    useEffect(() => {
        setTimeout(() => {
            (async () => {
                const { data } = await axios.get('http://localhost:8000/api/profile/');
                if (data) {
                    setProfilePicture(data.profile);
                }
            })();
        }, 3000);
    }, []);

    useEffect(() => {
        // getting filter arguments
        setTimeout(() => {
            (async () => {
                const { data } = await axios.get("http://localhost:8000/api/filters/");
                setFilterArgs({ 'genres': data.genres, 'languages': data.languages });
            })();
        }, 3000);
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
            <span className="profile">
                <a href={profilePicture ? '/profile' : '/login'}>{profilePicture ? <img src={profilePicture} alt="Profile Image" /> : <button className="profile">Login</button>}</a>
            </span>
            <div className="search-bar">
                <input type="text" placeholder="Search..." value={query}
                    onChange={(e) => setQuery(e.target.value)}
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
                <div className="filter-item">
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
                <div className="filter-item">
                    <label htmlFor="releaseY">Released in:</label>
                    <select
                        value={filters.releaseY}
                        onChange={(event) => setFilters({ ...filters, year: event.target.value })}
                    >
                        <option value="">All</option>

                        {years.map((year) => (
                            <option value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="movies-container">
                {movies.map((movie) => (
                    <div className="movie-item" key={movie.id}>
                        <a href={'/movie/' + movie.id}>
                            <img src={movie.image.slice(0, -3) + 'QL112_UY421_CR12,0,285,421_.jpg'} alt={movie.name} />
                            <div className="movie-info">
                                <h3>{movie.name}</h3>
                                <div className='rating'>Rating: {movie.rating}</div>
                                <div>Release Date: {movie.release_date}</div>
                                <div>Content Rating: {movie.content_rating}</div>
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