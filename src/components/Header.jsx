// Header.jsx
import React from 'react';
import { CHeader, CHeaderToggler, CHeaderBrand, CHeaderNav, CNavItem, CNavLink } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMenu } from '@coreui/icons';

const Header = () => {
  return (
    <CHeader className="c-header">
      <CHeaderToggler className="ml-md-3 d-lg-none" />
      <CHeaderBrand className="mx-auto d-lg-none" to="/">
        <CIcon icon={cilMenu} height={24} />
      </CHeaderBrand>
      <CHeaderNav className="d-md-down-none mr-auto">
        <CNavItem className="px-4">
          <CNavLink to="/">Dashboard</CNavLink>
        </CNavItem>
      </CHeaderNav>
    </CHeader>
  );
};

export default Header;
