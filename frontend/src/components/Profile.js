import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import "./Profile.css"

export default function Profile() {
    useEffect(() => {
        if (localStorage.getItem("access_token") === null) {
            window.location.hash = "/login";
        } else {
            (async () => {
                const { data } = await axios.get("http://localhost:8000/api/profile/", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (data) {
                    if (!data.is_email_verified) {
                        window.location.hash = "/signup";
                    }
                } else {
                    window.location.hash = "/login";
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
    const [editMode, setEditMode] = useState(window.location.hash.includes("edit"));
    const [movies, setMovies] = useState([{ id: 1 }]);


    const fetchData = async () => {
        const { data } = await axios.get('http://localhost:8000/api/profile/');
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
            "http://localhost:8000/api/profile/",
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
            setEditMode(false);
            window.location.hash = "/profile";
        } else setErrors(request.response.data)
    };

    return (
        <div className="profile-container">
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
                            <Link to="/profile?edit"><li>Edit account info</li></Link>
                            <Link to="/change_password"><li>Change password</li></Link>
                            <Link to="/logout"><li>Logout</li></Link>
                        </ul>
                    </div>
                )}

            </div>
            {editMode ? (
                <>
                    <label htmlFor="profile">Choose a new avatar.</label>
                    <input
                        id="profile"
                        type="file"
                        accept="image/*"
                        className="file-hidden"
                        onChange={(event) => setProfile(event.target.files[0])}
                    />

                    <h1 className="profile-username">@ {profileData.username}</h1>


                    <p className="profile-email">
                        Email: <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </p>

                    <p className="profile-name">
                        Name: <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </p>

                </>
            ) : (
                <>
                    <img
                        src={profileData.profile}
                        alt={`${profileData.username}'s profile picture`}
                        className="profile-image-big"
                    />

                    <h1 className="profile-username">@ {profileData.username}</h1>

                    <p className="profile-email">Email: {profileData.email}</p>

                    <p className="profile-name">Name: {profileData.name}</p>
                </>
            )}

            <h2 className="favourite-heading">Favourite Movies</h2>

            <div className="faourite-list">
                {profileData.favourite.map((movie) => (
                    <span className="favourite-item" key={movie.id}>
                        <Link to={"/movie/" + movie.id}>
                            <img src={movie.image.slice(0, -3) + "QL56_UY210_CR12,0,148,210_.jpg"} alt={movie.name} />
                        </Link>
                        {editMode && (<button className="remove-favourite" onClick={() => {
                            const updatedProfileData = {
                                ...profileData,
                                favourite: profileData.favourite.filter((mov) => mov.id !== movie.id),
                            };
                            setProfileData(updatedProfileData);
                        }
                        } >
                            X
                        </button>)}
                    </span>

                ))}
            </div>
            {editMode && (<button className='save-profile' onClick={saveProfile}>Save</button>)}
        </div >

    );
};