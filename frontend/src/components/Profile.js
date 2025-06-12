import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import "./Profile.css"

export default function Profile() {
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("access_token") === null) {
            navigate("/login");
        } else {
            (async () => {
                const { data } = await axios.get(process.env.REACT_APP_BASE_BACKEND + "/api/profile/", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (data) {
                    if (!data.is_email_verified) {
                        // navigate("/signup");
                    }
                } else {
                    // navigate("/login");
                }
            })();
        }
    }, []);

    const [menuOpen, setMenuOpen] = useState(false);
    const [profileData, setProfileData] = useState({
        favourite: [],
    });
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [profile, setProfile] = useState(null);
    const [errors, setErrors] = useState({});
    const [recomendations, setRecomendations] = useState([]);
    const [movies, setMovies] = useState([{ id: 1 }]);


    const fetchData = async () => {
        const { data } = await axios.get(process.env.REACT_APP_BASE_BACKEND + '/api/profile/');
        console.log(data)
        if (data) {
            setProfileData(data);
            setUsername(data.username);
            setName(data.name);
            setEmail(data.email);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    useEffect(() => {
        (async () => {
            const { data } = await axios.get(process.env.REACT_APP_BASE_BACKEND + '/api/recomendations/');
            if (data) {
                setRecomendations(data['results']);
            }
        })();
    }, []);

    const saveProfile = async () => {
        let favouriteMovieId = [];
        profileData.favourite.map((movie) => {
            favouriteMovieId.push(movie.id);
        })
        let content = new FormData();
        content.append('name', name);
        content.append('username', username);
        content.append('email', email);
        for (var i = 0; i < favouriteMovieId.length; i++) {
            content.append('favourite', favouriteMovieId[i]);
        }
        if (profile) content.append('profile', profile);
        const request = await axios.patch(
            process.env.REACT_APP_BASE_BACKEND + "/api/profile/",
            content,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            },
        );
        if (request.data) {
            fetchData();
            setErrors({});
            alert('Profile saved successfully');
            navigate('/profile');
        } else setErrors(request.response.data)
    };

    return (
        <div className='profile-page'>
            <div className='error'>
                {Object.entries(errors).map(([key, message]) => (
                    <p className="error-message">{`${key}: ${message}`}</p>
                ))}
            </div>
            <div className="profile-icon" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
                <img src={profileData.profile} alt="Profile Image" />
                {menuOpen && (
                    <div className="profile-menu">
                        <ul>
                            <Link to="/"><li>Home</li></Link>
                            <Link to="/change_password"><li>Change password</li></Link>
                            <Link to="/logout"><li>Logout</li></Link>
                        </ul>
                    </div>
                )}
            </div>
            <div className="profile-container">
                <div className='profile-image'>
                    <img
                        src={profileData.profile}
                        alt={`${profileData.username}'s profile picture`}
                        className="profile-image-big"
                    />
                    <br />
                    <label htmlFor="profile">Choose a new avatar.</label>
                    <input
                        id="profile"
                        type="file"
                        accept="image/*"
                        className="file-hidden"
                        onChange={(event) => setProfile(event.target.files[0])}
                    />
                </div>
                <div className='profile-info'>

                    <h1 className="profile-username">@ {profileData.username}</h1>


                    <p className="profile-email">
                        <b>Email: </b><br /><input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </p>

                    <p className="profile-name">
                        <b>Name: </b><br /><input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </p>
                </div>
            </div>
            <div>
                {profileData.favourite.length > 0 && (<><h2 className="favourite-heading">Favourite Movies</h2><div className="faourite-list">
                    {profileData.favourite.map((movie) => (
                        <span className="favourite-item" key={movie.id}>
                            <Link to={"/movie/" + movie.id}>
                                <img src={movie.image.slice(0, -3) + "QL56_UY210_CR12,0,148,210_.jpg"} alt={movie.name} />
                            </Link>
                            <button className="remove-favourite" onClick={() => {
                                const updatedProfileData = {
                                    ...profileData,
                                    favourite: profileData.favourite.filter((mov) => mov.id !== movie.id),
                                };
                                setProfileData(updatedProfileData);
                            }}>
                                X
                            </button>
                        </span>

                    ))}
                </div></>)}
                <div className='save-profile'><button onClick={saveProfile}>Save</button></div>
            </div >

            {recomendations.length > 0 && (
                <><h2>You might also like...</h2>
                    <div class="recomendation-container">
                        {recomendations.map((movie) => (
                            <div className="movie-item">
                                <Link to={'/movie/' + movie.id}>
                                    <img src={movie.image.slice(0, -3) + 'QL112_UY421_CR12,0,285,421_.jpg'} alt={movie.name} />
                                    <div className="movie-info">
                                        <h3>{movie.name}</h3>
                                        <div className='rating'>Rating: {movie.rating}</div>
                                        <div>Release Date: {movie.release_date}</div>
                                        <div>Content Rating: {movie.content_rating}</div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div></>
            )}
        </div>
    );
};