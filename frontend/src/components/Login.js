import React, { useState } from 'react';
import axios from "axios";
import "./Login.css";


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const submit = async (e) => {
        e.preventDefault();

        const user = {
            username: username,
            password: password,
        };

        const { data } = await axios.post(
            "http://localhost:8000/auth/login/",
            user,
            {
                headers: {
                    "Content-Type": "application/json",
                },
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
        <div className="login-page">
            <form className="login-form" onSubmit={submit}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Username or Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                    <button type="submit">Login</button>
                </div>
                <div className="forgot-password">
                    <a href="#">Forgot password?</a>
                </div>
                <div className="signup">
                    <a href="#">Signup</a>
                </div>
                <div className="social-login">
                    {/* Implement social login buttons here */}
                </div>
            </form>
        </div>
    );
};

export default Login;