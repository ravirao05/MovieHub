import React, { useState } from 'react';
import axios from "axios";
import "./ChangePassword.css";


export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setnewPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');

    const submit = async (e) => {

    };


    return (
        <div className="change-password-page">
            <form className="change-password-form" onSubmit={submit}>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Current Password"
                        value={password}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={password}
                        onChange={(e) => setCurrentPassword(e.target.value)}
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