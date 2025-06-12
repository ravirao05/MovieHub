import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        (async () => {
            const { data } = await axios.post(
                process.env.REACT_APP_BASE_BACKEND + "/auth/logout/",
                {
                    refresh_token: localStorage.getItem("refresh_token"),
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
                { withCredentials: true }
            );

            console.log("logout", data);
            localStorage.clear();
            axios.defaults.headers.common["Authorization"] = null;
            navigate("/login");
        })();
    }, []);

    return <div>logging out</div>;
};
export default Logout;