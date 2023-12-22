import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/signin';
import SignUp from './components/SignUp';
import LogOut from './components/LogOut';
import ProtectedRoute from './components/ProtectedRoute';
import MainInterface from './components/MainInterface';
import './App.css';

function App() {


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
  </Router>
);
}
export default App;