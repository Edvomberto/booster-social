// src/pages/Settings.jsx
import React from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormLabel,
  CFormInput,
  CFormCheck,
  CFormSelect,
  CButton
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLink, cilTrash } from '@coreui/icons';

const Settings = () => {
  return (
    <CContainer>
      <CRow className="mb-4">
        <CCol>
          <h2>Settings</h2>
        </CCol>
      </CRow>
      <CRow>
        <CCol md={6}>
          <CCard>
            <CCardHeader>Account Settings</CCardHeader>
            <CCardBody>
              <CForm>
                <CFormLabel>Email address</CFormLabel>
                <CFormInput type="email" value="edvomberto@gmail.com" readOnly />

                <CFormLabel>Timezone</CFormLabel>
                <CFormInput type="text" value="(GMT-3:00) Brasilia" readOnly />

                <CFormLabel>Dark Mode</CFormLabel>
                <CFormCheck type="switch" id="darkModeSwitch" label="Dark Mode" defaultChecked />

                <CFormLabel>Right to left text direction</CFormLabel>
                <CFormCheck type="switch" id="rtlSwitch" label="Right to left text direction" />
              </CForm>
            </CCardBody>
          </CCard>

          <CCard className="mt-4">
            <CCardHeader>LinkedIn</CCardHeader>
            <CCardBody>
              <CForm>
                <CFormLabel>Connected as</CFormLabel>
                <CFormInput type="text" value="Edvomberto Honorato" readOnly />
                <CButton color="danger" className="mt-2">
                  <CIcon icon={cilTrash} /> Disconnect
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>

          <CCard className="mt-4">
            <CCardHeader>Share your account</CCardHeader>
            <CCardBody>
              <CForm>
                <CFormLabel>Add authorized person</CFormLabel>
                <CFormInput type="email" placeholder="Enter email address" />

                <CFormLabel>Authorized people</CFormLabel>
                <CFormInput type="text" value="tibo@taplio.com" readOnly />
                <CButton color="danger" className="mt-2">
                  <CIcon icon={cilTrash} /> Remove
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>

          <CCard className="mt-4">
            <CCardHeader>Danger Zone</CCardHeader>
            <CCardBody>
              <CButton color="danger">
                <CIcon icon={cilTrash} /> Delete Account
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={6}>
          <CCard>
            <CCardHeader>AI Settings</CCardHeader>
            <CCardBody>
              <CForm>
                <CFormLabel>Preferred language</CFormLabel>
                <CFormSelect>
                  <option>🇵🇹 Portuguese</option>
                  <option>🇬🇧 English</option>
                </CFormSelect>

                <CFormLabel>Search keywords</CFormLabel>
                <CFormInput type="text" value="Personal Branding, Productivity, Digital Marketing" readOnly />

                <CFormLabel>Personal description</CFormLabel>
                <CFormInput type="textarea" rows="5" value="I am a As DKP's Director in São Paulo, Brazil, I have over 25 years of IT experience and a passion for programming. I lead DN3, developing customized systems and specializing in BI and RPA. We integrate with top ERPs and serve leading clients, enhancing their efficiency and competitiveness." readOnly />

                <CFormLabel>Main topics</CFormLabel>
                <CFormInput type="textarea" rows="3" value="I usually post about I share insights on key tech topics like Business Intelligence (BI), Robotic Process Automation (RPA), and sales funnel automation, reflecting major advancements in commerce and process management." readOnly />

                <CFormLabel>Freedom level</CFormLabel>
                <CFormSelect>
                  <option>Conservative</option>
                  <option>Wild</option>
                </CFormSelect>

                <CFormLabel>Preferred AI model</CFormLabel>
                <CFormSelect>
                  <option>GPT-4</option>
                  <option>GPT-3.5</option>
                </CFormSelect>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Settings;
