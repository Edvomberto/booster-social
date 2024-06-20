// src/pages/PostGeneration.jsx
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CButton,
  CToaster,
  CToast,
  CToastBody,
  CToastHeader
} from '@coreui/react';
import PostModal from './PostModal';
import axios from '../axiosConfig';
import './PostGeneration.css';
import '@coreui/coreui/dist/css/coreui.min.css';

const initialData = {
  tasks: {},
  columns: {
    'column-0': {
      id: 'column-0',
      title: 'Ideias',
      taskIds: [],
    },
    'column-1': {
      id: 'column-1',
      title: 'Rascunho',
      taskIds: [],
    },
    'column-2': {
      id: 'column-2',
      title: 'Agendando',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Postado',
      taskIds: [],
    },
  },
  columnOrder: ['column-0', 'column-1', 'column-2', 'column-3'],
};

const truncateHtml = (html, maxLines = 2) => {
  const div = document.createElement('div');
  div.innerHTML = html;

  let truncatedHtml = '';
  let lineCount = 0;

  const nodes = div.childNodes;
  for (let i = 0; i < nodes.length && lineCount < maxLines; i++) {
    const node = nodes[i];
    const nodeText = node.textContent || node.innerText || '';
    const lines = nodeText.split(/\r?\n/);

    for (let j = 0; j < lines.length && lineCount < maxLines; j++) {
      truncatedHtml += lines[j] + '\n';
      lineCount++;
    }
  }

  if (lineCount >= maxLines) {
    truncatedHtml += '...';
  }

  return truncatedHtml;
};

