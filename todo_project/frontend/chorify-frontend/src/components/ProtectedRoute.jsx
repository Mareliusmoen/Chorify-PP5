import { Navigate } from 'react-router-dom';

export function isAuthenticated() {
    const userToken = localStorage.getItem('Token');
    return !!userToken;
}

function ProtectedRoute({ children }) {
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }
    return children;
}

export default ProtectedRoute;