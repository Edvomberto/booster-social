// src/components/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CSidebar, CSidebarNav, CNavItem, CSidebarHeader, CSidebarBrand, CAvatar, CSidebarFooter, CPopover, CSidebarToggler } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSpeedometer, cilCalendar, cilAlarm, cilAccountLogout, cilSettings, cilSatelite } from '@coreui/icons';
import axios from '../axiosConfig';

const Sidebar = ({ handleLogout, userId }) => {
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [credits, setCredits] = useState(null);
  const [subscriptionDate, setSubscriptionDate] = useState(null);

  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`https://postlinkedin-229725447ae4.herokuapp.com/get-user-info?access_token=${accessToken}`);
        const userData = response.data;
        setUserInfo(userData);

        const userResponse = await axios.get(`https://ws-booster-social-5040b10dd814.herokuapp.com/api/user/creditos/${userId}`);
        const userDetails = userResponse.data;
        setCredits(userDetails.credits);
        setSubscriptionDate(new Date(userDetails.subscriptionDate));
        // Aplicar o tema baseado na configuração do usuário
        document.body.classList.toggle('dark-mode', response.data.darkMode);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    if (accessToken && !userInfo) {
      fetchUserInfo();
    } else {
      console.log('No access token provided or userInfo already loaded');
    }
  }, [accessToken, userInfo]);

  const handleMouseEnter = () => {
    setIsSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    setIsSidebarOpen(false);
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <CSidebar
      className="border-end sidebar-full-height"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      unfoldable
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand>
          <img src="./assets/logo.png" alt="Logotipo do Produto" href='/' style={{ height: '40px' }} />
        </CSidebarBrand>
      </CSidebarHeader>
      <CSidebarNav>
        <CNavItem href="/"><CIcon customClassName="nav-icon c-icon" icon={cilSpeedometer} /> {t('dashboard')}</CNavItem>
        <CNavItem href="/booster-social/settings"><CIcon customClassName="nav-icon c-icon" icon={cilCalendar} /> {t('schedules')}</CNavItem>
        <CNavItem href="/booster-social/post-generation"><CIcon customClassName="nav-icon c-icon" icon={cilAlarm} /> {t('alerts')}</CNavItem>
        <CNavItem href="/booster-social/settings"><CIcon customClassName="nav-icon c-icon" icon={cilSettings} /> {t('settings')}</CNavItem>
        <CNavItem href="/booster-social/carrossel"><CIcon customClassName="nav-icon c-icon" icon={cilSatelite} /> {t('carousel')}</CNavItem>
      </CSidebarNav>
      <CSidebarFooter className="d-flex align-items-center">
        {userInfo && (
          <CPopover
            content={
              <div>
                <div>{userInfo.name}</div>
                <div>{t('credits')}: {credits}</div>
                <div>{t('renew_in')}: {subscriptionDate ? formatDate(subscriptionDate) : t('no_subscription_date')}</div>
              </div>
            }
            placement="right"
            trigger={['hover', 'focus']}
          >
            <div>
              <CAvatar src={userInfo.picture} size="md" />
            </div>
          </CPopover>
        )}
      </CSidebarFooter>
      <CSidebarHeader className="border-top">
        <CIcon onClick={handleLogout} customClassName="nav-icon c-icon" icon={cilAccountLogout} cursor="hand"/>
      </CSidebarHeader>
    </CSidebar>
  );
};

export default Sidebar;
