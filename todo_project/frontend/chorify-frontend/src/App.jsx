import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/signin';
import SignUp from './components/SignUp';
import LogOut from './components/LogOut';
import ProtectedRoute from './components/ProtectedRoute';
import MainInterface from './components/MainInterface';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import './App.css';

/**
 * This is the root component of the Chorify app. It sets up routing for the
 * application and renders the SignIn, SignUp, LogOut, and MainInterface
 * components based on the current URL path. It also displays the Copyright
 * component at the bottom of the page.
 */
function App() {

  function Copyright(props) {
    return (
      <Typography
        variant="body2"
        align="center"
        sx={{ color: 'lightgray' }}
        {...props}
      >
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Chorify
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
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
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Router>
  );
}
export default App;