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
  const [tokenBooster, setTokenBooster] = useState(localStorage.getItem('tokenBooster'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));


  useEffect(() => {
    if (tokenBooster) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokenBooster}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [tokenBooster]);

  const setAuthData = (tokenBooster) => {
    if (tokenBooster) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokenBooster}`;
      localStorage.setItem('tokenBooster', tokenBooster);
      localStorage.setItem('userId', userId);

    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('tokenBooster');
    }
    setTokenBooster(tokenBooster);
  };

  const handleLogout = () => {
    setAuthData(null);
    localStorage.removeItem('access_token');
    window.location.href = '/booster-social/login'; // Redirecionar para a página de login
  };

  const RequireAuth = ({ children }) => {
    const location = useLocation();

    if (!tokenBooster) {
      return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
  };

  const handleLinkedInAuth = (access_token) => {
    setAccessToken(access_token);
    localStorage.setItem('access_token', access_token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
  };

  return (
    <Router basename="/booster-social">
      <div className="c-app c-default-layout">
        <Sidebar handleLogout={handleLogout} userId={userId} />
        <div className="wrapper d-flex flex-column min-vh-100 bg-light">
          <Header />
          <main className="body flex-grow-1 px-3">
            <Routes>
              <Route path="/" element={<RequireAuth><PostGeneration userId={userId} accessToken={accessToken} /></RequireAuth>} />
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
