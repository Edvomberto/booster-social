// src/components/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import { CSidebar, CSidebarNav, CNavItem, CSidebarHeader, CSidebarBrand, CAvatar } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSpeedometer, cilCalendar, cilCloudDownload, cilLayers, cilAccountLogout, cilSettings } from '@coreui/icons';
import axios from '../axiosConfig';

const Sidebar = ({ handleLogout, accessToken }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`https://postlinkedin-229725447ae4.herokuapp.com/get-user-info?access_token=${accessToken}`);
        setUserInfo(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    if (accessToken && !userInfo) {
      console.log('Fetching user info with access token:', accessToken); // Adicionado para depuração
      fetchUserInfo();
    } else {
      console.log('No access token provided or userInfo already loaded'); // Adicionado para depuração
    }
  }, [accessToken, userInfo]);

  return (
    <CSidebar className="border-end" narrow>
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand>CUI</CSidebarBrand>
      </CSidebarHeader>
      <CSidebarNav>
        {userInfo && (
          <div className="text-center p-3">
            <CAvatar src={userInfo.picture} size="md" />
            <div>{userInfo.name}</div>
          </div>
        )}
        <CNavItem href="/">
          <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
        </CNavItem>
        <CNavItem href="/schedules">
          <CIcon customClassName="nav-icon" icon={cilCalendar} />
        </CNavItem>
        <CNavItem href="/company">
          <CIcon customClassName="nav-icon" icon={cilCloudDownload} />
        </CNavItem>
        <CNavItem href="/conexoes">
          <CIcon customClassName="nav-icon" icon={cilLayers} />
        </CNavItem>
        <CNavItem href="/booster-social/settings">
          <CIcon customClassName="nav-icon" icon={cilSettings} />
        </CNavItem>
        <CNavItem>
          <button onClick={handleLogout} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <CIcon customClassName="nav-icon" icon={cilAccountLogout} />
          </button>
        </CNavItem>
      </CSidebarNav>
    </CSidebar>
  );
};

export default Sidebar;
