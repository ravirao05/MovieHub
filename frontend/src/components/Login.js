import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import "./Login.css";


const Login = () => {
    useEffect(() => {
        if (localStorage.getItem("access_token")) {
            window.location.hash = "/";
        }
    }, []);
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});


    const submit = async (e) => {
        e.preventDefault();

        const user = {
            username: username,
            password: password,
        };

        const request = await axios.post(
            "http://localhost:8000/auth/login/",
            user,
            {
                headers: {
                    "Content-Type": "application/json",
                },
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
        <div className="login-page">
            <div className='error'>
                {Object.entries(errors).map(([key, message]) => (
                    <p className="error-message">{`${key}: ${message}`}</p>
                ))}
            </div>
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
                    <Link to="#">Forgot password?</Link>
                </div>
                <div className="signup">
                    <Link to="/signup">Signup</Link>
                </div>
                <div className="social-login">
                    {/* Implement social login buttons here */}
                </div>
            </form>
        </div>
    );
};

export default Login;
