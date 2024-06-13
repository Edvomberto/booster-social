// Sidebar.jsx
import React from 'react';
import { CSidebar, CSidebarNav, CNavItem, CSidebarHeader, CSidebarBrand } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSpeedometer, cilCalendar, cilCloudDownload, cilLayers } from '@coreui/icons';

const Sidebar = () => {
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
      </CSidebarNav>
    </CSidebar>
  );
};

export default Sidebar;
