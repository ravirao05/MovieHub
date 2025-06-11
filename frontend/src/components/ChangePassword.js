import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import "./Login.css";


export default function Login() {
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

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPassword2, setNewPassword2] = useState('');
    const [flag, setFlag] = useState(false);
    const [errors, setErrors] = useState({});


    const submit = async (e) => {
        e.preventDefault();

        const user = {
            currentPassword: currentPassword,
            newPassword: newPassword,
        };

        const request = await axios.post(
            "http://localhost:8000/auth/change_password/",
            user,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        console.log(request);
        if (request.status === 200) {
            setFlag(true);
            setErrors({});
        } else setErrors(request.response.data)

    };


    return (
        <div className="password-page">
            <div className='error'>
                {Object.entries(errors).map(([key, message]) => (
                    <p className="error-message">{`${key}: ${message}`}</p>
                ))}
            </div>
            {flag && (<div className='success'>
                <p className="success-message">Password Changed Successfully</p>
            </div>)}
            <form className="password-form" onSubmit={submit}>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={newPassword2}
                        onChange={(e) => setNewPassword2(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <button type="submit">Save</button>
                </div>
            </form>
        </div>
    );
};