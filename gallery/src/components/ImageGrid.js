import React, { useState } from 'react';

const ImageGrid = ({ images, onImageClick }) => {
  const [loadedImages, setLoadedImages] = useState({});

  const handleImageLoad = (id) => {
    setLoadedImages(prevState => ({ ...prevState, [id]: true }));
  };

  return (
    <div className="image-grid">
      {images.map((image, index) => (
        <div key={image.id} className="image-container">
          {!loadedImages[image.id] && <div className="image-placeholder">Loading...</div>}
          <img
            src={image.thumbnailUrl}
            alt={`Image ${index + 1}`}
            onClick={() => onImageClick(image)}
            className={`image-item ${loadedImages[image.id] ? 'loaded' : ''}`}
            onLoad={() => handleImageLoad(image.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
