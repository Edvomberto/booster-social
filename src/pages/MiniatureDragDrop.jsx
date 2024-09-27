import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { CImage, CCardTitle } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus } from '@coreui/icons';
import './Drag.css';

const MiniatureDragDrop = ({ carouselItems, setCarouselItems, setCurrentPageIndex, handleAddItem, handleDeleteItem, titleFont, titleFontWeight, palette }) => {
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(carouselItems);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    setCarouselItems(reorderedItems);
  };

  const handleAddItemWithLimit = () => {
    if (carouselItems.length < 7) {
      handleAddItem();
    } else {
      alert("O número máximo de páginas é 7.");
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction="vertical">
        {(provided) => (
          <div
            className="dropzone"
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              padding: '10px'
            }}
          >
            {carouselItems.map((item, index) => (
              <Draggable key={item.id} draggableId={`draggable-${item.id}`} index={index}>
                {(provided) => (
                  <div
                    className="draggable"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      width: '100px',
                      height: '130px',
                      margin: '0 10px 10px 0', // Espaçamento entre as miniaturas
                      boxSizing: 'border-box',
                      position: 'relative'
                    }}
                    onClick={() => setCurrentPageIndex(index)}
                  >
                    <div id={`carousel-item-${index}`} style={{ width: '100%', height: '130px', overflow: 'hidden', position: 'relative' }}>
                      {item.thumbnail ? (
                        <CImage src={item.thumbnail} alt={`Page ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
                      ) : (
                        <>
                          {item.imageUrl && <CImage src={item.imageUrl} alt={`Page ${index + 1}`} style={{ width: '100%', height: 'auto' }} />}
                          <CCardTitle style={{ fontFamily: titleFont, fontWeight: titleFontWeight, fontSize: '12px', color: palette[0], position: 'absolute', bottom: '20px', left: '5px', right: '5px', textAlign: 'center' }}>
                            {item.title}
                          </CCardTitle>
                        </>
                      )}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteItem(index); }}
                      className="delete-button"
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        background: 'red',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'white',
                        fontSize: '12px',
                        
                      }}
                    >
                      &times;
                    </button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <div
              className="m-2 d-flex align-items-center justify-content-center"
              style={{ width: '100px', height: '130px', border: '1px dashed #ccc', cursor: 'pointer', boxSizing: 'border-box' }}
              onClick={handleAddItemWithLimit}
            >
              <CIcon icon={cilPlus} size="xl" />
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default MiniatureDragDrop;
