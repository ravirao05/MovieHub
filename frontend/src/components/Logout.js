import { useEffect, useState } from "react";
import axios from "axios";

export const Logout = () => {
    useEffect(() => {
        (async () => {
            const { data } = await axios.post(
                "http://localhost:8000/auth/logout/",
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
            window.location.hash = "/login";
        })();
    }, []);

    return <div>logging out</div>;
};
export default Logout;