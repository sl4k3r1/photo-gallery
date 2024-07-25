import React from 'react';

const ImageModal = ({ image, onClose }) => {
  return (
    <div className="image-modal" onClick={onClose}>
      <span className="close">&times;</span>
      <img src={image} alt="Large view" className="modal-content" />
    </div>
  );
};

export default ImageModal;
