import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogOut = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        // Clear the token from localStorage or any other storage where it is kept
        localStorage.removeItem('token');

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