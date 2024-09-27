// src/components/DashboardCard.jsx
import React from 'react';
import { CCard, CCardBody, CCardTitle, CCardText } from '@coreui/react';
import ChartComponent from './ChartComponent';

const DashboardCard = ({ title, value, percentage, data }) => {
  return (
    <CCard>
      <CCardBody>
        <CCardTitle>{title}</CCardTitle>
        <h3>{value}</h3>
        <p>{percentage} vs. previous period</p>
        <ChartComponent data={data} />
      </CCardBody>
    </CCard>
  );
};

export default DashboardCard;
