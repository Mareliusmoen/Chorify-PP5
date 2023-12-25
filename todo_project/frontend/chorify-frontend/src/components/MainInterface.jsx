import React from 'react';
import { useNavigate } from 'react-router-dom';
import ShoppingLists from './ShoppingLists';
import ToDoLists from './ToDoLists';

function MainInterface() {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/logout');
    };

    return (
        <div className="container">
            <div className="row align-items-center">
                <div className="col-auto">
                    <h1>Chorify</h1>
                </div>
                <div className="col-auto">
                    <img className="main-logo" src="/static/assets/chorify-logo.png" alt="Chorify logo" />
                </div>
            </div>
            
            <div className="row">
                <div className="col shopping-list-column">
                    <h2>Shopping Lists</h2>
                    <ShoppingLists />
                </div>
            </div>
            <div className="row">
                <div className="col to-do-list-column">
                    <h2>To-Do Lists</h2>
                    <ToDoLists />
                </div>
            </div>
            <div className="row">
                <div className="col text-center">
                    <button className="grey-button" onClick={handleLogout}>Log out</button>
                </div>
            </div>
        </div>
    );
}

export default MainInterface;