function PostGeneration({ accessToken, userId }) {
  const [data, setData] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [currentColumnId, setCurrentColumnId] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, color) => {
    setToasts([...toasts, { message, color }]);
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/post/posts');
      const tasks = {};
      const columns = {
        'column-0': {
          id: 'column-0',
          title: 'Ideias',
          taskIds: [],
        },
        'column-1': {
          id: 'column-1',
          title: 'Rascunho',
          taskIds: [],
        },
        'column-2': {
          id: 'column-2',
          title: 'Agendando',
          taskIds: [],
        },
        'column-3': {
          id: 'column-3',
          title: 'Postado',
          taskIds: [],
        },
      };

      result.data.forEach(post => {
        const id = `task-${post.id}`;
        tasks[id] = { ...post, id };
        if (columns[post.columnId]) {
          columns[post.columnId].taskIds.push(id);
        }
      });

      setData({ tasks, columns, columnOrder: ['column-0', 'column-1', 'column-2', 'column-3'] });
    };

    fetchData();
  }, []);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newState);
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    const postId = draggableId.replace('task-', '');
    try {
      await axios.put(`/post/posts/${postId}`, { columnId: destination.droppableId });
      setData(newState);
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
    }
  };

  const handlePostPost = async (post) => {
    try {
      const formData = new FormData();
      formData.append('title', post.title);
      formData.append('content', post.content.replace(/\n/g, '<br>'));  // Ensure content is saved as HTML
      formData.append('columnId', currentColumnId || 'column-3'); // Default to 'Postado' if currentColumnId is not set
      if (post.image) {
        formData.append('image', post.image);
      }

      let response;
      if (currentPost) {
        response = await axios.put(`/post/posts/${currentPost.id.replace('task-', '')}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await axios.post('/post/posts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      const newPost = response.data;
      const newId = `task-${newPost.id}`;
      const newTask = {
        id: newId,
        ...newPost,
      };

      const newTasks = {
        ...data.tasks,
        [newId]: newTask,
      };

      const newTaskIds = Array.from(data.columns[currentColumnId || 'column-3'].taskIds);
      if (!currentPost) {
        newTaskIds.push(newId);
      }

      const newColumn = {
        ...data.columns[currentColumnId || 'column-3'],
        taskIds: newTaskIds,
      };

      setData({
        ...data,
        tasks: newTasks,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      });

      // Registrar a data de postagem
      await axios.post('/save-hist-post', {
        postId: newPost.id,
        datePosted: new Date(),
      });

      toggleModal();
      addToast('Post publicado!', 'success');
    } catch (error) {
      console.error('Erro ao publicar post:', error);
      addToast('Erro ao publicar post.', 'danger');
    }
  };

  const handleDeletePost = async (taskId, columnId) => {
    const postId = taskId.replace('task-', ''); // Extrair a ID do post
    try {
      await axios.delete(`/post/posts/${postId}`);
      const updatedTasks = { ...data.tasks };
      delete updatedTasks[taskId];

      const newState = {
        ...data,
        tasks: updatedTasks,
        columns: {
          ...data.columns,
          [columnId]: {
            ...data.columns[columnId],
            taskIds: data.columns[columnId].taskIds.filter((id) => id !== taskId),
          },
        },
      };
      setData(newState);
    } catch (error) {
      console.error('Erro ao excluir post:', error);
    }
  };

  const handleDuplicatePost = async (taskId, columnId) => {
    const post = data.tasks[taskId];
    try {
      const formData = new FormData();
      formData.append('title', post.title);
      formData.append('content', post.content);
      formData.append('columnId', columnId);
      if (post.image) {
        formData.append('image', post.image);
      }

      const response = await axios.post('/post/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newPost = response.data;
      const newId = `task-${newPost.id}`;
      const newTask = {
        id: newId,
        ...newPost,
      };

      const newTasks = {
        ...data.tasks,
        [newId]: newTask,
      };

      const newTaskIds = Array.from(data.columns[columnId].taskIds);
      newTaskIds.push(newId);

      const newColumn = {
        ...data.columns[columnId],
        taskIds: newTaskIds,
      };

      setData({
        ...data,
        tasks: newTasks,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      });

      addToast('Post duplicado!', 'success');
    } catch (error) {
      console.error('Erro ao duplicar post:', error);
      addToast('Erro ao duplicar post.', 'danger');
    }
  };

  const handleEditPost = (task) => {
    setCurrentPost(task);
    setCurrentColumnId(task.columnId); // Adicionar esta linha para garantir que o columnId atual seja mantido
    toggleModal();
  };

  const handleAddPostClick = (columnId) => {
    setCurrentColumnId(columnId);
    setCurrentPost(null);
    toggleModal();
  };

  return (
    <CContainer>
      <DragDropContext onDragEnd={onDragEnd}>
        <CRow className="board">
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

            return (
              <Droppable droppableId={column.id} key={column.id}>
                {(provided) => (
                  <CCol md="3">
                    <CCard className="column" {...provided.droppableProps} ref={provided.innerRef}>
                      <CCardHeader className="header-column">
                        {column.title}
                      </CCardHeader>
                      <CCardBody className="column-body">
                        {tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided) => (
                              <div
                                className="task"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => handleEditPost(task)}
                              >
                                <h5>{task.title}</h5>
                                <div dangerouslySetInnerHTML={{ __html: truncateHtml(task.content) }} />
                                {task.image && <img src={`${task.image}`} alt="Post" style={{ width: '100%' }} />}
                                <CButton
                                  color="danger"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletePost(task.id, column.id);
                                  }}
                                >
                                  Excluir
                                </CButton>
                                <CButton
                                  color="info"
                                  size="sm"
                                  className="ml-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDuplicatePost(task.id, column.id);
                                  }}
                                >
                                  Duplicar
                                </CButton>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </CCardBody>
                      <div className="add-post-footer">
                        <CButton
                          className="add-post-button"
                          onClick={() => handleAddPostClick(column.id)}
                        >
                          + Adicionar Post
                        </CButton>
                      </div>
                    </CCard>
                  </CCol>
                )}
              </Droppable>
            );
          })}
        </CRow>
      </DragDropContext>
      <PostModal
        isOpen={modalOpen}
        toggle={toggleModal}
        onSave={handlePostPost}
        onPost={handlePostPost}
        post={currentPost}
        userId={userId}
      />
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
    </CContainer>
  );
}

export default PostGeneration;
