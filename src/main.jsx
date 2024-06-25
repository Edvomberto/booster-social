// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@coreui/coreui/dist/css/coreui.min.css';
import './i18n'; // Importe o arquivo de configuração do i18next
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/booster-social">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
