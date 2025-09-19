import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
    const token = localStorage.getItem("token");

    if (token) {
        // User is logged in, redirect to dashboard
        return <Navigate to="/" replace />;
    }

    return children;
}
