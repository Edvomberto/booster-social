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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction="horizontal">
        {(provided) => (
          <div
            className="dropzone"
            {...provided.droppableProps}
            ref={provided.innerRef}
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
                    }}
                    onClick={() => setCurrentPageIndex(index)}
                  >
                    <div id={`carousel-item-${index}`} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
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
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteItem(index); }}
                      className="delete-button"
                    >
                      &times;
                    </button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <div className="m-2 d-flex align-items-center justify-content-center" style={{ paddingTop:'10px', marginTop: '15px', width: '100px', height: '130px', border: '1px dashed #ccc', cursor: 'pointer' }} onClick={handleAddItem}>
              <CIcon icon={cilPlus} size="xl" />
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default MiniatureDragDrop;
