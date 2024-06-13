// LinkedInAuth.jsx
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
      navigate('/');
    }
  }, [onSuccess, navigate]);

  return (
    <div>
      <a href="http://localhost:5000/loginLinkedin">Login com LinkedIn</a>
    </div>
  );
};

export default LinkedInAuth;
