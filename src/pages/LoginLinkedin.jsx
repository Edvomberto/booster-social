// src/pages/LoginLinkedin.js
import { use } from 'i18next';
import React, { useEffect, useState } from 'react';

const LoginLinkedin = ({userId}) => {
  const [redirected, setRedirected] = useState(false);

  console.log("usuario kkkkkkk", userId);

  useEffect(() => {
    if (!redirected) {
      setRedirected(true);
      window.location.href = 'https://ws-booster-social-5040b10dd814.herokuapp.com/api/post/loginLinkedin';
    }
  }, [redirected]);

  return <div>Autenticando no LinkedIn...</div>;
};

export default LoginLinkedin;
