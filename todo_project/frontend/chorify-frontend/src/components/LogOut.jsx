import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * LogOut component to handle user logout.
 * It clears the authentication token from
 * localStorage and redirects to the login 
 * page using the navigate function from 
 * the useNavigate hook.
 *
 * It has no parameters and does not return
 * a value since it's a component that 
 * renders a logout message.
 */
const LogOut = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        // Clear the token from localStorage or any other storage where it is kept
        localStorage.removeItem('Token');

        // Redirect to the login page
        navigate('/login');
    }, [navigate]); // Only run once on component mount

    return (
        <div>
            Logging out...
        </div>
    );
};

export default LogOut;