import React, { useState } from 'react';
import axios from "axios";
import "./Signup.css";


export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [profile, setProfile] = useState(null);

    const submit = async (e) => {
        e.preventDefault();


        let content = new FormData();
        content.append('name', name);
        content.append('username', username);
        content.append('password', password);
        content.append('email', email);
        if (profile) content.append('profile', profile);
        console.log(content)
        const { data } = await axios.post(
            "http://localhost:8000/auth/signup/",
            content,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            },
            { withCredentials: true }
        );

        localStorage.clear();
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data["access"]}`;
        window.location.href = '/';
    };


    return (
        <div className="signup-page">
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
                    <a href="/login">Login</a>
                </div>
                <div className="social-login">
                    {/* Implement social login buttons here */}
                </div>
            </form>
        </div>
    );
};