import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import "./Signup.css";


export default function Signup() {
    const navigate = useNavigate();
    const googleClientId = process.env.REACT_APP_GOOGLE_OAUTH2_CLIENT_ID;
    const channeliClientId = process.env.REACT_APP_CHANNELI_OAUTH_CLIENT_ID;
    const googelCallbackUri = process.env.REACT_APP_BASE_BACKEND + "/auth/oauth2_google/callback/";
    const channeliCallbackUri = process.env.REACT_APP_BASE_BACKEND + "/auth/oauth2_channeli/callback/";
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [profile, setProfile] = useState(null);
    const [successMessage, setSuccessMessage] = useState(false);
    const [emailVerifier, setEmailVerifier] = useState(false);
    const [otp, setOTP] = useState(null);
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
                    setEmail(data.email);
                    if (data.is_email_verified) {
                        navigate("/");
                    } else {
                        setEmailVerifier(true);
                    }
                } catch (e) {
                    console.log(e);
                }
            })();
        }
    }, []);

    const signupSubmit = async (e) => {
        e.preventDefault();


        let content = new FormData();
        content.append('name', name);
        content.append('username', username);
        content.append('password', password);
        content.append('email', email);
        if (profile) content.append('profile', profile);

        const request = await axios.post(
            process.env.REACT_APP_BASE_BACKEND + "/auth/signup/",
            content,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            },
            { withCredentials: true }
        );
        if (request.status === 201) {
            setEmailVerifier(true);
            localStorage.clear();
            localStorage.setItem("access_token", request.data.access);
            localStorage.setItem("refresh_token", request.data.refresh);
            axios.defaults.headers.common["Authorization"] = `Bearer ${request.data["access"]}`;
        } else setErrors(request.response.data)

    };

    const otpSubmit = async () => {

        const request = await axios.post(
            process.env.REACT_APP_BASE_BACKEND + "/auth/activate_account/",
            { OTP: otp }
        );
        if (request.status === 200) {
            setSuccessMessage('OTP verified successfully');
            navigate("/");
        } else setErrors(request.response.data)
    };

    const resendOTP = async () => {
        const request = await axios.patch(
            process.env.REACT_APP_BASE_BACKEND + "/auth/activate_account/");
        if (request.status === 200) {
            setSuccessMessage('OTP resend successfully')
        } else setErrors(request.response.data)
    };


    return (
        <div className="signup-page">
            <div className='error'>
                {Object.entries(errors).map(([key, message]) => (
                    <p className="error-message">{`${key}: ${message}`}</p>
                ))}
            </div>
            <p className="success-message">{successMessage}</p>
            {!emailVerifier ?
                <form className="signup-form" onSubmit={signupSubmit}>
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
                        <label htmlFor="profile">Don't be blue. Click here to choose your own avatar.</label>
                        <input id="profile" type="file" accept="image/*" className="file-hidden" onChange={(event) => setProfile(event.target.files[0])} />
                    </div>
                    <div className="form-group">
                        <button type="submit">Signup</button>
                    </div>
                    <div className="login">
                        <Link to="/login">Login</Link>
                    </div>
                    <div className="social-login">
                        <div className='google-login'>
                            <div id="g_id_onload"
                                data-client_id={googleClientId}
                                data-context="signin"
                                data-ux_mode="popup"
                                data-login_uri={googelCallbackUri}
                                data-auto_prompt="false">
                            </div>

                            <div class="g_id_signin"
                                data-type="standard"
                                data-shape="pill"
                                data-theme="filled_black"
                                data-text="signin_with"
                                data-size="large"
                                data-logo_alignment="left">
                            </div>
                        </div>

                        <div className='channeli-login'>
                            <a href={"http://channeli.in/oauth/authorise?client_id=" + channeliClientId + "&redirect_uri=" + channeliCallbackUri}>
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAkCAYAAAAOwvOmAAAACXBIWXMAABCcAAAQnAEmzTo0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAG7SURBVHgB7ZdNSwJRFIbfuSY2ljApJhmE0CYiMFpEkkRFHxBtjaBd9ROqbevoL1QQtAzamFKrCoJqFbiqVSSRi4pIzBLCzigEMpb3XsEZYh4QwTnCw51z3jmjYLtYhJVYUhQGC2JL8WJL8WJJqSbUic8FjAcAhwM4zwDpPOpGWqpXA9bDwFx35e/xe2DlCrh5gzRSty/UChxOGYV0ZruA0xlgwAtpxKUo/3eiZbHfCLiB3ZFybUOkwnQCY8HadX1UFwtBCmGpSDt/bY8GKYSlXAL/cDoghbBUOsdfeyc5gcJS8TTw8lm77vkDSD5ACmGpAk3U8hl9f/1dt5kCHiWDVCqnDui01iggM+/Ga690iquXwEYK0ij1bJ56Vk1TPIx2oJRJF090y0j4Ngt5aPNU7HWYE1uKl3+y5NFYDPoBN8cj5ISWPppvYaSWvMQkbZxq7TplC1JSdk/x0tTPcrjOFKpfVemtwONGo2HHMRVRjZ6u2bzxky/ADJi/hWF/wYuhoBNWodRTAQ9DctGHSKc1xH4aXVMZjkhs2AJiFdPnaS6f2ETIBTMxRIIutjffhoiJPVY1p/QeS5jYY99ezWAQS3quOQAAAABJRU5ErkJggg==" alt="Channeli Logo" class="sc-furwcr cLelLH" />
                                Sign in with Channeli
                            </a>
                        </div>
                    </div>
                </form>
                :
                <div className="signup-form">
                    <div className="form-group">
                        Enter the OTP sent on {email}<p />
                        <input
                            type="number"
                            placeholder="OTP"
                            name="otp"
                            value={otp}
                            onChange={(e) => setOTP(e.target.value)}
                        />
                    </div>
                    <div className="resend-otp">
                        <Link to="#" onClick={resendOTP}>Resend OTP</Link>
                    </div>
                    <div className="form-group">
                        <button onClick={otpSubmit}>Submit</button>
                    </div>
                </div>}
        </div>
    );
};