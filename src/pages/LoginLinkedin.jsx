// src/pages/LoginLinkedin.js
import React, { useEffect, useState } from 'react';

const LoginLinkedin = () => {
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (!redirected) {
      setRedirected(true);
      window.location.href = '/loginLinkedin';
    }
  }, [redirected]);

  return <div>Autenticando no LinkedIn...</div>;
};

export default LoginLinkedin;
