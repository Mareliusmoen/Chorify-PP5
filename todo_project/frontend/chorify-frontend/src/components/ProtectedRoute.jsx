import { Navigate } from 'react-router-dom';

/**
 * Checks if the user is authenticated based on the presence of 
 * a token in local storage.
 *
 * @return {boolean} True if the user has a token, otherwise false
 */
export function isAuthenticated() {
    const userToken = localStorage.getItem('Token');
    return !!userToken;
}

/**
 * Renders the children components if the user is authenticated, 
 * otherwise redirects to the login page.
 *
 * @param {Object} children - The components to be rendered
 * @return {Object} Either the children components or a Navigate 
 * component to the login page
 */
function ProtectedRoute({ children }) {
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }
    return children;
}

export default ProtectedRoute;