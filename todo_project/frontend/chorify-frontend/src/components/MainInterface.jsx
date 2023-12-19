import React from 'react';
import { useNavigate } from 'react-router-dom';

function MainInterface() {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/logout'); // Assuming '/logout' is the path where the LogOut component is rendered
    };

    return (
        <div className="row">
            <div className="col">
                <h1>Chorify</h1>
                <button onClick={handleLogout}>Log out</button>
            </div>
        </div>
    );
}

export default MainInterface;