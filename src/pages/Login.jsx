import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from '../axiosConfig';
import { jwtDecode } from 'jwt-decode';
import { CForm, CFormInput, CButton, CFormLabel, CFormFeedback, CContainer, CRow, CCol, CCard, CCardBody, CCardHeader, CCardFooter } from '@coreui/react';

const Login = ({ setAuthData }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/user/login-booster', { username, password });
      const { token } = response.data;
      console.log(token);
      console.log("Resposta do servidor:", response);
      const decoded = jwtDecode(token);
      const userId = decoded.userId; // Assumindo que o token inclui o ID do usuário

      setAuthData(token);
      console.log("Redirecionando para:", from);

      // Redirecionar para /loginLinkedin após o login inicial
      navigate(`/post/loginLinkedin?user_id=${userId}`, { replace: true });
    } catch (error) {
      console.error('Erro durante o login:', error);
      setError('Username ou senha inválido!');
    }
  };

  return (
    <CContainer className="d-flex align-items-center min-vh-100">
      <CRow className="justify-content-center w-100">
        <CCol md={8} lg={6}>
          <CCard className="p-4">
            <CCardHeader className="text-center bg-primary text-white">
              <h3>Login</h3>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleLogin}>
                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel htmlFor="username">Username</CFormLabel>
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
                    <CFormLabel htmlFor="password">Password</CFormLabel>
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
                    <CButton type="submit" color="primary">Login</CButton>
                  </CCol>
                </CRow>
                <CRow className="mt-3">
                  <CCol className="text-center">
                    <Link to="/register">Não tem uma conta? Registre-se</Link>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
            <CCardFooter className="text-center">
              <small>&copy; 2024 DKP. All rights reserved.</small>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Login;
