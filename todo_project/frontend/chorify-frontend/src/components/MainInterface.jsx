import React from 'react';
import { useNavigate } from 'react-router-dom';
import ShoppingLists from './ShoppingLists';

function MainInterface() {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/logout'); // Assuming '/logout' is the path where the LogOut component is rendered
    };

    return (
        <div className="container">
            <div className="row align-items-center">
                <div className="col-auto">
                    <h1>Chorify</h1>
                </div>
                <div className="col-auto">
                    <img className="main-logo" src="./src/assets/images/chorify-logo.png" alt="Chorify logo" />
                </div>
            </div>
            <div className="row">
                <div className="col shopping-list-column">
                    <h2>Shopping Lists</h2>
                    <ShoppingLists />
                </div>
            </div>
            <div className="row">
                <div className="col text-center">
                    <button className="logout-button" onClick={handleLogout}>Log out</button>
                </div>
            </div>
        </div>
    );
}

export default MainInterface;