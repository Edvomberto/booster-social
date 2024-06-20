import React, { useState, useEffect, useCallback } from 'react';
import {
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CModal, CModalHeader, CModalTitle,
  CModalBody, CModalFooter, CToast, CToastHeader, CToastBody, CToaster, CForm, CFormLabel, CFormInput
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilTrash, cilPen, cilPlus } from '@coreui/icons';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const PromptsList = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState(null);
  const [editPrompt, setEditPrompt] = useState(null);
  const [promptText, setPromptText] = useState('');
  const [action, setAction] = useState('');
  const [toasts, setToasts] = useState([]);

  const fetchPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/prompt/prompts');
      setPrompts(response.data);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const handleSave = async () => {
    try {
      if (editPrompt) {
        await axios.put(`/prompt/prompts/${editPrompt.id}`, { promptText, action });
        setToasts([...toasts, { message: 'Prompt updated successfully', color: 'success' }]);
      } else {
        await axios.post('/prompt/prompts', { promptText, action });
        setToasts([...toasts, { message: 'Prompt created successfully', color: 'success' }]);
      }
      fetchPrompts();
      setShowModal(false);
      setPromptText('');
      setAction('');
      setEditPrompt(null);
    } catch (error) {
      console.error('Error saving prompt:', error);
      setToasts([...toasts, { message: 'Error saving prompt', color: 'danger' }]);
    }
  };

  const handleDeleteConfirmation = (id) => {
    setPromptToDelete(id);
    setShowDeleteConfirmation(true);
  };

  const confirmDeletePrompt = async () => {
    try {
      await axios.delete(`/prompt/prompts/${promptToDelete}`);
      fetchPrompts();
      setPromptToDelete(null);
      setShowDeleteConfirmation(false);
      setToasts([...toasts, { message: 'Prompt deleted successfully', color: 'success' }]);
    } catch (error) {
      console.error('Error deleting prompt:', error);
      setToasts([...toasts, { message: 'Error deleting prompt', color: 'danger' }]);
    }
  };

  const cancelDeletePrompt = () => {
    setPromptToDelete(null);
    setShowDeleteConfirmation(false);
  };

  const openEditModal = (prompt) => {
    setEditPrompt(prompt);
    setPromptText(prompt.promptText);
    setAction(prompt.action);
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditPrompt(null);
    setPromptText('');
    setAction('');
    setShowModal(true);
  };

  return (
    <div className="table-container p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Lista de Prompts</h3>
        <CButton color="primary" onClick={openCreateModal}>
          <CIcon icon={cilPlus} /> Adicionar Prompt
        </CButton>
      </div>
      <CTable striped hover responsive>
        <CTableHead className="table-header">
          <CTableRow>
            <CTableHeaderCell scope="col" className="align-content-center text-center">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            <CTableHeaderCell scope="col">Prompt Text</CTableHeaderCell>
            <CTableHeaderCell scope="col" className="align-content-center text-center">Editar</CTableHeaderCell>
            <CTableHeaderCell scope="col" className="align-content-center text-center">Deletar</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {prompts.map((prompt, index) => (
            <CTableRow key={prompt.id} className="table-row">
              <CTableHeaderCell scope="row" className="align-content-center text-center">{index + 1}</CTableHeaderCell>
              <CTableDataCell>{prompt.action}</CTableDataCell>

              <CTableDataCell>{prompt.promptText}</CTableDataCell>
              <CTableDataCell className="align-content-center text-center">
                <CButton onClick={() => openEditModal(prompt)} color="info" className="action-button">
                  <CIcon icon={cilPen} className="text-light" />
                </CButton>
              </CTableDataCell>
              <CTableDataCell className="align-content-center text-center">
                <CButton onClick={() => handleDeleteConfirmation(prompt.id)} color="danger" className="action-button">
                  <CIcon icon={cilTrash} className="text-light" />
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>{editPrompt ? 'Editar Prompt' : 'Adicionar Prompt'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel htmlFor="action">Action</CFormLabel>
              <CFormInput
                id="action"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                placeholder="Enter action"
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="promptText">Prompt Text</CFormLabel>
              <ReactQuill
                id="promptText"
                value={promptText}
                onChange={setPromptText}
                placeholder="Enter prompt text"
                modules={{
                  toolbar: [
                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['bold', 'italic', 'underline'],
                    ['link', 'image'],
                    ['clean']
                  ],
                }}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleSave}>
            {editPrompt ? 'Salvar' : 'Adicionar'}
          </CButton>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </CButton>
        </CModalFooter>
      </CModal>

      {showDeleteConfirmation && (
        <CModal visible={showDeleteConfirmation} onClose={cancelDeletePrompt} size="sm">
          <CModalHeader closeButton>
            <CModalTitle className="text-danger">Confirmação de Exclusão</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p>Tem certeza de que deseja excluir este prompt?</p>
          </CModalBody>
          <CModalFooter className="d-flex justify-content-between">
            <CButton color="danger" onClick={confirmDeletePrompt}>
              Excluir
            </CButton>
            <CButton color="secondary" onClick={cancelDeletePrompt}>
              Cancelar
            </CButton>
          </CModalFooter>
        </CModal>
      )}

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
    </div>
  );
};

export default PromptsList;
