import { useEffect, useCallback, useRef, useState } from "react";
import axios from "axios";
import { Link, Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export default function Test() {
    


    const toogleFav = async () => {
        return <Navigate to="/#/" />;
    }

    return (
        <>
            <button onClick={toogleFav}>button</button>
        </>

    );
};