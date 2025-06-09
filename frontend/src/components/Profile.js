import React, { useState, useEffect } from 'react';
import axios from "axios";
import "./Profile.css"

export default function Profile() {
    useEffect(() => {
        if (localStorage.getItem('access_token') === null) {
            window.location.href = '/login'
        }
        else {
            setTimeout(() => {
                (async () => {
                    try {
                        await axios.get('http://localhost:8000/auth/');
                    } catch (e) {
                        console.log('not auth')
                    }
                })()
            }, 3000);
        };
    }, []);

    const [profileData, setProfileData] = useState({
        favourite: [],
    });
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [movies, setMovies] = useState([{ id: 1 }]);

    useEffect(() => {
        setTimeout(() => {
            (async () => {
                const { data } = await axios.get('http://localhost:8000/api/profile/');
                console.log(data)
                if (data) setProfileData(data);
            })();
        }, 2000);
    }, []);


    return (
        <div className="profile-container">
            {!editMode && (
                <button
                    className="edit-profile"
                    onClick={() => setEditMode(!editMode)}
                >
                    Edit Profile
                </button>
            )}

            <div className="logout">
                <button>Logout</button>
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

                    <h1 className="profile-username">
                        @ <input type="text" value={profileData.username} onChange={(e) => setUsername(e.target.value)} />
                    </h1>

                    <p className="profile-email">
                        Email: <input type="text" value={profileData.email} onChange={(e) => setEmail(e.target.value)} />
                    </p>

                    <p className="profile-name">
                        Name: <input type="text" value={profileData.name} onChange={(e) => setName(e.target.value)} />
                    </p>

                    <div className="profile-password">
                        <p>New password: <input type="text" onChange={(e) => setName(e.target.value)} /></p>
                        <p>Confirm password: <input type="text" onChange={(e) => setName(e.target.value)} /></p>
                    </div>
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
                        <a href={"/movie/" + movie.id}>
                            <img src={movie.image.slice(0, -3) + "QL56_UY210_CR12,0,148,210_.jpg"} alt={movie.name} />
                        </a>
                    </span>
                ))}
            </div>
        </div>

    );
};