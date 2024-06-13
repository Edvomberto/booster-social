// src/pages/PostModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Spinner,
  InputGroup,
  InputGroupText
} from 'reactstrap';
import './PostGeneration.css';
import axios from '../axiosConfig';
import { CToast, CToastBody, CToastHeader, CToaster, CButtonGroup, CFormCheck } from '@coreui/react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const PostModal = ({ isOpen, toggle, onSave, post }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [subject, setSubject] = useState('');
  const [ideas, setIdeas] = useState([{ summary: '' }]);
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const accessToken = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedGenerator, setSelectedGenerator] = useState('leonardo');
  const [selectedAi, setSelectedAi] = useState('llama3'); // State for selected AI
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      let formattedContent = post.content.replace(/<br\s*\/?>/gi, '\n');
      setContent(formattedContent);
      setImageUrl(post.image ? `${post.image}` : '');
    } else {
      setTitle('');
      setContent('');
      setImageUrl('');
    }
  }, [post]);

  const addToast = (message, color) => {
    setToasts([...toasts, { message, color }]);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSave = async () => {
    setLoading(true);

    const postData = {
      title,
      content: content,
      image: imageUrl,
    };
    await onSave(postData);
    setLoading(false);
    toggle();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append('image', file);

    axios.post('/upload', formData)
      .then(response => {
        const imageUrl = axios.defaults.baseURL + response.data.url;
        setImageUrl(imageUrl);
        addToast('Imagem carregada com sucesso!', 'success');
      })
      .catch(error => {
        console.error('Erro ao fazer upload da imagem:', error);
        addToast('Erro ao fazer upload da imagem!', 'warning');
      });
  };

  const handleGetPostIdeas = async () => {
    setLoading(true);
    const qtde = 3;
    try {
      const response = await axios.post('/post-ideas-llama', { subject, qtde });
      setIdeas(response.data.ideas.ideas);
      setCurrentIdeaIndex(0); // Reset to the first idea
    } catch (error) {
      console.error('Error fetching post ideas:', error);
    }
    setLoading(false);
  };

  const handlePrevIdea = () => {
    if (currentIdeaIndex > 0) {
      setCurrentIdeaIndex(currentIdeaIndex - 1);
    }
  };

  const handleNextIdea = () => {
    if (currentIdeaIndex < ideas.length - 1) {
      setCurrentIdeaIndex(currentIdeaIndex + 1);
    }
  };

  const handleGeneratePost = async () => {
    setLoading(true);

    if (ideas[currentIdeaIndex]) {
      try {
        let response;
        if (selectedAi === 'llama3') {
          response = await axios.post('/create-post-llama', { idea: `${ideas[currentIdeaIndex].title}\n${ideas[currentIdeaIndex].summary}` });
        } else if (selectedAi === 'gpt') {
          response = await axios.post('/create-post-gpt', { idea: `${ideas[currentIdeaIndex].title}\n${ideas[currentIdeaIndex].summary}` });
        } else if (selectedAi === 'gemini') {
          response = await axios.post('/create-post-gemini', { idea: `${ideas[currentIdeaIndex].title}\n${ideas[currentIdeaIndex].summary}` });
        }

        const { title, content } = response.data.post;
        setTitle(title);
        setContent(content);
        addToast('Post gerado com sucesso!', 'success');
      } catch (error) {
        console.error('Error generating post:', error);
        addToast('Erro ao gerar o post!', 'warning');
      }
      setLoading(false);
    }
  };

  const handlePostToLinkedIn = async () => {
    setLoading(true);

    const storedAccessToken = localStorage.getItem('access_token') || accessToken;
    if (!storedAccessToken) {
      addToast('Faça login no LinkedIn primeiro.', 'warning');
      setLoading(false);
      return;
    }

    const postContent = {
      accessToken: storedAccessToken,
      text: `${title}\n\n${content}`,
      media_url: imageUrl || null,
    };

    try {
      await axios.post('/post-linkedin', postContent, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      addToast('Post publicado no LinkedIn com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao postar no LinkedIn:', error);
      addToast('Erro ao postar no LinkedIn.', 'warning');
    }
    setLoading(false);
    toggle();
  };

  const handleGenerateImage = async () => {
    const contextText = document.getElementById('content').value;
    if (contextText && selectedStyle) {
      setLoading(true);
      try {
        const response = selectedGenerator === 'leonardo'
          ? await axios.post('/gerar-imagem-leo', { prompt: contextText, estilo: selectedStyle })
          : await axios.post('/gerar-imagem', { prompt: contextText, estilo: selectedStyle });

        setImageUrl(response.data.imageUrl);
        addToast('Imagem gerada com sucesso!', 'success');
      } catch (error) {
        console.error('Error generating image:', error);
        addToast('Erro ao tentar gerar a imagem!', 'warning');
      }
      setLoading(false);
    }
  };

  const handleGenerateTitle = async () => {
    const contentText = document.getElementById('content').value;
    if (contentText) {
      setLoading(true);
      try {
        const response = await axios.post('/gerar-titulo', { content: contentText });
        setTitle(response.data.title);
        addToast('Título gerado com sucesso!', 'success');
      } catch (error) {
        console.error('Error generating title:', error);
        addToast('Erro ao gerar o título!', 'warning');
      }
      setLoading(false);
    }
  };

  const handleIdeaChange = (e) => {
    const newSummary = e.target.value;
    setIdeas(prev => {
      const newIdeas = [...prev];
      if (newIdeas[currentIdeaIndex]) {
        newIdeas[currentIdeaIndex].summary = newSummary;
      }
      return newIdeas;
    });
  };

  const currentIdea = ideas[currentIdeaIndex] ? ideas[currentIdeaIndex].summary : '';

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-lg-custom">
      <ModalHeader toggle={toggle}>
        {post ? 'Editar Post' : 'Adicionar Post'}
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col md="3">
            <FormGroup>
              <Label for="subject">Assunto</Label>
              <Input
                type="text"
                name="subject"
                id="subject"
                placeholder="Informe o assunto para obter ideias de post"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-2"
              />
            </FormGroup>
            <FormGroup>
              <Button color="primary" onClick={handleGetPostIdeas} disabled={loading}>
                {loading ? <Spinner size="sm" /> : 'Ideias de Post'}
              </Button>
            </FormGroup>
            <FormGroup>
              <textarea
                id="ideas"
                value={currentIdea}
                onChange={handleIdeaChange}
                placeholder="O conteúdo do post aparecerá aqui"
                className="chakra-textarea css-ydh6re"
                rows="5"
                style={{ width: '100%' }}
              />
              <div className="d-flex justify-content-between mt-2">
                <Button
                  onClick={handlePrevIdea}
                  disabled={currentIdeaIndex === 0}
                  className="btn-sm btn-secondary"
                >
                  <span className="chakra-button__icon">
                    <svg viewBox="0 0 24 24" focusable="false" className="chakra-icon" aria-hidden="true">
                      <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
                    </svg>
                  </span>
                  Prev
                </Button>
                <Button
                  onClick={handleNextIdea}
                  disabled={currentIdeaIndex === ideas.length - 1}
                  className="btn-sm btn-secondary"
                >
                  Next
                  <span className="chakra-button__icon">
                    <svg viewBox="0 0 24 24" focusable="false" className="chakra-icon" aria-hidden="true">
                      <path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path>
                    </svg>
                  </span>
                </Button>
              </div>
              <div className="mt-2">
                <Button color="success" onClick={handleGeneratePost} disabled={loading}>
                  {loading ? <Spinner size="sm" /> : 'Gerar Post'}
                </Button>
                <FormGroup>
              <CButtonGroup role="group" aria-label="Basic radio toggle button group">
                <CFormCheck
                  type="radio"
                  button={{ color: 'primary', variant: 'outline' }}
                  name="btnradioAi"
                  id="btnradioAi1"
                  autoComplete="off"
                  label="Llama 3"
                  checked={selectedAi === 'llama3'}
                  onChange={() => setSelectedAi('llama3')}
                />
                <CFormCheck
                  type="radio"
                  button={{ color: 'primary', variant: 'outline' }}
                  name="btnradioAi"
                  id="btnradioAi2"
                  autoComplete="off"
                  label="GPT"
                  checked={selectedAi === 'gpt'}
                  onChange={() => setSelectedAi('gpt')}
                />
                <CFormCheck
                  type="radio"
                  button={{ color: 'primary', variant: 'outline' }}
                  name="btnradioAi"
                  id="btnradioAi3"
                  autoComplete="off"
                  label="Gemini"
                  checked={selectedAi === 'gemini'}
                  onChange={() => setSelectedAi('gemini')}
                />
              </CButtonGroup>
            </FormGroup>                
              </div>
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label for="title">Título</Label>
              <InputGroup className="input-group-title">
                <Input
                  type="text"
                  name="title"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <InputGroupText>
                  <Button id="btGeraTitulo" color="warning" onClick={handleGenerateTitle} disabled={loading}>
                    {loading ? <Spinner size="sm" /> : <i className="fa fa-bolt"></i>}
                  </Button>
                </InputGroupText>
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label for="content">Conteúdo</Label>
              <textarea
                id="content"
                value={content}
                onChange={handleContentChange}
                placeholder="Digite o conteúdo do post aqui"
                className="chakra-textarea css-ydh6re"
                rows="10"
                style={{ width: '100%' }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="image">Imagem</Label>
              <Input
                type="file"
                name="image"
                id="image"
                onChange={handleImageChange}
              />
              {imageUrl && (
                <div className="mt-2">
                  <img src={`${imageUrl}`} alt="Post" style={{ width: '100%' }} />
                </div>
              )}
            </FormGroup>
            <FormGroup>
              <div className="d-flex align-items-center">
                <Input
                  type="select"
                  name="style"
                  id="style"
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                >
                  <option value="">Selecione um estilo</option>
                  <option value="vangogh">Van Gogh</option>
                  <option value="pixel">Pixel</option>
                  <option value="300">300</option>
                  <option value="anime">Anime</option>
                  <option value="suits">Suits</option>
                  <option value="gótico">Gótico</option>
                  <option value="oriental">Oriental</option>
                  <option value="buda">Buda</option>
                  <option value="indiano">Indiano</option>
                  <option value="dark">Dark</option>
                  <option value="vampiro">Vampiro</option>
                  <option value="peaky">Peaky Blinder</option>
                  <option value="indio">Índio Norte Americano</option>
                </Input>
                <Button color="warning" onClick={handleGenerateImage} disabled={loading} className="ml-2">
                  {loading ? <Spinner size="sm" /> : <i className="fa fa-bolt"></i>}
                </Button>
              </div>
            </FormGroup>
            <FormGroup>
              <CButtonGroup role="group" aria-label="Basic radio toggle button group">
                <CFormCheck
                  type="radio"
                  button={{ color: 'primary', variant: 'outline' }}
                  name="btnradio"
                  id="btnradio1"
                  autoComplete="off"
                  label="Leonardo"
                  checked={selectedGenerator === 'leonardo'}
                  onChange={() => setSelectedGenerator('leonardo')}
                />
                <CFormCheck
                  type="radio"
                  button={{ color: 'primary', variant: 'outline' }}
                  name="btnradio"
                  id="btnradio2"
                  autoComplete="off"
                  label="DALL-E"
                  checked={selectedGenerator === 'dall-e'}
                  onChange={() => setSelectedGenerator('dall-e')}
                />
              </CButtonGroup>
            </FormGroup>

          </Col>
          <Col md="5">
            <div className="linkedin-preview">
              <h5>{title}</h5>
              <hr className="my-2" style={{ border: '1px dotted' }} />
              <div style={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: content }} />
              {imageUrl && (
                <div className="mt-2">
                  <img src={`${imageUrl}`} alt="Post" style={{ width: '100%' }} />
                </div>
              )}
            </div>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSave}>{post ? 'Salvar' : 'Adicionar'}</Button>
        <Button color="success" onClick={handlePostToLinkedIn}>Postar</Button>
        <Button color="secondary" onClick={toggle}>Cancelar</Button>
      </ModalFooter>
      <CToaster position="top-right">
        {toasts.map((toast, index) => (
          <CToast key={index} autohide={true} visible={true} color={toast.color}>
            <CToastHeader closeButton>
              <strong className="me-auto">Notificação</strong>
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>
    </Modal>
  );
};

export default PostModal;
