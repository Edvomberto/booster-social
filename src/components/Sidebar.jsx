// src/components/Sidebar.jsx
import React from 'react';
import { CSidebar, CSidebarNav, CNavItem, CSidebarHeader, CSidebarBrand } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSpeedometer, cilCalendar, cilCloudDownload, cilLayers, cilAccountLogout } from '@coreui/icons';

const Sidebar = ({ handleLogout }) => {
  return (
    <CSidebar className="border-end" narrow>
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand>CUI</CSidebarBrand>
      </CSidebarHeader>
      <CSidebarNav>
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
