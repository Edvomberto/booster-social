import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import {
  CContainer, CButton, CFormInput, CNav, CNavItem, CNavLink, CTabContent, CTabPane,
  CFormSelect, CFormCheck, CCard, CCardBody, CCardTitle, CCardText, CImage,
  CRow, CCol, CFormLabel, CFormTextarea, CForm, CTabs, CTabList, CTab, CTabPanel, CFormRange, CInputGroup, CInputGroupText, CCloseButton
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSave, cilCloudDownload, cilTrash, cilPencil } from '@coreui/icons';
import * as htmlToImage from 'html-to-image';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import axios from '../axiosConfig';
import axios2 from 'axios';

import '../components/Highlight.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import MiniatureDragDrop from './MiniatureDragDrop';
import PaletteSelector from '../components/PalleteSelector';
import PreviewModal from './PreviewModal';

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
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [postText, setPostText] = useState('');
  const [pdf, setPdf] = useState(null);
  const [pngImages, setPngImages] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false); // Novo estado para controlar o carregamento da imagem

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
        setImageLoaded(false); // Resetar estado de carregamento da imagem
        updateThumbnail(currentPageIndex, newCarouselItems);
      })
      .catch(error => {
        console.error('Erro ao fazer upload da imagem:', error);
      });
  };

  const handleRemoveImage = () => {
    const newCarouselItems = [...carouselItems];
    newCarouselItems[currentPageIndex].imageUrl = null; // Modifique apenas a imagem da página atual
    setCarouselItems(newCarouselItems);
    setImageLoaded(false); // Resetar estado de carregamento da imagem
    updateThumbnail(currentPageIndex, newCarouselItems);
  };

  const handleImageLoad = () => {
    setImageLoaded(true); // Atualizar estado quando a imagem for carregada
  };

  const generatePngImages = async () => {
    try {
      const images = [];

      for (const [index, item] of carouselItems.entries()) {
        const element = previewBack.current;
        if (element) {
          console.log(`Rendering item ${index}...`);
          setCurrentPageIndex(index);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for rendering

          if (!imageUrl || imageLoaded) { // Verificar se a imagem está carregada
            try {
              const imgData = await toPng(element, { quality: 1 });
              images.push(imgData);
            } catch (error) {
              console.error(`Erro ao gerar imagem PNG para o item ${index}:`, error);
            }
          } else {
            console.warn(`Imagem não carregada para o item ${index}, pulando...`);
          }
        }
      }

      setPngImages(images);
      setShowPreviewModal(true);
    } catch (error) {
      console.error('Erro ao gerar imagens PNG:', error);
    }
  };

  const handlePaletteSelect = (selectedPallete) => {
    setPalette(selectedPallete);
    updateSVGColor(selectedPallete); // Update SVG color when palette is selected
    if (carouselItems.length > 0) {
      carouselItems.forEach((_, index) => updateThumbnail(index, carouselItems, selectedPallete));
    }
  };

  const updateSVGColor = (pallete) => {
    fetch(`./assets/${backgroundDesign}.svg`)
      .then(response => response.text())
      .then(svgText => {
        const coloredSvgText = svgText
          .replace(/fill="#ffb142"/g, `fill="${pallete[0]}"`)
          .replace(/fill="#52656F"/g, `fill="${pallete[1]}"`)
          .replace(/width="[^"]*"/g, `width="448px"`)
          .replace(/height="[^"]*"/g, `height="568px"`);
        if (previewBack.current) {
          previewBack.current.style.backgroundImage = `url('data:image/svg+xml;base64,${btoa(coloredSvgText)}')`;
          previewBack.current.style.backgroundRepeat = 'no-repeat';
          previewBack.current.style.backgroundPosition = 'center';
          previewBack.current.style.backgroundColor = pallete[3]; // Adicione esta linha para definir a cor de fundo como branco
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

  const generatePDF = async () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait', // Orientação retrato
        unit: 'mm', // Unidade em milímetros
        format: [119, 150] // Dimensões 119 x 150 mm
      });
      console.log('Generating PDF...');

      for (const [index, item] of carouselItems.entries()) {
        const element = previewBack.current;
        if (element) {
          console.log(`Rendering item ${index}...`);
          setCurrentPageIndex(index);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for rendering

          const imgData = await toPng(element, {
            quality: 1,
            width: element.offsetWidth,
            height: element.offsetHeight,
          });

          const pdfWidth = 119; // Largura do PDF em mm
          const pdfHeight = 150; // Altura do PDF em mm

          // Manter a proporção da imagem ajustada às dimensões do PDF
          const aspectRatio = element.offsetHeight / element.offsetWidth;
          const adjustedHeight = pdfWidth * aspectRatio;

          if (index > 0) doc.addPage();
          doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, adjustedHeight);
        }
      }

      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      console.log('PDF generated:', pdfUrl);

      return pdfBlob; // Retornar o PDF Blob para upload posterior
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  };

  const deleteCarousel = async (id) => {
    if (window.confirm('Tem certeza de que deseja excluir este carrossel?')) {
      try {
        await axios.delete(`/carrossel/carrossel/${id}`);
        console.log('Carousel deleted');
        setCarousels(carousels.filter(carousel => carousel.id !== id));
      } catch (error) {
        console.error('Error deleting carousel:', error);
      }
    }
  };

  const handleGeneratePng = () => {
    if (previewBack.current === null) {
      return;
    }
    toPng(previewBack.current)
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
      setPalette(fetchedCarousel.palette || ['#5567C9', '#C3C5F5', '#F8F9FD']);

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

      // Generate thumbnails for all items with correct palette
      items.forEach((_, index) => updateThumbnail(index, items, fetchedCarousel.palette || ['#5567C9', '#C3C5F5', '#F8F9FD']));
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

      console.log('slideIdeas:', slideIdeas); // Log para verificar a resposta

      // Corrigindo o parse dos dados retornados
      const ideasArray = slideIdeas.split('\n\n').map(idea => {
        try {
          return JSON.parse(idea.replace(/\n/g, ''));
        } catch (e) {
          console.error('Error parsing idea:', idea, e);
          return null;
        }
      }).filter(idea => idea !== null);

      console.log('ideasArray:', ideasArray); // Log para verificar o array processado

      const newSlides = ideasArray.map(slideIdea => ({
        id: Date.now() + Math.random(),
        title: slideIdea.titulo,
        text: slideIdea.conteudo,
        imageUrl: null,
        imagePosition: 'top',
        imageSize: 20,
        imagePositionX: 0,
        imagePositionY: 0,
        textPositionX: 0,
        textPositionY: 0,
      }));

      console.log('newSlides:', newSlides); // Log para verificar os novos slides

      // Limpar páginas anteriores e definir novas
      setCarouselItems(newSlides);
      setCurrentPageIndex(0);

      // Gerar miniaturas para todos os novos slides
      newSlides.forEach((_, index) => updateThumbnail(index, newSlides));
    } catch (error) {
      console.error('Error generating title:', error);
    }
  };

  const updateThumbnail = async (index, items, selectedPalette) => {
    const element = previewBack.current;
    const paletteToUse = selectedPalette || palette;

    if (element && items[index]) {
      // Temporarily update the previewBack with the palette for thumbnail generation
      updateSVGColor(paletteToUse);

      const dataUrl = await createThumbnail(element);
      const newCarouselItems = [...items];
      newCarouselItems[index].thumbnail = dataUrl;
      setCarouselItems(newCarouselItems);

      // Restore the original palette
      updateSVGColor(palette);
    }
  };

  const createThumbnail = async (element) => {
    const dataUrl = await htmlToImage.toPng(element);
    return dataUrl;
  };

  const fetchPostText = async () => {
    try {
      const response = await axios.get(`/carrossel/generatePostText`);
      setPostText(response.data.text);
    } catch (error) {
      console.error('Error fetching post text:', error);
    }
  };

  const postToLinkedIn = async () => {
    try {
        // 1. Gerar o PDF
        const pdfBlob = await generatePDF();

        // 2. Fazer o upload do PDF
        const formData = new FormData();
        formData.append('file', pdfBlob, 'carousel.pdf');

        const uploadResponse = await axios.post('/post/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log(uploadResponse.data.url);

        const filePath = "https://ws-booster-social-5040b10dd814.herokuapp.com" + uploadResponse.data.url;

        console.log(filePath);

        // 3. Fazer a postagem no LinkedIn
        await axios.post('/post/post_carrossel', {
            accessToken,
            commentary: postText,
            filePath
        });

        console.log('Post successfully published to LinkedIn');
    } catch (error) {
        console.error('Error posting to LinkedIn:', error);
    }
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

  useEffect(() => {
    if (carouselItems.length > 0) {
      carouselItems.forEach((_, index) => updateThumbnail(index, carouselItems));
    }
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
          <CRow className="mt-2">
            <CCol md="auto">
              <CFormSelect id="origemId" value={textFontWeight} onChange={(e) => setTextFontWeight(e.target.value)}>
                <option value="url">URL</option>
                <option value="youtube">Youtube</option>
                <option value="ai">AI</option>
              </CFormSelect>
            </CCol>
            <CCol md={9}>
              <CInputGroup>
                <CFormInput
                  type="text"
                  name="title"
                  id="origem"
                />
                <CInputGroupText>
                  <CButton id="btGeraTitulo" color="warning" onClick={handleGenerateTitle} >
                    <i className="fa fa-bolt"></i>
                  </CButton>
                </CInputGroupText>
              </CInputGroup>
            </CCol>
            <CCol md="auto" className="d-flex align-items-center">
              <CButton id="btGeraPreview" color="warning" onClick={generatePngImages} style={{ width: '100px' }}>
                <span>Preview</span>
                <i className="fa fa-bolt"></i>
              </CButton>
            </CCol>
          </CRow>
          <CRow className="mt-1">
            <CCol md={5}>
              <div id="divBack" ref={previewBack} className="containerBack">
                <div id="divRef" ref={previewRef} className='containerRef'>
                  {carouselItems[currentPageIndex] && imagePosition === 'top' && imageUrl && (
                    <Draggable bounds="parent" position={{ x: carouselItems[currentPageIndex].imagePositionX, y: carouselItems[currentPageIndex].imagePositionY }} onStop={(e, data) => handleDragStop(e, data, 'image')}>
                      <CImage id="imageId" src={imageUrl} alt="Image" style={{ width: `${imageSize}%`, transform: 'translateX(-50%)', position: 'relative', marginBottom: '20px', objectFit: 'contain' }} className={`highlightable-div ${selectedDiv === 1 ? 'selected' : ''}`} onClick={(e) => handleDivClick(e, 1)} onLoad={handleImageLoad} />
                    </Draggable>
                  )}
                  {carouselItems[currentPageIndex] && (
                    <Draggable bounds="parent" position={{ x: carouselItems[currentPageIndex].textPositionX, y: carouselItems[currentPageIndex].textPositionY }} onStop={(e, data) => handleDragStop(e, data, 'text')}>
                      <div className={`highlightable-div ${selectedDiv === 2 ? 'selected' : ''}`} style={{ transform: 'translateX(-50%)', position: 'relative' }} onClick={(e) => handleDivClick(e, 2)}>
                        {showSlideNumber && currentPageIndex > 0 && (
                          <div style={{ position: 'absolute', top: '-20px', left: '5%', transform: 'translateX(-50%)', background: palette[0], borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                            {currentPageIndex}
                          </div>
                        )}
                        <CCardTitle style={{ fontFamily: titleFont, paddingTop: '20px', fontWeight: titleFontWeight, fontSize: fontSize === 'Small' ? '16px' : (fontSize === 'Medium' ? '24px' : '32px'), color: palette[0] }}>{title}</CCardTitle>
                        <CCardText style={{ fontFamily: textFont, paddingTop: '20px', fontWeight: textFontWeight, fontSize: fontSize === 'Small' ? '12px' : (fontSize === 'Medium' ? '16px' : '20px'), color: palette[1] }}>{text}</CCardText>
                      </div>
                    </Draggable>
                  )}
                  {carouselItems[currentPageIndex] && imagePosition === 'bottom' && imageUrl && (
                    <Draggable bounds="parent" position={{ x: carouselItems[currentPageIndex].imagePositionX, y: carouselItems[currentPageIndex].imagePositionY }} onStop={(e, data) => handleDragStop(e, data, 'image')}>
                      <CImage id="imageId" src={imageUrl} alt="Image" style={{ width: `${imageSize}%`, transform: 'translateX(-50%)', position: 'relative', marginBottom: '20px', objectFit: 'contain' }} className={`highlightable-div ${selectedDiv === 1 ? 'selected' : ''}`} onClick={(e) => handleDivClick(e, 1)} onLoad={handleImageLoad} />
                    </Draggable>
                  )}
                </div>
                <div className="css-vmpweq" style={{ gridRow: '3 / 4', display: 'flex', left: '30px', justifyContent: 'flex-start', gap: '0.417857rem', marginTop: '20px', bottom: "30px", position: "absolute", alignItems: "flex-start" }}>
                  {showHeadshot && userInfo && <CImage src={userInfo.picture} alt="Headshot" style={{ width: '40px', borderRadius: '50%', margin: '10px 0' }} />}
                  <div className="css-0" style={{ display: 'flex', flexDirection: 'column' }}>
                    {showName && userInfo && <CCardTitle style={{ fontSize: "0.73125rem", gap: '0.417857rem', paddingTop: '10px', color: palette[0] }}>{userInfo.name}</CCardTitle>}
                    {showLinkedinHandle && userInfo && <CCardText style={{ fontSize: "0.70rem", gap: '0.417857rem', paddingTop: '5px', color: palette[1] }}>@{userInfo.given_name}</CCardText>}
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
                                <CCloseButton
                                  onClick={handleRemoveImage}
                                  style={{
                                    position: 'absolute',
                                    top: '5px',
                                    right: '5px',
                                    background: 'black',
                                    border: 'none',
                                    color: 'red',
                                    fontSize: '20px',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    padding: 0,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >&times;
                                </CCloseButton>
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
                </CTabContent>
              </CTabs>
            </CCol>
          </CRow>
          <CRow className='mt-8'>
            <CCol >
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
            </CCol>
            <CCol>
              <CFormLabel htmlFor="postText">Post Text</CFormLabel>
              <CFormTextarea 
                id="postText"
                rows="3"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                style={{ width: '500px' }} // Defina a largura desejada aqui

              />
            </CCol>
          </CRow>
          <CRow className="mt-4">
            <CCol>
              <CButton color="secondary" className="me-2" onClick={saveCarousel}>
                <CIcon icon={cilSave} /> {carouselId ? 'Save' : 'Add'}
              </CButton>
              <CButton color="info" className="me-2" onClick={generatePDF}>
                <CIcon icon={cilCloudDownload} /> Download PDF
              </CButton>
              <CButton color="primary" onClick={postToLinkedIn}>
                Post to LinkedIn
              </CButton>
            </CCol>

          </CRow>
        </CTabPane>
        <CTabPane visible={activeTab === 1}>
          <h4 className="mt-4">My Carousels</h4>
          {carousels.map(carousel => (
            <CCard key={carousel.id} className="mb-3">
              <CCardBody>
                {carousel.CarrosselItems && carousel.CarrosselItems.length > 0 && (
                  <>
                    <CCardTitle>{carousel.CarrosselItems[0].title}</CCardTitle>
                    <CCardText>{carousel.CarrosselItems[0].text}</CCardText>
                  </>
                )}
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

      <PreviewModal
        show={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        pngImages={pngImages}
      />
      <CRow className="mt-5" />
    </CContainer>
  );
}

export default Carrossel;
