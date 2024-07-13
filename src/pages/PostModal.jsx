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
  InputGroupText,
} from 'reactstrap';
import './PostGeneration.css';
import axios from '../axiosConfig';
import { useTranslation } from 'react-i18next';
import { CToast, CToastBody, CToastHeader, CToaster, CButtonGroup, CFormCheck } from '@coreui/react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './PostModal.css';

const PostModal = ({ isOpen = false, toggle = () => { }, onSave = () => { }, post = null, userId = null }) => {
  const { t, i18n } = useTranslation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [subject, setSubject] = useState('');
  const [ideas, setIdeas] = useState([{ summary: '' }]);
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [accessToken] = useState('');
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
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
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
      content,
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

    axios.post('/post/upload', formData)
      .then(response => {
        const imageUrl = "https://ws-booster-social-5040b10dd814.herokuapp.com" + response.data.url;
        setImageUrl(imageUrl);
        addToast(t('image_upload_success'), 'success');
      })
      .catch(error => {
        console.error('Erro ao fazer upload da imagem:', error);
        addToast(t('image_upload_error'), 'warning');
      });
  };

  const handleGetPostIdeas = async () => {
    setLoading(true);
    const qtde = 3;
    try {
      const response = await axios.post('/post/post-ideas-llama', { userId, subject, qtde });
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
          response = await axios.post('/post/create-post-llama', { userId, idea: `${ideas[currentIdeaIndex].title}\n${ideas[currentIdeaIndex].summary}` });
        } else if (selectedAi === 'gpt') {
          response = await axios.post('/post/create-post-gpt', { userId, idea: `${ideas[currentIdeaIndex].title}\n${ideas[currentIdeaIndex].summary}` });
        } else if (selectedAi === 'gemini') {
          response = await axios.post('/post/create-post-gemini', { userId, idea: `${ideas[currentIdeaIndex].title}\n${ideas[currentIdeaIndex].summary}` });
        }

        const { title, content } = response.data.post;
        setTitle(title);
        setContent(content);
        addToast(t('post_generated_success'), 'success');
      } catch (error) {
        console.error('Error generating post:', error);
        addToast(t('post_generated_error'), 'warning');
      }
      setLoading(false);
    }
  };

  const handlePostToLinkedIn = async () => {
    setLoading(true);

    const storedAccessToken = localStorage.getItem('access_token') || accessToken;
    if (!storedAccessToken) {
      addToast(t('login_linkedin_warning'), 'warning');
      setLoading(false);
      window.location.href = '/loginLinkedin'; // Redirecionar para a página de login
      return;
    }

    const postContent = {
      accessToken: storedAccessToken,
      text: `${title}\n\n${content}`,
      media_url: imageUrl || null,
    };

    try {
      await axios.post('/post/post-linkedin', postContent, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      addToast(t('linkedin_post_success'), 'success');
    } catch (error) {
      console.error('Erro ao postar no LinkedIn:', error);
      addToast(t('linkedin_post_error'), 'warning');
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
          ? await axios.post('/post/gerar-imagem-leo', { userId, prompt: contextText, estilo: selectedStyle })
          : await axios.post('/post/gerar-imagem', { userId, prompt: contextText, estilo: selectedStyle });

        setImageUrl(response.data.imageUrl);
        addToast(t('image_upload_success'), 'success');
      } catch (error) {
        console.error('Error generating image:', error);
        addToast(t('image_upload_error'), 'warning');
      }
      setLoading(false);
    }
  };

  const handleGenerateTitle = async () => {
    const contentText = document.getElementById('content').value;
    if (contentText) {
      setLoading(true);
      try {
        const response = await axios.post('/post/gerar-titulo', { userId, content: contentText });
        setTitle(response.data.title);
        addToast(t('title_generated_success'), 'success');
      } catch (error) {
        console.error('Error generating title:', error);
        addToast(t('title_generated_error'), 'warning');
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
        {post ? t('edit_post') : t('add_post')}
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col md="3">
            <FormGroup>
              <Label for="subject">{t('subject')}</Label>
              <InputGroup className="input-group-title">
                <Input
                  type="text"
                  name="subject"
                  id="subject"
                  placeholder={t('post_ideas')}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
                <InputGroupText>
                  <Button id="btGeraIdeias" color="warning" onClick={handleGetPostIdeas} disabled={loading}>
                    {loading ? <Spinner size="sm" /> : <i className="fa fa-bolt"></i>}
                  </Button>
                </InputGroupText>
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <textarea
                id="ideas"
                value={currentIdea}
                onChange={handleIdeaChange}
                placeholder={t('post_content_placeholder')}
                className="chakra-textarea css-ydh6re"
                rows="10"
                style={{ width: '100%' }}
              />
              <div className="d-flex justify-content-between mt-2">
                <Button
                  onClick={handlePrevIdea}
                  disabled={currentIdeaIndex === 0}
                  className="btn-sm btn-secondary"
                >
                  <span className="chakra-button__icon me-2">
                    <i className="fa-solid fa-arrow-left"></i>
                  </span>
                  {t('prev')}
                </Button>
                <Button
                  onClick={handleNextIdea}
                  disabled={currentIdeaIndex === ideas.length - 1}
                  className="btn-sm btn-secondary"
                >
                  {t('next')}
                  <span className="chakra-button__icon ms-2">
                    <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </Button>
              </div>

              <div className="mt-2">
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
                <Button color="warning" onClick={handleGeneratePost} disabled={loading}>
                  {loading ? <Spinner size="sm" /> : t('generate_post')}
                </Button>
              </div>
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label for="title">{t('title')}</Label>
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
              <textarea
                id="content"
                value={content}
                onChange={handleContentChange}
                placeholder={t('post_content_placeholder')}
                className="chakra-textarea css-ydh6re"
                rows="10"
                style={{ width: '100%' }}
              />
            </FormGroup>
            <FormGroup>
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
                  <option value="">{t('select_style')}</option>
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
        <Button color="primary" onClick={handleSave}>{post ? t('save') : t('add')}</Button>
        <Button color="success" onClick={handlePostToLinkedIn}>{t('post')}</Button>
        <Button color="secondary" onClick={toggle}>{t('cancel')}</Button>
      </ModalFooter>
      <CToaster position="top-right">
        {toasts.map((toast, index) => (
          <CToast key={`toast-${index}`} autohide={true} visible={true} color={toast.color}>
            <CToastHeader closeButton>
              <strong className="me-auto">{t('notification')}</strong>
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>
    </Modal>
  );
};

export default PostModal;
