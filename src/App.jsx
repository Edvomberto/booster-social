import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import PostGeneration from './pages/PostGeneration';
import LinkedInAuth from './pages/LinkedInAuth';
import Settings from './pages/Settings';
import '@coreui/coreui/dist/css/coreui.min.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import LoginLinkedin from './pages/LoginLinkedin';
import Prompt from './pages/PromptsList';
import Carrossel from './pages/Carrossel';
import axios from './axiosConfig';
import './App.css';

const App = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token') || '');
  const [tokenBooster, setTokenBooster] = useState(localStorage.getItem('tokenBooster'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    if (tokenBooster) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokenBooster}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }

    document.body.className = darkMode ? 'dark-mode' : '';
    localStorage.setItem('darkMode', darkMode);
  }, [tokenBooster, darkMode]);

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
    <div className={`c-app c-default-layout ${darkMode ? 'dark-mode' : ''}`}>
      {tokenBooster && <Sidebar handleLogout={handleLogout} userId={userId} />}
      <div className={`wrapper d-flex flex-column min-vh-100 ${tokenBooster ? 'bg-light' : ''}`}>
        {tokenBooster && <Header />}
        <main className={`body flex-grow-1 px-3 ${tokenBooster ? '' : 'd-flex align-items-center justify-content-center'}`}>
          <Routes>
            <Route path="/" element={<RequireAuth><Dashboard userId={userId} accessToken={accessToken} /></RequireAuth>} />
            <Route path="/post-generation" element={<RequireAuth><PostGeneration userId={userId} accessToken={accessToken} /></RequireAuth>} />
            <Route path="/callback" element={<LinkedInAuth onSuccess={handleLinkedInAuth} />} />
            <Route path="/login" element={<Login setAuthData={setAuthData} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/loginLinkedin" element={<LoginLinkedin />} />
            <Route path="/prompts" element={<Prompt />} />
            <Route path="/carrossel" element={<Carrossel accessToken={accessToken} userId={userId}/>} />
            <Route path="/settings" element={<RequireAuth><Settings accessToken={accessToken} setAccessToken={setAccessToken} darkMode={darkMode} setDarkMode={setDarkMode} /></RequireAuth>} />
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
