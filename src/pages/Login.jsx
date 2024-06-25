import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from '../axiosConfig';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';
import { 
  CForm, 
  CFormInput, 
  CButton, 
  CFormLabel, 
  CFormFeedback, 
  CContainer, 
  CRow, 
  CCol, 
  CCard, 
  CCardBody, 
  CCardHeader, 
  CCardFooter 
} from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import './Login.css'; // Custom CSS for styling

const Login = ({ setAuthData }) => {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/user/login-booster', { username, password });
      const { tokenBooster, accessToken } = response.data;

      const decoded = jwtDecode(tokenBooster);
      const userId = decoded.userId;

      setAuthData(tokenBooster);
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('tokenBooster', tokenBooster);
      localStorage.setItem('userId', userId);

      navigate(from, { replace: true });
    } catch (error) {
      console.error('Erro durante o login:', error);
      setError(t('invalid_credentials'));
    }
  };

  return (
    <CContainer className="d-flex align-items-center min-vh-100 login-container">
      <CRow className="justify-content-center w-100">
        <CCol md={8} lg={6}>
          <CCard className="p-4 shadow-lg">
            <CCardHeader className="text-center bg-primary text-white">
              <h3>{t('login_title')}</h3>
              <p>{t('login_header')}</p>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleLogin}>
                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel htmlFor="username">{t('username')}</CFormLabel>
                    <CFormInput
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel htmlFor="password">{t('password')}</CFormLabel>
                    <CFormInput
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </CCol>
                </CRow>
                {error && <CFormFeedback className="d-block text-danger">{error}</CFormFeedback>}
                <CRow className="mt-4">
                  <CCol className="d-grid gap-2">
                    <CButton type="submit" color="primary">{t('login_button')}</CButton>
                  </CCol>
                </CRow>
                <CRow className="mt-3">
                  <CCol className="text-center">
                    <Link to="/register">{t('register_link')}</Link>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
            <CCardFooter className="text-center">
              <small>&copy; 2024 DKP. {t('login_footer')}</small>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Login;
