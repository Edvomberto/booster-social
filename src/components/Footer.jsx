import React from 'react';
import { CFooter } from '@coreui/react';

const Footer = () => {
  return (
    <CFooter>
      <div>
        <a href="https://coreui.io" target="_blank" rel="noopener noreferrer">CoreUI</a>
        <span className="ml-1">&copy; 2024 DKP.</span>
      </div>
      <div className="mfs-auto">
        <span className="mr-1">Powered by</span>
        <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">DKP Integrador</a>
      </div>
    </CFooter>
  );
};

export default Footer;
