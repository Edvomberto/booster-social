// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import PostGeneration from './pages/PostGeneration';
import LinkedInAuth from './pages/LinkedInAuth';
import Settings from './pages/Settings';
import '@coreui/coreui/dist/css/coreui.min.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import LoginLinkedin from './pages/LoginLinkedin';
import axios from './axiosConfig';
import './App.css';

const App = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token') || '');
  const [token, setToken] = useState(localStorage.getItem('token'));

  const setAuthData = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
    setToken(token);
  };

  const handleLogout = () => {
    setAuthData(null);
    localStorage.removeItem('access_token');
    window.location.href = '/booster-social/login'; // Redirecionar para a página de login
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  const RequireAuth = ({ children }) => {
    const location = useLocation();
    console.log('Token:', token);

    if (!token) {
      return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
  };

  const handleLinkedInAuth = (token) => {
    setAccessToken(token);
    console.log("passei", token);
    localStorage.setItem('access_token', token);
  };

  console.log(token);

  return (
    <Router basename="/booster-social">
      <div className="c-app c-default-layout">
        <Sidebar handleLogout={handleLogout} accessToken={accessToken} />
        <div className="wrapper d-flex flex-column min-vh-100 bg-light">
          <Header />
          <main className="body flex-grow-1 px-3">
            <Routes>
              <Route path="/" element={<RequireAuth><PostGeneration accessToken={accessToken} /></RequireAuth>} />
              <Route path="/callback" element={<LinkedInAuth onSuccess={handleLinkedInAuth} />} />
              <Route path="/login" element={<Login setAuthData={setAuthData} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/loginLinkedin" element={<LoginLinkedin />} />
              <Route path="/settings" element={<RequireAuth><Settings accessToken={accessToken} setAccessToken={setAccessToken} /></RequireAuth>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;
