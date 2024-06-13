// src/pages/LoginLinkedin.js
import React, { useEffect, useState } from 'react';

const LoginLinkedin = () => {
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (!redirected) {
      setRedirected(true);
      window.location.href = 'https://ws-booster-social-5040b10dd814.herokuapp.com/loginLinkedin';
    }
  }, [redirected]);

  return <div>Autenticando no LinkedIn...</div>;
};

export default LoginLinkedin;
