// src/components/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import { CSidebar, CSidebarNav, CNavItem, CSidebarHeader, CSidebarBrand, CAvatar, CSidebarFooter, CPopover, CSidebarToggler } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSpeedometer, cilCalendar, cilAlarm, cilLayers, cilAccountLogout, cilSettings } from '@coreui/icons';
import axios from '../axiosConfig';

const Sidebar = ({ handleLogout, userId} ) => {
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

        // Fetch credits and subscription date
        const userResponse = await axios.get(`https://ws-booster-social-5040b10dd814.herokuapp.com/api/user/creditos/${userId}`);
        const userDetails = userResponse.data;
        setCredits(userDetails.credits);
        setSubscriptionDate(new Date(userDetails.subscriptionDate));
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
          <img src="./assets/logo.png" alt="Logotipo do Produto" style={{ height: '40px' }} />
        </CSidebarBrand>
      </CSidebarHeader>
      <CSidebarNav>
        <CNavItem href="/"><CIcon customClassName="nav-icon" icon={cilSpeedometer} /> Dashboard</CNavItem>
        <CNavItem href="/booster-social/settings"><CIcon customClassName="nav-icon" icon={cilCalendar} /> Schedules </CNavItem>
        <CNavItem href="/"><CIcon customClassName="nav-icon" icon={cilAlarm} /> Alerts</CNavItem>
        <CNavItem href="/booster-social/settings"><CIcon customClassName="nav-icon" icon={cilSettings} /> Settings</CNavItem>
      </CSidebarNav>
      <CSidebarFooter className="d-flex align-items-center">
        {userInfo && (
          <CPopover
            content={
              <div>
                <div>{userInfo.name}</div>
                <div>Créditos: {credits}</div>
                <div>Renova em: {subscriptionDate ? formatDate(subscriptionDate) : 'N/A'}</div>
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
        <CSidebarToggler onClick={handleLogout} />
      </CSidebarHeader>
    </CSidebar>
  );
};

export default Sidebar;
