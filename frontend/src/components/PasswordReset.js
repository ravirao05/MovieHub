import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate, useParams } from 'react-router-dom';
import "./Signup.css";


export default function PasswordReset() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState(false);
    const [tokenValidated, setTokenValidated] = useState(false);
    const { username } = useParams();
    const { token } = useParams();
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (localStorage.getItem("access_token")) {
            (async () => {
                try {
                    const { data } = await axios.get(process.env.REACT_APP_BASE_BACKEND + "/api/profile/", {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    if (data.is_email_verified) {
                        navigate("/");
                    } else {
                        navigate("/signup");
                    }
                } catch (e) {
                    console.log(e);
                }
            })();
        }

        if (username && token) {
            (async () => {
                const request = await axios.get(process.env.REACT_APP_BASE_BACKEND + "/auth/reset_password/", {
                    params: {
                        token: token,
                        username: username
                    }
                });
                if (request.status === 200) {
                    setTokenValidated(true);
                } else setErrors(request.response.data);
            })();
        }
    }, []);

    const submitPassword = async (e) => {
        e.preventDefault();

        if (!password) {
            setErrors({ 'error': 'password required' });
        }

        const request = await axios.post(
            process.env.REACT_APP_BASE_BACKEND + "/auth/reset_password/",
            {
                username: username,
                token: token,
                password: password
            }
        );
        if (request.status === 200) {
            setErrors({});
            setSuccessMessage('Password reset successfull')
            navigate("/login");
        } else setErrors(request.response.data);

    };

    const submitEmail = async (e) => {
        e.preventDefault();

        const request = await axios.patch(
            process.env.REACT_APP_BASE_BACKEND + "/auth/reset_password/",
            { email: email }
        );
        console.log(request)
        if (request.status === 200) {
            setErrors({});
            setSuccessMessage('Check your email and click on the link to reset your password')
            // navigate("/");
        } else setErrors(request.response.data);

    };


    return (
        <div className="signup-page">
            <div className='error'>
                {Object.entries(errors).map(([key, message]) => (
                    <p className="error-message">{`${key}: ${message}`}</p>
                ))}
            </div>
            <p className="success-message">{successMessage}</p>
            {!tokenValidated ?
                <form className="signup-form" onSubmit={submitEmail}>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Send password reset link</button>
                    </div>
                    <div className="login">
                        <Link to="/login">Login</Link>
                    </div>
                    <div className="signup">
                        <Link to="/signup">Signup</Link>
                    </div>
                    <div className="social-login">
                        {/* Implement social login buttons here */}
                    </div>
                </form>
                :
                <form className="signup-form" onSubmit={submitPassword}>
                    Choose a new message<p/>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <button type='submit'>Submit</button>
                    </div>
                </form>}
        </div>
    );
};