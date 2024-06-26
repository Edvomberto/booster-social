import React, { useState } from 'react';
import { CFormLabel, CFormCheck, CFormInput, CRow, CCol, CInputGroup, CInputGroupText } from '@coreui/react';

const palletes = [
  ['#5567C9', '#C3C5F5', '#FFFFFF'],
  ['#CF4647', '#513B56', '#FFFFFF'],
  ['#409C9C', '#53B0AE', '#FFFFFF'],
  ['#E74C3C', '#2C3E50', '#FFFFFF'],
  ['#6C8569', '#97A58A', '#F7FFE5'],
  ['#3AA6B9', '#81A39D', '#FFFFFF'],
  ['#001C30', '#176B87', '#FFFFFF'],
  ['#FF6666', '#FF8989', '#FFFFFF'],
  ['#3F2305', '#B4AE9B', '#FFFFFF'],
  ['#0174DA', '#FF5757', '#FFFFFF'],
  ['#0174DA', '#FFBD59', '#FFFFFF'],
  // Add more palettes as needed
];

const PalleteSelector = ({ onSelect }) => {
  const [useCustomColors, setUseCustomColors] = useState(false);
  const [selectedPallete, setSelectedPallete] = useState(null);
  const [customColors, setCustomColors] = useState({ primary: '#5567C9', secondary: '#C3C5F5', accent: '#FFFFFF' });

  const handleSelectPallete = (pallete) => {
    setSelectedPallete(pallete);
    onSelect(pallete);
  };

  const handleCustomColorChange = (e) => {
    const { name, value } = e.target;
    const newCustomColors = { ...customColors, [name]: value };
    setCustomColors(newCustomColors);
    onSelect(Object.values(newCustomColors));
  };

  return (
    <div>
      <CFormLabel>Color Palette</CFormLabel>
      <CFormCheck
        type="checkbox"
        id="useCustomColors"
        label="Use Custom Colors"
        checked={useCustomColors}
        onChange={() => setUseCustomColors(!useCustomColors)}
      />
      {!useCustomColors ? (
        <div className="d-flex flex-wrap">
          {palletes.map((pallete, index) => (
            <div
              key={index}
              className={`palette-selector-item ${selectedPallete === pallete ? 'selected' : ''}`}
              onClick={() => handleSelectPallete(pallete)}
              style={{
                display: 'flex',
                cursor: 'pointer',
                border: selectedPallete === pallete ? '2px solid white' : '1px solid gray',
                margin: '5px',
                padding: '5px',
                borderRadius: '5px',
              }}
            >
              {pallete.map((color, colorIndex) => (
                <div
                  key={colorIndex}
                  style={{
                    width: '30px',
                    height: '15px',
                    backgroundColor: color,
                    marginRight: colorIndex < pallete.length - 1 ? '5px' : '0',
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <CRow className="mt-2">
            <CCol>
              <CFormLabel>Primary</CFormLabel>
              <CInputGroup>
                <CFormInput
                  type="color"
                  name="primary"
                  value={customColors.primary}
                  onChange={handleCustomColorChange}
                />
                <CFormInput
                  type="text"
                  name="primary"
                  value={customColors.primary}
                  onChange={handleCustomColorChange}
                />
              </CInputGroup>
            </CCol>
            <CCol>
              <CFormLabel>Secondary</CFormLabel>
              <CInputGroup>
                <CFormInput
                  type="color"
                  name="secondary"
                  value={customColors.secondary}
                  onChange={handleCustomColorChange}
                />
                <CFormInput
                  type="text"
                  name="secondary"
                  value={customColors.secondary}
                  onChange={handleCustomColorChange}
                />
              </CInputGroup>
            </CCol>
            <CCol>
              <CFormLabel>Accent</CFormLabel>
              <CInputGroup>
                <CFormInput
                  type="color"
                  name="accent"
                  value={customColors.accent}
                  onChange={handleCustomColorChange}
                />
                <CFormInput
                  type="text"
                  name="accent"
                  value={customColors.accent}
                  onChange={handleCustomColorChange}
                />
              </CInputGroup>
            </CCol>
          </CRow>
        </div>
      )}
    </div>
  );
};

export default PalleteSelector;
