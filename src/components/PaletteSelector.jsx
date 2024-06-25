// PaletteSelector.js
import React, { useState } from 'react';
import { CFormLabel, CFormCheck } from '@coreui/react';

const palettes = [
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

const PaletteSelector = ({ onSelect }) => {
  const [selectedPalette, setSelectedPalette] = useState(null);

  const handleSelectPalette = (palette) => {
    setSelectedPalette(palette);
    onSelect(palette);
  };

  return (
    <div>
      <CFormLabel>Color Palette</CFormLabel>
      <CFormCheck
        type="checkbox"
        id="useCustomColors"
        label="Use Custom Colors"
      />
      <div className="d-flex flex-wrap">
        {palettes.map((palette, index) => (
          <div
            key={index}
            className={`palette-selector-item ${selectedPalette === palette ? 'selected' : ''}`}
            onClick={() => handleSelectPalette(palette)}
            style={{
              display: 'flex',
              cursor: 'pointer',
              border: selectedPalette === palette ? '2px solid white' : '1px solid gray',
              margin: '5px',
              padding: '5px',
              borderRadius: '5px',
            }}
          >
            {palette.map((color, colorIndex) => (
              <div
                key={colorIndex}
                style={{
                  width: '30px',
                  height: '15px',
                  backgroundColor: color,
                  marginRight: colorIndex < palette.length - 1 ? '0px' : '0',
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaletteSelector;
