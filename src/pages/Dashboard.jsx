// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { CContainer, CRow, CCol, CButtonGroup, CButton } from '@coreui/react';
import DashboardCard from '../components/DashboardCard';
import DetailedChart from '../components/DetailedChart';
import './Dashboard.css'; // Certifique-se de que o caminho esteja correto

const initialData = {
  followers: [10, 12, 15, 13, 17, 19, 23],
  engagements: [30, 25, 28, 20, 15, 10, 5],
  posts: [5, 8, 7, 6, 5, 4, 3],
  comments: [3, 4, 2, 5, 7, 6, 8],
  impressions: [100, 150, 120, 130, 110, 90, 80],
  profileViews: [40, 30, 20, 25, 22, 18, 15],
  likes: [20, 15, 10, 12, 8, 5, 2],
  shares: [1, 0, 1, 1, 0, 0, 0],
};

const detailedData = {
  followers: { labels: ['01/01', '02/01', '03/01'], values: [10, 15, 20] },
  engagements: { labels: ['01/01', '02/01', '03/01'], values: [5, 10, 15] },
  posts: { labels: ['01/01', '02/01', '03/01'], values: [1, 2, 3] },
  comments: { labels: ['01/01', '02/01', '03/01'], values: [1, 2, 1] },
  impressions: { labels: ['01/01', '02/01', '03/01'], values: [100, 150, 200] },
  profileViews: { labels: ['01/01', '02/01', '03/01'], values: [20, 25, 30] },
  likes: { labels: ['01/01', '02/01', '03/01'], values: [2, 5, 8] },
  shares: { labels: ['01/01', '02/01', '03/01'], values: [1, 1, 1] },
};

const filterDataByPeriod = (data, period) => {
  switch (period) {
    case '7d':
      return data.slice(-7);
    case '30d':
      return data.slice(-30);
    case '90d':
      return data.slice(-90);
    case 'all':
      return data;
    default:
      return data;
  }
};

const Dashboard = ({ darkMode }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedCard, setSelectedCard] = useState(null);
  const [data, setData] = useState(initialData);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleRefresh = () => {
    // Aqui você pode adicionar a lógica para recarregar os dados
    // Por enquanto, estamos apenas redefinindo os dados para o estado inicial como exemplo
    setData(initialData);
  };

  return (
    <CContainer className={darkMode ? 'dark-mode' : ''}>
      <CButtonGroup className="mb-3 mt-4">
        <CButton color={selectedPeriod === '7d' ? 'primary' : 'secondary'} onClick={() => setSelectedPeriod('7d')}>7d</CButton>
        <CButton color={selectedPeriod === '30d' ? 'primary' : 'secondary'} onClick={() => setSelectedPeriod('30d')}>30d</CButton>
        <CButton color={selectedPeriod === '90d' ? 'primary' : 'secondary'} onClick={() => setSelectedPeriod('90d')}>90d</CButton>
        <CButton color={selectedPeriod === 'all' ? 'primary' : 'secondary'} onClick={() => setSelectedPeriod('all')}>All</CButton>
      </CButtonGroup>
      <CButton color="secondary" onClick={handleRefresh} style={{marginTop:'10px', marginLeft:'50px'}}>Refresh</CButton>

      <CRow>
        <CCol md="3" className="clickable" onClick={() => handleCardClick('followers')}>
          <DashboardCard
            title="FOLLOWERS"
            value="4,338"
            percentage="+1.95%"
            data={filterDataByPeriod(data.followers, selectedPeriod)}
          />
        </CCol>
        <CCol md="3" className="clickable" onClick={() => handleCardClick('engagements')}>
          <DashboardCard
            title="ENGAGEMENTS"
            value="84"
            percentage="-52.27%"
            data={filterDataByPeriod(data.engagements, selectedPeriod)}
          />
        </CCol>
        <CCol md="3" className="clickable" onClick={() => handleCardClick('posts')}>
          <DashboardCard
            title="POSTS"
            value="20"
            percentage="-25.93%"
            data={filterDataByPeriod(data.posts, selectedPeriod)}
          />
        </CCol>
        <CCol md="3" className="clickable" onClick={() => handleCardClick('comments')}>
          <DashboardCard
            title="COMMENTS"
            value="14"
            percentage="-69.57%"
            data={filterDataByPeriod(data.comments, selectedPeriod)}
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol md="3" className="clickable" onClick={() => handleCardClick('impressions')}>
          <DashboardCard
            title="IMPRESSIONS"
            value="3,160"
            percentage="-40.85%"
            data={filterDataByPeriod(data.impressions, selectedPeriod)}
          />
        </CCol>
        <CCol md="3" className="clickable" onClick={() => handleCardClick('profileViews')}>
          <DashboardCard
            title="PROFILE VIEWS"
            value="738"
            percentage="-20.47%"
            data={filterDataByPeriod(data.profileViews, selectedPeriod)}
          />
        </CCol>
        <CCol md="3" className="clickable" onClick={() => handleCardClick('likes')}>
          <DashboardCard
            title="LIKES"
            value="70"
            percentage="-39.66%"
            data={filterDataByPeriod(data.likes, selectedPeriod)}
          />
        </CCol>
        <CCol md="3" className="clickable" onClick={() => handleCardClick('shares')}>
          <DashboardCard
            title="SHARES"
            value="0"
            percentage="0%"
            data={filterDataByPeriod(data.shares, selectedPeriod)}
          />
        </CCol>
      </CRow>
      {selectedCard && (
        <CRow className="mt-4">
          <CCol>
            <DetailedChart
              title={selectedCard.toUpperCase()}
              data={detailedData[selectedCard]}
            />
          </CCol>
        </CRow>
      )}
    </CContainer>
  );
};

export default Dashboard;
