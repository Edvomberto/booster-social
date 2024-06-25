import React, { useState, useEffect } from 'react';
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
  CFormSwitch,
  CFormRange,
  CButton,
  CAvatar
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLink, cilTrash, cilReload } from '@coreui/icons';
import { useTranslation } from 'react-i18next';
import axios from '../axiosConfig';

const Settings = ({ accessToken, setAccessToken }) => {
  const { t, i18n } = useTranslation();

  const [settings, setSettings] = useState({
    email: '',
    name: '',
    timezone: '',
    darkMode: false,
    rtlText: false,
    linkedIn: '',
    language: 'pt',
    searchKeywords: '',
    description: '',
    mainTopics: '',
    freedomLevel: 0,
    aiModel: 'GPT-4'
  });

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await axios.get('/user/1'); // Supondo que o ID do usuário seja 1
        setSettings(response.data);
      } catch (error) {
        console.error('Error fetching user settings:', error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`https://postlinkedin-229725447ae4.herokuapp.com/get-user-info?access_token=${accessToken}`);
        setSettings(prevSettings => ({
          ...prevSettings,
          email: response.data.email,
          name: response.data.name,
          avatar: response.data.picture
        }));
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserSettings();
    if (accessToken) {
      fetchUserInfo();
    }

    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [accessToken, i18n]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('language', newLanguage); // Armazena o idioma selecionado no localStorage
    setSettings(prevSettings => ({
      ...prevSettings,
      language: newLanguage
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`/user/1`, settings); // Supondo que o ID do usuário seja 1
      console.log(response.data);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleLinkedInRefresh = async () => {
    console.log('LinkedIn refresh clicked');
  };

  const handleDisconnect = () => {
    localStorage.removeItem('access_token');
    setAccessToken('');
  };

  const handleConnect = () => {
    window.location.href = '/booster-social/loginLinkedin';
  };

  return (
    <CContainer>
      <CRow className="mb-4">
        <CCol>
          <h2>{t('settings')}</h2>
        </CCol>
      </CRow>
      <CRow>
        <CCol md={6}>
          <CCard>
            <CCardHeader>{t('account_settings')}</CCardHeader>
            <CCardBody>
              <CForm>
                <CFormLabel>{t('email_address')}</CFormLabel>
                <CFormInput type="email" name="email" value={settings.email} onChange={handleChange} />

                <CFormLabel>{t('name')}</CFormLabel>
                <CRow className="align-items-center">
                  <CCol xs="auto">
                    <CAvatar src={settings.avatar} size="md" />
                  </CCol>
                  <CCol>
                    <CFormInput type="text" name="name" value={settings.name} readOnly />
                  </CCol>
                </CRow>

                <CFormLabel>{t('timezone')}</CFormLabel>
                <CFormInput type="text" name="timezone" value={settings.timezone} onChange={handleChange} />

                <CFormLabel>{t('dark_mode')}</CFormLabel>
                <CFormSwitch 
                  label={t('dark_mode')} 
                  id="formSwitchCheckChecked" 
                  name="darkMode"
                  checked={settings.darkMode} 
                  onChange={handleChange} 
                />

              </CForm>
            </CCardBody>
          </CCard>

          <CCard className="mt-4">
            <CCardHeader>LinkedIn</CCardHeader>
            <CCardBody>
              <CForm>
                <CFormLabel>{t('connected_as')}</CFormLabel>
                <CRow className="align-items-center mb-3">
                  <CCol xs="auto">
                    <CAvatar src={settings.avatar} size="md" />
                  </CCol>
                  <CCol>
                    <CFormInput type="text" name="linkedIn" value={settings.linkedIn} onChange={handleChange} />
                  </CCol>
                </CRow>

                {accessToken ? (
                  <CButton color="danger" className="mt-2" onClick={handleDisconnect}>
                    <CIcon icon={cilTrash} /> {t('disconnect')}
                  </CButton>
                ) : (
                  <CButton color="primary" className="mt-2" onClick={handleConnect}>
                    <CIcon icon={cilLink} /> {t('connect')}
                  </CButton>
                )}
                <CButton color="primary" className="mt-2 ms-2" onClick={handleLinkedInRefresh}>
                  <CIcon icon={cilReload} /> {t('refresh')}
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>

          <CCard className="mt-4">
            <CCardHeader>{t('add_authorized_person')}</CCardHeader>
            <CCardBody>
              <CForm>
                <CFormLabel>{t('add_authorized_person')}</CFormLabel>
                <CFormInput type="email" placeholder="Enter email address" />

                <CFormLabel>{t('authorized_people')}</CFormLabel>
                <CFormInput type="text" value="tibo@taplio.com" readOnly />
                <CButton color="danger" className="mt-2">
                  <CIcon icon={cilTrash} /> {t('remove')}
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>

          <CCard className="mt-4">
            <CCardHeader>{t('danger_zone')}</CCardHeader>
            <CCardBody>
              <CButton color="danger">
                <CIcon icon={cilTrash} /> {t('delete_account')}
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={6}>
          <CCard>
            <CCardHeader>AI Settings</CCardHeader>
            <CCardBody>
              <CForm>
                <CFormLabel>{t('preferred_language')}</CFormLabel>
                <CFormSelect name="language" value={settings.language} onChange={handleLanguageChange}>
                  <option value="pt">🇵🇹 Portuguese</option>
                  <option value="en">🇬🇧 English</option>
                  <option value="es">🇪🇸 Spanish</option>
                </CFormSelect>

                <CFormLabel>{t('search_keywords')}</CFormLabel>
                <CFormInput type="text" name="searchKeywords" value={settings.searchKeywords} onChange={handleChange} />

                <CFormLabel>{t('personal_description')}</CFormLabel>
                <CFormInput type="textarea" name="description" rows="5" value={settings.description} onChange={handleChange} />

                <CFormLabel>{t('main_topics')}</CFormLabel>
                <CFormInput type="textarea" name="mainTopics" rows="3" value={settings.mainTopics} onChange={handleChange} />

                <CFormLabel>{t('freedom_level')}</CFormLabel>
                <CFormRange
                  name="freedomLevel"
                  value={settings.freedomLevel}
                  onChange={handleChange}
                  min="0"
                  max="100"
                />


                <CFormLabel>{t('ai_model')}</CFormLabel>
                <CFormSelect name="aiModel" value={settings.aiModel} onChange={handleChange}>
                  <option value="GPT-4o">GPT-4o</option>
                  <option value="GPT-4">GPT-4</option>
                  <option value="GPT-3.5">GPT-3.5</option>
                  <option value="Gemini PRO">Gemini Pro</option>
                  <option value="Llama 3">Llama 3</option>
                </CFormSelect>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CButton color="primary" onClick={handleSubmit} className="mt-4">{t('Save_Settings')}</CButton>
    </CContainer>
  );
};

export default Settings;
