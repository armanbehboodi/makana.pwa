import React from 'react';
import {Navigate} from 'react-router-dom';
import {getCookie} from "../../helper/CookieHandler";

interface ProtectedRouteProps {
    component: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({component}) => {
    const isValid = getCookie("mk-login-token");

    if (!isValid) {
        return <Navigate to="/register"/>
    }

    return component;
};

export default ProtectedRoute;