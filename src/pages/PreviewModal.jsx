import React, { useState, useEffect } from 'react';
import {
  CModal, CModalBody, CModalHeader, CModalFooter, CModalTitle, CButton, CFormLabel, CFormTextarea, CRow, CCol, CCard, CCardBody 
} from '@coreui/react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const PreviewModal = ({ show, onClose, pngImages = [] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0); // Reset to first slide when images change
  }, [pngImages]);

  const handlePrevClick = () => {
    setCurrentImageIndex((prev) => (prev > 1 ? prev - 2 : (prev === 1 ? 0 : Math.max(pngImages.length - 2, 0))));
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prev) => (prev + 2) % pngImages.length);
  };

  return (
    <CModal visible={show} onClose={onClose} size="lg">
      <CModalHeader closeButton>
        <CModalTitle>Carousel Preview</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CCard>
          <CCardBody>
            {pngImages.length > 0 && (
              <div className="image-carousel" style={{ display: 'flex', justifyContent: 'center' }}>
                <img 
                  src={pngImages[currentImageIndex]} 
                  alt={`Slide ${currentImageIndex + 1}`} 
                  style={{ width: '45%', height: 'auto', marginRight: '10px' }} 
                />
                {pngImages[(currentImageIndex + 1) % pngImages.length] && (
                  <img 
                    src={pngImages[(currentImageIndex + 1) % pngImages.length]} 
                    alt={`Slide ${currentImageIndex + 2}`} 
                    style={{ width: '45%', height: 'auto' }} 
                  />
                )}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <CButton 
                onClick={handlePrevClick} 
                style={{ marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#007bff', borderColor: '#007bff', color: 'white' }}
              >
                <FaArrowLeft style={{ marginRight: '5px' }} />
                Prev
              </CButton>
              <CButton 
                onClick={handleNextClick} 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#007bff', borderColor: '#007bff', color: 'white' }}
              >
                Next
                <FaArrowRight style={{ marginLeft: '5px' }} />
              </CButton>
            </div>
          </CCardBody>
        </CCard>

      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>Close</CButton>
      </CModalFooter>
    </CModal>
  );
};

export default PreviewModal;
