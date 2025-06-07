import { useEffect, useState } from "react";

function Login() {
    const client_id = 'BtNQbIxijd97Vnp5Th12pzQoWvXzhRnR62ULWIDx';
    const client_secret = 'IqaErtocdYNy4p0RBGmrKeNMO6dhbyKgreo2BKbCPCPiZjR7AskUiVKoaUPYRp03vuufwqfHqB6t4WIMh0i20v5yru58iPar6k2rzaLCObtOM1mZZwcgsUI2CP586wNx'
    const url = "https://channeli.in/oauth/authorise?client_id=" + client_id
    return (
        < a href={url} > Sign in with google.</a >
    );
}

export default Login;