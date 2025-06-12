import { useEffect, useCallback, useRef, useState } from "react";
import axios from "axios";
import { Link, Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export default function Test() {
    const googleClientId = process.env.REACT_APP_GOOGLE_OAUTH2_CLIENT_ID;
    const channeliClientId = process.env.REACT_APP_CHANNELI_OAUTH_CLIENT_ID;
    const googelCallbackUri = process.env.REACT_APP_BASE_BACKEND + "/auth/oauth2_google/callback/";
    const channeliCallbackUri = process.env.REACT_APP_BASE_BACKEND + "/auth/oauth2_channeli/callback/";
    
    return (
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
    );
}