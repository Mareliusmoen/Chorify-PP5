import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/signin';
import LogOut from './components/LogOut';
import ProtectedRoute from './components/ProtectedRoute';
import MainInterface from './components/MainInterface';
import './App.css';

function App() {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function fetchShoppingLists() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}shopping-lists/`);
        if (response.ok) {
          const result = await response.json();
          setShoppingLists(result);
        } else {
          throw new Error('Network response was not ok for shopping lists.');
        }
      } catch (error) {
        console.error('There has been a problem with your fetch operation for shopping lists:', error);
      }
    }

    // async function fetchTodos() {
    //   try {
    //     const response = await fetch(`${import.meta.env.VITE_API_URL}todos/`);
    //     if (response.ok) {
    //       const result = await response.json();
    //       setTodos(result);
    //     } else {
    //       throw new Error('Network response was not ok for todos.');
    //     }
    //   } catch (error) {
    //     console.error('There has been a problem with your fetch operation for todos:', error);
    //   }
    // }

    fetchShoppingLists();
    // fetchTodos();
  }, []);

  function isAuthenticated() {
    // Check if the token exists in localStorage
    return localStorage.getItem('token') != null;
}

return (
  <Router>
      <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/logout" element={<LogOut />} />
          <Route
              path="/main-interface"
              element={
                  <ProtectedRoute>
                      <MainInterface />
                  </ProtectedRoute>
              }
          />
          {/* Other protected routes */}
      </Routes>
  </Router>
);
}
export default App;