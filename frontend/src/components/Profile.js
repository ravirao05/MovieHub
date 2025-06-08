import React, { useState, useEffect } from 'react';
import axios from "axios";

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
    const [movies, setMovies] = useState([{ id: 1 }]);

    useEffect(() => {
        setTimeout(() => {
            (async () => {
                const { data } = await axios.get('http://localhost:8000/api/profile/');
                setProfileData(data);
            })();
        }, 3000);
    }, []);

    console.log(profileData);

    return (
        <div className="profile-container">
            <a href='#' className="edit-profile">Edit Profile</a>
            <img src={profileData.profile} alt={`${profileData.username}'s profile picture`} className="profile-image-big" />
            <h1 className="profile-username">@{profileData.username}</h1>
            <p className="profile-email">Email: {profileData.email}</p>
            <p className="profile-name">Name: {profileData.name}</p>
            <h2 className="favourite-heading">Favourite Movies</h2>
            <ul className="faourite-list">
                {profileData.favourite.map((movie) => (
                    <li className="favourite-item" key={movie.id}>
                        <a href={'/movie/' + movie.id}>
                            <img src={movie.image.slice(0, -3) + 'QL56_UY210_CR12,0,148,210_.jpg'} alt={movie.name} />
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};