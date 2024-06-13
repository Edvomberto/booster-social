// pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { CForm, CFormInput, CButton, CFormLabel, CFormFeedback, CContainer, CRow, CCol, CCard, CCardBody, CCardHeader, CCardFooter } from '@coreui/react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/register', { username, email, password });
      navigate('/login', { replace: true });
    } catch (error) {
      setError('Erro ao criar usuário. Por favor, tente novamente.');
    }
  };

  return (
    <CContainer className="d-flex align-items-center min-vh-100">
      <CRow className="justify-content-center w-100">
        <CCol md={8} lg={6}>
          <CCard className="p-4">
            <CCardHeader className="text-center bg-primary text-white">
              <h3>Register</h3>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleRegister}>
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
                    <CFormLabel htmlFor="email">Email</CFormLabel>
                    <CFormInput
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                    <CButton type="submit" color="primary">Register</CButton>
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

export default Register;
