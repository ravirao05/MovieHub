import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import "./Login.css";


const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [errors, setErrors] = useState({});
    const googleClientId = process.env.REACT_APP_GOOGLE_OAUTH2_CLIENT_ID;
    const channeliClientId = process.env.REACT_APP_CHANNELI_OAUTH_CLIENT_ID;
    const googelCallbackUri = process.env.REACT_APP_BASE_BACKEND + "/auth/oauth2_google/callback/";
    const channeliCallbackUri = process.env.REACT_APP_BASE_BACKEND + "/auth/oauth2_channeli/callback/";


    useEffect(() => {
        if (localStorage.getItem("access_token")) {
            navigate("/");
        }
        if (searchParams.get('access') && searchParams.get('refresh')) {
            localStorage.setItem("access_token", searchParams.get('access'));
            localStorage.setItem("refresh_token", searchParams.get('refresh'));
            axios.defaults.headers.common["Authorization"] = `Bearer ${searchParams.get('access')}`;
            navigate("/");
        }
    }, []);


    const submit = async (e) => {
        e.preventDefault();

        const user = {
            username: username,
            password: password,
        };

        const request = await axios.post(
            process.env.REACT_APP_BASE_BACKEND + "/auth/login/",
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
            navigate("/");
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
                    <Link to="/reset_password">Forgot password?</Link>
                </div>
                <div className="signup">
                    <Link to="/signup">Signup</Link>
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
                        <a href={"http://channeli.in/oauth/authorise?client_id=" + channeliClientId + "&redirect_uri=" + channeliCallbackUri} class="sc-iCfMLu eCfizE">
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAkCAYAAAAOwvOmAAAACXBIWXMAABCcAAAQnAEmzTo0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAG7SURBVHgB7ZdNSwJRFIbfuSY2ljApJhmE0CYiMFpEkkRFHxBtjaBd9ROqbevoL1QQtAzamFKrCoJqFbiqVSSRi4pIzBLCzigEMpb3XsEZYh4QwTnCw51z3jmjYLtYhJVYUhQGC2JL8WJL8WJJqSbUic8FjAcAhwM4zwDpPOpGWqpXA9bDwFx35e/xe2DlCrh5gzRSty/UChxOGYV0ZruA0xlgwAtpxKUo/3eiZbHfCLiB3ZFybUOkwnQCY8HadX1UFwtBCmGpSDt/bY8GKYSlXAL/cDoghbBUOsdfeyc5gcJS8TTw8lm77vkDSD5ACmGpAk3U8hl9f/1dt5kCHiWDVCqnDui01iggM+/Ga690iquXwEYK0ij1bJ56Vk1TPIx2oJRJF090y0j4Ngt5aPNU7HWYE1uKl3+y5NFYDPoBN8cj5ISWPppvYaSWvMQkbZxq7TplC1JSdk/x0tTPcrjOFKpfVemtwONGo2HHMRVRjZ6u2bzxky/ADJi/hWF/wYuhoBNWodRTAQ9DctGHSKc1xH4aXVMZjkhs2AJiFdPnaS6f2ETIBTMxRIIutjffhoiJPVY1p/QeS5jYY99ezWAQS3quOQAAAABJRU5ErkJggg==" alt="Channeli Logo" class="sc-furwcr cLelLH" />
                            &nbsp; Sign in with Channeli
                        </a>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Login;
