import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import "./Signup.css";


export default function Signup() {
    useEffect(() => {
        if (localStorage.getItem('access_token')) {
            window.location.hash = '/'
        }
    }, []);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [profile, setProfile] = useState(null);
    const [errors, setErrors] = useState({});

    const submit = async (e) => {
        e.preventDefault();


        let content = new FormData();
        content.append('name', name);
        content.append('username', username);
        content.append('password', password);
        content.append('email', email);
        if (profile) content.append('profile', profile);

        const request = await axios.post(
            "http://localhost:8000/auth/signup/",
            content,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            },
            { withCredentials: true }
        );
        if (request.data) {
            localStorage.clear();
            localStorage.setItem("access_token", request.data.access);
            localStorage.setItem("refresh_token", request.data.refresh);
            axios.defaults.headers.common["Authorization"] = `Bearer ${request.data["access"]}`;
            window.location.hash = '/';
        } else setErrors(request.response.data)

    };


    return (
        <div className="signup-page">
            <div className='error'>
                {Object.entries(errors).map(([key, message]) => (
                    <p className="error-message">{`${key}: ${message}`}</p>
                ))}
            </div>
            <form className="signup-form" onSubmit={submit}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label for="profile">Don't be blue. Click here to choose your own avatar.</label>
                    <input id="profile" type="file" accept="image/*" class="file-hidden" onChange={(event) => setProfile(event.target.files[0])} />
                </div>
                <div className="form-group">
                    <button type="submit">Signup</button>
                </div>
                <div className="login">
                    <Link to="/login">Login</Link>
                </div>
                <div className="social-login">
                    {/* Implement social login buttons here */}
                </div>
            </form>
        </div>
    );
};