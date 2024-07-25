import React, { useState, useEffect, useRef } from 'react';
import ImageGrid from './components/ImageGrid';
import ImageModal from './components/ImageModal';
import './App.css';

const App = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [initialLoadCount, setInitialLoadCount] = useState(0);
  const [loadMoreCount] = useState(40); // Defina um número maior para carregar ao rolar a página
  const [infiniteScrollEnabled, setInfiniteScrollEnabled] = useState(false);
  const loadedImageIds = useRef(new Set());

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const fetchImages = async (initial = false) => {
    const limit = initial ? calculateInitialLoad() : loadMoreCount;
    const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`);
    const data = await response.json();
    const newImages = data
      .filter(img => !loadedImageIds.current.has(img.id))
      .map(img => {
        loadedImageIds.current.add(img.id);
        return {
          id: img.id,
          thumbnailUrl: `https://picsum.photos/id/${img.id}/150/150`,
          originalUrl: `https://picsum.photos/id/${img.id}/800/600`
        };
      });
    setImages(prevImages => [...prevImages, ...shuffleArray(newImages)]);
  };

  const calculateInitialLoad = () => {
    const windowHeight = window.innerHeight;
    const imageHeight = 150; // altura da imagem
    const imagesPerColumn = Math.ceil(windowHeight / imageHeight);
    const columns = getNumberOfColumns();
    const initialCount = imagesPerColumn * columns;
    setInitialLoadCount(initialCount);
    return initialCount;
  };

  const getNumberOfColumns = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth >= 1200) return 5;
    if (windowWidth >= 992) return 4;
    if (windowWidth >= 768) return 3;
    if (windowWidth >= 576) return 2;
    return 1;
  };

  useEffect(() => {
    fetchImages(true);
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchImages();
    }
  }, [page]);

  useEffect(() => {
    if (infiniteScrollEnabled) {
      const handleScroll = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const scrollBottom = windowHeight + scrollTop;

        if (scrollBottom >= documentHeight - 50) {
          setPage(prevPage => prevPage + 1);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [infiniteScrollEnabled]);

  const handleLoadMore = () => {
    setInfiniteScrollEnabled(true);
    setPage(prevPage => prevPage + 1);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image.originalUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="App">
      <header>
        <h1>Photo Gallery</h1>
      </header>
      <body>
        <div className="image-wrapper">
          <ImageGrid images={images} onImageClick={handleImageClick} />
          {!infiniteScrollEnabled && (
            <button className="load-more" onClick={handleLoadMore}>Load More</button>
          )}
         </div>
        {selectedImage && <ImageModal image={selectedImage} onClose={handleCloseModal} />}
      </body>
      <footer className="footer">
        <p>&copy; 2024 Photo Gallery. Images provided by <a href="https://picsum.photos" target="_blank" rel="noopener noreferrer">Lorem Picsum</a>.</p>
      </footer>
    </div>
  );
};

export default App;
