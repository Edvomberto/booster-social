// src/pages/LinkedInAuth.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LinkedInAuth = ({ onSuccess }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');

    if (accessToken) {
      onSuccess(accessToken);
      // Limpar o token da URL após o uso
      navigate('/booster-social');
    }
  }, [onSuccess, navigate]);

  return (
    <div>
      <a href="https://edvomberto.github.io/booster-social/loginLinkedin">Login com LinkedIn</a>
    </div>
  );
};

export default LinkedInAuth;
