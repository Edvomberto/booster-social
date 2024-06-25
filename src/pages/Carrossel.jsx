import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import {
  CContainer, CButton, CFormInput, CNav, CNavItem, CNavLink, CTabContent, CTabPane,
  CFormSelect, CFormCheck, CCard, CCardBody, CCardTitle, CCardText, CImage,
  CRow, CCol, CFormLabel, CFormTextarea, CForm, CTabs, CTabList, CTab, CTabPanel, CFormRange
} from '@coreui/react';
import {
  Input, Button, FormGroup, InputGroup, InputGroupText,
} from 'reactstrap';
import CIcon from '@coreui/icons-react';
import { cilSave, cilCloudDownload, cilPlus, cilTrash, cilPencil } from '@coreui/icons';
import * as htmlToImage from 'html-to-image';
import axios from '../axiosConfig';
import '../components/Highlight.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import MiniatureDragDrop from './MiniatureDragDrop';
import PaletteSelector from '../components/PaletteSelector';

function Carrossel({ accessToken, userId }) {
  const [carousels, setCarousels] = useState([]);
  const [carouselId, setCarouselId] = useState(null);
  const [carouselItems, setCarouselItems] = useState([{
    id: Date.now(),
    title: 'Impulsione seu Negócio!',
    text: 'Descubra como com a DKP',
    imageUrl: null,
    imagePosition: 'top',
    imageSize: 20,
    imagePositionX: 0,
    imagePositionY: 0,
    textPositionX: 0,
    textPositionY: 0
  }]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [titleFont, setTitleFont] = useState('Inika');
  const [titleFontWeight, setTitleFontWeight] = useState('Regular');
  const [textFont, setTextFont] = useState('Inter');
  const [textFontWeight, setTextFontWeight] = useState('Regular');
  const [fontSize, setFontSize] = useState('Medium');
  const [showHeadshot, setShowHeadshot] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showLinkedinHandle, setShowLinkedinHandle] = useState(false);
  const [showSlideNumber, setShowSlideNumber] = useState(false);
  const [backgroundDesign, setBackgroundDesign] = useState('blobs');
  const [useCustomColors, setUseCustomColors] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePosition, setImagePosition] = useState('top');
  const [imageSize, setImageSize] = useState(20);
  const [palette, setPalette] = useState(['#5567C9', '#C3C5F5', '#F8F9FD']);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedDiv, setSelectedDiv] = useState(null);

  const previewRef = useRef(null);
  const previewBack = useRef(null);

  const handleDivClick = (e, divId) => {
    e.stopPropagation();
    setSelectedDiv(divId);
  };

  const handleContainerClick = () => {
    setSelectedDiv(null);
  };

  const fonts = ['Inika', 'Arial', 'Helvetica', 'Inter', 'Times New Roman'];

  const handleAddItem = () => {
    const newPage = {
      id: Date.now(),
      title: 'Novo Título',
      text: 'Novo Texto',
      imageUrl: null,
      imagePosition: 'top',
      imageSize: 20,
      imagePositionX: 0,
      imagePositionY: 0,
      textPositionX: 0,
      textPositionY: 0
    };
    setCarouselItems([...carouselItems, newPage]);
    setCurrentPageIndex(carouselItems.length); // Set the new page as current page
  };

  const handleDeleteItem = (index) => {
    const newCarouselItems = carouselItems.filter((_, i) => i !== index);
    setCarouselItems(newCarouselItems);
    setCurrentPageIndex(Math.max(0, currentPageIndex - 1)); // Set the previous page as current if current page is deleted
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append('image', file);

    axios.post('/post/upload', formData)
      .then(response => {
        const imageUrl = "https://ws-booster-social-5040b10dd814.herokuapp.com" + response.data.url;
        console.log(imageUrl);
        setImageUrl(imageUrl);
        const newCarouselItems = [...carouselItems];
        newCarouselItems[currentPageIndex].imageUrl = imageUrl;
        setCarouselItems(newCarouselItems);
        updateThumbnail(currentPageIndex, newCarouselItems);
      })
      .catch(error => {
        console.error('Erro ao fazer upload da imagem:', error);
      });
  };

  const handleRemoveImage = () => {
    const newCarouselItems = [...carouselItems];
    newCarouselItems[currentPageIndex].imageUrl = null;
    setCarouselItems(newCarouselItems);
    updateThumbnail(currentPageIndex, newCarouselItems);
  };

  const handlePaletteSelect = (selectedPalette) => {
    setPalette(selectedPalette);
    updateSVGColor(selectedPalette); // Update SVG color when palette is selected
  };

  const updateSVGColor = (palette) => {
    fetch(`./assets/${backgroundDesign}.svg`)
      .then(response => response.text())
      .then(svgText => {
        const coloredSvgText = svgText
          .replace(/fill="#ffb142"/g, `fill="${palette[0]}"`)
          .replace(/fill="#52656F"/g, `fill="${palette[1]}"`)
          .replace(/width="[^"]*"/g, `width="448px"`)
          .replace(/height="[^"]*"/g, `height="568px"`);
        if (previewBack.current) {
          previewBack.current.style.backgroundImage = `url('data:image/svg+xml;base64,${btoa(coloredSvgText)}')`;
          previewBack.current.style.backgroundRepeat = 'no-repeat';
          previewBack.current.style.backgroundPosition = 'center';
          previewBack.current.style.backgroundColor = 'white'; // Adicione esta linha para definir a cor de fundo como branco
        }
      })
      .catch(error => {
        console.error('Error fetching or updating SVG:', error);
      });
  };

  const handleSizeChange = (e) => {
    const newSize = e.target.value;
    const newCarouselItems = [...carouselItems];
    newCarouselItems[currentPageIndex].imageSize = newSize;
    setCarouselItems(newCarouselItems);
    updateThumbnail(currentPageIndex, newCarouselItems);
  };

  const saveCarousel = async () => {
    try {
      const items = carouselItems.map(item => ({
        imageUrl: item.imageUrl,
        imagePosition: item.imagePosition,
        imageSize: item.imageSize,
        title: item.title,
        text: item.text,
        imagePositionX: item.imagePositionX,
        imagePositionY: item.imagePositionY,
        textPositionX: item.textPositionX,
        textPositionY: item.textPositionY
      }));

      if (carouselId) {
        await axios.put(`/carrossel/carrossel/${carouselId}`, {
          theme: backgroundDesign,
          titleFont,
          titleFontWeight,
          textFont,
          textFontWeight,
          showHeadshot,
          showName,
          showLinkedinHandle,
          showSlideNumber,
          backGroundTheme: useCustomColors,
          palette,
          items
        });
        console.log('Carousel updated');
      } else {
        await axios.post('/carrossel/carrossel', {
          theme: backgroundDesign,
          titleFont,
          titleFontWeight,
          textFont,
          textFontWeight,
          showHeadshot,
          showName,
          showLinkedinHandle,
          showSlideNumber,
          backGroundTheme: useCustomColors,
          userId,
          items
        });
        console.log('Carousel saved');
      }
    } catch (error) {
      console.error('Error saving carousel:', error);
    }
  };

  const deleteCarousel = async (id) => {
    try {
      await axios.delete(`/carrossel/carrossel/${id}`);
      console.log('Carousel deleted');
    } catch (error) {
      console.error('Error deleting carousel:', error);
    }
  };

  const handleGeneratePng = () => {
    if (previewBack.current === null) {
      return;
    }
    htmlToImage.toPng(previewBack.current)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'carousel.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error('oops, something went wrong!', error);
      });
  };

  const fetchCarousels = async () => {
    try {
      const response = await axios.get(`/carrossel/user/${userId}`);
      setCarousels(response.data);
    } catch (error) {
      console.error('Error fetching carousels:', error);
    }
  };

  const initializeEditCarousel = async (carousel) => {
    try {
      const response = await axios.get(`/carrossel/carrossel/${carousel.id}`);
      const fetchedCarousel = response.data;

      setBackgroundDesign(fetchedCarousel.theme);
      setTitleFont(fetchedCarousel.titleFont);
      setTitleFontWeight(fetchedCarousel.titleFontWeight);
      setTextFont(fetchedCarousel.textFont);
      setTextFontWeight(fetchedCarousel.textFontWeight);
      setShowHeadshot(fetchedCarousel.showHeadshot);
      setShowName(fetchedCarousel.showName);
      setShowLinkedinHandle(fetchedCarousel.showLinkedinHandle);
      setShowSlideNumber(fetchedCarousel.showSlideNumber);
      setUseCustomColors(fetchedCarousel.backGroundTheme);

      const items = fetchedCarousel.CarrosselItems.map(item => ({
        id: Date.now() + Math.random(),
        ...item,
        imageSize: item.imageSize || 20,
        imagePositionX: item.imagePositionX || 0,
        imagePositionY: item.imagePositionY || 0,
        textPositionX: item.textPositionX || 0,
        textPositionY: item.textPositionY || 0,
      }));

      setCarouselItems(items);
      setCurrentPageIndex(0); // Start with the first item in edit mode

      // Generate thumbnails for all items
      items.forEach((_, index) => updateThumbnail(index, items));
    } catch (error) {
      console.error('Error fetching carousel data:', error);
    }
  };

  const handleGenerateTitle = async () => {
    const origem = document.getElementById("origem").value;
    const origemId = document.getElementById("origemId").value;

    try {
      const payload = {
        userId: userId,
        idea: origemId === 'ai' ? origem : "",
        url: origemId !== 'ai' ? origem : ""
      };

      const response = await axios.post('/carrossel/getIdeiasCarrossel', payload);

      const { slideIdeas } = response.data;

      const newSlides = slideIdeas.split('\n\n').map((slideIdea) => {
        const [titlePart, ...descriptionParts] = slideIdea.split('\n');
        const title = titlePart.replace('Título: ', '');
        const text = descriptionParts.join('\n').replace('Descrição: ', '');

        return {
          id: Date.now() + Math.random(),
          title,
          text,
          imageUrl: null,
          imagePosition: 'top',
          imageSize: 20,
          imagePositionX: 0,
          imagePositionY: 0,
          textPositionX: 0,
          textPositionY: 0,
        };
      });

      setCarouselItems((prevItems) => {
        const updatedItems = [...prevItems, ...newSlides];
        // Generate thumbnails for all new slides
        newSlides.forEach((_, index) => updateThumbnail(index + prevItems.length, updatedItems));
        return updatedItems;
      });

    } catch (error) {
      console.error('Error generating title:', error);
    }
  };

  const updateThumbnail = async (index, items) => {
    const element = previewBack.current;
    if (element && items[index]) {
      const dataUrl = await createThumbnail(element);
      const newCarouselItems = [...items];
      newCarouselItems[index].thumbnail = dataUrl;
      setCarouselItems(newCarouselItems);
    }
  };

  const createThumbnail = async (element) => {
    const dataUrl = await htmlToImage.toPng(element);
    return dataUrl;
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`https://postlinkedin-229725447ae4.herokuapp.com/get-user-info?access_token=${accessToken}`);
        const userData = response.data;
        setUserInfo(userData);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
    fetchCarousels();
  }, [accessToken]);

  useEffect(() => {
    if (carouselItems.length > 0 && currentPageIndex < carouselItems.length) {
      const currentPage = carouselItems[currentPageIndex];
      setTitle(currentPage.title);
      setText(currentPage.text);
      setImageUrl(currentPage.imageUrl);
      setImagePosition(currentPage.imagePosition);
      setImageSize(currentPage.imageSize);
    }
  }, [currentPageIndex, carouselItems]);

  useEffect(() => {
    updateSVGColor(palette); // Initial SVG color update when component mounts
  }, [backgroundDesign, palette]);

  const handleDragStop = (e, data, type) => {
    const newCarouselItems = [...carouselItems];
    if (type === 'image') {
      newCarouselItems[currentPageIndex].imagePositionX = data.x;
      newCarouselItems[currentPageIndex].imagePositionY = data.y;
    } else if (type === 'text') {
      newCarouselItems[currentPageIndex].textPositionX = data.x;
      newCarouselItems[currentPageIndex].textPositionY = data.y;
    }
    setCarouselItems(newCarouselItems);
    updateThumbnail(currentPageIndex, newCarouselItems);
  };

  return (
    <CContainer className="p-10" onClick={handleContainerClick}>

      <CNav variant="tabs">
        <CNavItem>
          <CNavLink
            active={activeTab === 0}
            onClick={() => setActiveTab(0)}
          >
            + Create New
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={activeTab === 1}
            onClick={() => setActiveTab(1)}
          >
            My Carousels
          </CNavLink>
        </CNavItem>
      </CNav>
      <CTabContent activeTab={activeTab}>
        <CTabPane visible={activeTab === 0}>
          <CRow className="mt-1" >
            <FormGroup>
              <InputGroup className="input-group-title" md={10}>
                <CFormSelect id="origemId" value={textFontWeight} onChange={(e) => setTextFontWeight(e.target.value)}>
                  <option value="url">URL</option>
                  <option value="youtube">Youtube</option>
                  <option value="ai">AI</option>
                </CFormSelect>
                <Input
                  type="text"
                  name="title"
                  id="origem"
                  width="200px"
                />
                <InputGroupText>
                  <Button id="btGeraTitulo" color="warning" onClick={handleGenerateTitle}>
                    <i className="fa fa-bolt"></i>
                  </Button>
                </InputGroupText>
              </InputGroup>
            </FormGroup>
          </CRow>
          <CRow className="mt-1">
            <CCol md={5}>
              <div id="divBack" ref={previewBack} className="containerBack">
                <div id="divRef" ref={previewRef} className='containerRef'>
                  {carouselItems[currentPageIndex] && imagePosition === 'top' && imageUrl && (
                    <Draggable bounds="parent" position={{ x: carouselItems[currentPageIndex].imagePositionX, y: carouselItems[currentPageIndex].imagePositionY }} onStop={(e, data) => handleDragStop(e, data, 'image')}>
                      <CImage id="imageId" src={imageUrl} alt="Image" style={{ width: `${imageSize}%`, transform: 'translateX(-50%)', position: 'relative', marginBottom: '20px', objectFit: 'contain' }} className={`highlightable-div ${selectedDiv === 1 ? 'selected' : ''}`} onClick={(e) => handleDivClick(e, 1)} />
                    </Draggable>
                  )}
                  {carouselItems[currentPageIndex] && (
                    <Draggable bounds="parent" position={{ x: carouselItems[currentPageIndex].textPositionX, y: carouselItems[currentPageIndex].textPositionY }} onStop={(e, data) => handleDragStop(e, data, 'text')}>
                      <div className={`highlightable-div ${selectedDiv === 2 ? 'selected' : ''}`} style={{ transform: 'translateX(-50%)', position: 'relative' }} onClick={(e) => handleDivClick(e, 2)}>
                        <CCardTitle style={{ fontFamily: titleFont, fontWeight: titleFontWeight, fontSize: fontSize === 'Small' ? '16px' : (fontSize === 'Medium' ? '24px' : '32px'), color: palette[0] }}>{title}</CCardTitle>
                        <CCardText style={{ fontFamily: textFont, fontWeight: textFontWeight, fontSize: fontSize === 'Small' ? '12px' : (fontSize === 'Medium' ? '16px' : '20px'), color: palette[1] }}>{text}</CCardText>
                      </div>
                    </Draggable>
                  )}
                  {carouselItems[currentPageIndex] && imagePosition === 'bottom' && imageUrl && (
                    <Draggable bounds="parent" position={{ x: carouselItems[currentPageIndex].imagePositionX, y: carouselItems[currentPageIndex].imagePositionY }} onStop={(e, data) => handleDragStop(e, data, 'image')}>
                      <CImage id="imageId" src={imageUrl} alt="Image" style={{ width: `${imageSize}%`, transform: 'translateX(-50%)', position: 'relative', marginBottom: '20px', objectFit: 'contain' }} className={`highlightable-div ${selectedDiv === 1 ? 'selected' : ''}`} onClick={(e) => handleDivClick(e, 1)} />
                    </Draggable>
                  )}
                </div>
                <div className="css-vmpweq" style={{ gridRow: '3 / 4', display: 'flex', left: '30px', justifyContent: 'flex-start', gap: '0.417857rem', marginTop: '20px', bottom: "30px", position: "absolute", alignItems: "flex-start" }}>
                  {showHeadshot && userInfo && <CImage src={userInfo.picture} alt="Headshot" style={{ width: '40px', borderRadius: '50%', margin: '10px 0' }} />}
                  <div className="css-0" style={{ display: 'flex', flexDirection: 'column' }}>
                    {showName && userInfo && <CCardTitle style={{ fontSize: "0.73125rem", gap: '0.417857rem', paddingTop: '10px' }}>{userInfo.name}</CCardTitle>}
                    {showLinkedinHandle && userInfo && <CCardText style={{ fontSize: "0.70rem", gap: '0.417857rem', paddingTop: '5px' }}>@{userInfo.given_name}</CCardText>}
                  </div>
                </div>
              </div>

            </CCol>
            <CCol md={6}>
              <CTabs activeItemKey="profile">
                <CTabList variant="tabs">
                  <CTab itemKey="home">Content</CTab>
                  <CTab itemKey="profile">Settings</CTab>
                  <CTab itemKey="contact">Theme</CTab>
                  <CTab itemKey="preview">Preview</CTab>
                </CTabList>
                <CTabContent>
                  <CTabPanel className="p-3" itemKey="home">
                    <CCard>
                      <CCardBody>
                        <CForm>
                          <div className="mb-3">
                            <CFormLabel htmlFor="title">Title</CFormLabel>
                            <CFormInput
                              type="text"
                              id="title"
                              value={title}
                              onChange={(e) => {
                                setTitle(e.target.value);
                                const newCarouselItems = [...carouselItems];
                                newCarouselItems[currentPageIndex].title = e.target.value;
                                setCarouselItems(newCarouselItems);
                                updateThumbnail(currentPageIndex, newCarouselItems);
                              }}
                            />
                          </div>
                          <div className="mb-3">
                            <CFormLabel htmlFor="text">Text</CFormLabel>
                            <CFormTextarea
                              id="text"
                              rows="3"
                              value={text}
                              onChange={(e) => {
                                setText(e.target.value);
                                const newCarouselItems = [...carouselItems];
                                newCarouselItems[currentPageIndex].text = e.target.value;
                                setCarouselItems(newCarouselItems);
                                updateThumbnail(currentPageIndex, newCarouselItems);
                              }}
                            />
                          </div>
                          <div className="mb-3">
                            <CFormInput
                              type="file"
                              id="image"
                              onChange={handleImageChange}
                            />
                            {imageUrl && (
                              <div className="mt-2 position-relative" style={{ display: 'inline-block' }}>
                                <CImage src={imageUrl} thumbnail alt="Selected Image" width="120" />
                                <button
                                  onClick={handleRemoveImage}
                                  style={{
                                    position: 'absolute',
                                    top: '1px',
                                    right: '5px',
                                    background: 'none',
                                    border: 'none',
                                    color: 'red',
                                    fontSize: '20px',
                                    padding: 0,
                                    cursor: 'pointer',
                                  }}
                                >
                                  &times;
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="d-flex justify-content-between mb-3">
                            <div className="me-2 flex-grow-1">
                              <CFormSelect id="imagePosition" value={imagePosition} onChange={(e) => setImagePosition(e.target.value)}>
                                <option value="top">Top</option>
                                <option value="bottom">Bottom</option>
                              </CFormSelect>
                            </div>
                          </div>
                          <div className="mb-3">
                            <CFormRange
                              id="elementSize"
                              min={10}
                              max={100}
                              value={imageSize}
                              onChange={handleSizeChange}
                            />
                          </div>
                        </CForm>
                      </CCardBody>
                    </CCard>
                  </CTabPanel>
                  <CTabPanel className="p-3" itemKey="profile">
                    <CCard>
                      <CCardBody>
                        <CForm>
                          <div className="d-flex justify-content-between mb-3">
                            <div className="me-2 flex-grow-1">
                              <CFormLabel htmlFor="titleFont">Title Font</CFormLabel>
                              <CFormSelect id="titleFont" value={titleFont} onChange={(e) => setTitleFont(e.target.value)}>
                                {fonts.map(font => (
                                  <option key={font} value={font}>{font}</option>
                                ))}
                              </CFormSelect>
                            </div>
                            <div className="flex-grow-1">
                              <CFormLabel htmlFor="titleFontWeight">Title Font Weight</CFormLabel>
                              <CFormSelect id="titleFontWeight" value={titleFontWeight} onChange={(e) => setTitleFontWeight(e.target.value)}>
                                <option value="Regular">Regular</option>
                                <option value="Bold">Bold</option>
                              </CFormSelect>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between mb-3">
                            <div className="me-2 flex-grow-1">
                              <CFormLabel htmlFor="textFont">Text Font</CFormLabel>
                              <CFormSelect id="textFont" value={textFont} onChange={(e) => setTextFont(e.target.value)}>
                                {fonts.map(font => (
                                  <option key={font} value={font}>{font}</option>
                                ))}
                              </CFormSelect>
                            </div>
                            <div className="flex-grow-1">
                              <CFormLabel htmlFor="textFontWeight">Text Font Weight</CFormLabel>
                              <CFormSelect id="textFontWeight" value={textFontWeight} onChange={(e) => setTextFontWeight(e.target.value)}>
                                <option value="Regular">Regular</option>
                                <option value="Bold">Bold</option>
                              </CFormSelect>
                            </div>
                          </div>

                          <div className="mb-3">
                            <CFormLabel htmlFor="fontSize">Font Size</CFormLabel>
                            <CFormSelect id="fontSize" value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
                              <option value="Small">Small</option>
                              <option value="Medium">Medium</option>
                              <option value="Large">Large</option>
                            </CFormSelect>
                          </div>
                          <div className="mb-3">
                            <CFormCheck
                              type="checkbox"
                              id="showHeadshot"
                              label="Headshot"
                              checked={showHeadshot}
                              onChange={(e) => setShowHeadshot(e.target.checked)}
                            />
                          </div>
                          <div className="mb-3">
                            <CFormCheck
                              type="checkbox"
                              id="showName"
                              label="Name"
                              checked={showName}
                              onChange={(e) => setShowName(e.target.checked)}
                            />
                          </div>
                          <div className="mb-3">
                            <CFormCheck
                              type="checkbox"
                              id="showLinkedinHandle"
                              label="Linkedin Handle"
                              checked={showLinkedinHandle}
                              onChange={(e) => setShowLinkedinHandle(e.target.checked)}
                            />
                          </div>
                          <div className="mb-3">
                            <CFormCheck
                              type="checkbox"
                              id="showSlideNumber"
                              label="Show Slide Number"
                              checked={showSlideNumber}
                              onChange={(e) => setShowSlideNumber(e.target.checked)}
                            />
                          </div>
                        </CForm>
                      </CCardBody>
                    </CCard>
                  </CTabPanel>
                  <CTabPanel className="p-3" itemKey="contact">
                    <CCard>
                      <CCardBody>
                        <CForm>
                          <div className="mb-3">
                            <CFormLabel htmlFor="backgroundDesign">Background Design Elements</CFormLabel>
                            <CFormCheck
                              type="checkbox"
                              id="backgroundDesign"
                              label="Background Design Elements"
                              checked={useCustomColors}
                              onChange={(e) => setUseCustomColors(e.target.checked)}
                            />
                            <CFormSelect id="backgroundDesign" value={backgroundDesign} onChange={(e) => setBackgroundDesign(e.target.value)}>
                              <option value="blobs">Blobs</option>
                              <option value="blur-scribble">Blur & Scribble</option>
                              <option value="blurs-1">Blurs 1</option>
                              <option value="blurs-2">Blurs 2</option>
                              <option value="blurs-3">Blurs 3</option>
                              <option value="circles">Circles</option>
                              <option value="dots">Dots</option>
                              <option value="scribbles-1">Scribbles 1</option>
                              <option value="scribbles-2">Scribbles 2</option>
                              <option value="triangles">Triangles</option>
                            </CFormSelect>
                          </div>
                          <PaletteSelector onSelect={handlePaletteSelect} /> {/* Use the new component here */}
                        </CForm>
                      </CCardBody>
                    </CCard>
                  </CTabPanel>
                  <CTabPanel className="p-3" itemKey="disabled">
                    Disabled tab content
                  </CTabPanel>
                </CTabContent>
              </CTabs>
            </CCol>
          </CRow>
        </CTabPane>
        <CTabPane visible={activeTab === 1}>
          <h4 className="mt-4">My Carousels</h4>
          {carousels.map(carousel => (
            <CCard key={carousel.id} className="mb-3">
              <CCardBody>
                <CCardTitle>{carousel.CarrosselItems[0].title}</CCardTitle>
                <CCardText>{carousel.CarrosselItems[0].text}</CCardText>
                <CButton color="info" className="me-2" onClick={() => { setActiveTab(0); setCarouselId(carousel.id); initializeEditCarousel(carousel); }}>
                  <CIcon icon={cilPencil} /> Edit
                </CButton>
                <CButton color="danger" onClick={() => deleteCarousel(carousel.id)}>
                  <CIcon icon={cilTrash} /> Delete
                </CButton>
              </CCardBody>
            </CCard>
          ))}
        </CTabPane>
      </CTabContent>

      <CRow className='mt-8'>
        <MiniatureDragDrop
          carouselItems={carouselItems}
          setCarouselItems={setCarouselItems}
          setCurrentPageIndex={setCurrentPageIndex}
          handleAddItem={handleAddItem}
          handleDeleteItem={handleDeleteItem}
          titleFont={titleFont}
          titleFontWeight={titleFontWeight}
          palette={palette}
        />
      </CRow>
      <CRow className="mt-4">
        <CCol>
          <CButton color="secondary" className="me-2" onClick={saveCarousel}>
            <CIcon icon={cilSave} /> {carouselId ? 'Save' : 'Add'}
          </CButton>
          <CButton color="info" className="me-2" onClick={handleGeneratePng}>
            <CIcon icon={cilCloudDownload} /> Download PNG
          </CButton>
        </CCol>
      </CRow>
    </CContainer >
  );
}

export default Carrossel;
