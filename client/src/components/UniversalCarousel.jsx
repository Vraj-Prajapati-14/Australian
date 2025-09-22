import React, { useState, useEffect } from 'react';
import '../styles/carousel.css';

const UniversalCarousel = ({
  items = [],
  itemsPerSlide = 1,
  showNavigation = true,
  showIndicators = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  className = '',
  carouselType = 'default', // 'default', 'testimonial', 'gallery', 'project'
  renderItem = null,
  loading = false,
  emptyMessage = 'No items to display',
  ...props
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(itemsPerSlide);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  // Update slides to show based on screen size and itemsPerSlide
  useEffect(() => {
    const updateSlidesToShow = () => {
      const width = window.innerWidth;
      let newSlidesToShow = itemsPerSlide;

      if (width < 481) {
        newSlidesToShow = 1; // Always 1 on mobile
      } else if (width < 769) {
        newSlidesToShow = Math.min(2, itemsPerSlide);
      } else if (width < 1025) {
        newSlidesToShow = Math.min(3, itemsPerSlide);
      } else {
        newSlidesToShow = itemsPerSlide;
      }

      setSlidesToShow(newSlidesToShow);
    };

    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, [itemsPerSlide]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || items.length <= slidesToShow) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % Math.max(1, items.length - slidesToShow + 1));
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, items.length, slidesToShow, autoPlayInterval]);

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    if (autoPlay) setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    if (autoPlay) setIsAutoPlaying(true);
  };

  const totalSlides = Math.max(1, items.length - slidesToShow + 1);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Loading state
  if (loading) {
    return (
      <div className={`universal-carousel ${className}`} {...props}>
        <div className="carousel-loading">
          <div className="carousel-loading-track">
            {[...Array(slidesToShow)].map((_, index) => (
              <div key={index} className="loading-card">
                <div className="loading-image"></div>
                <div className="loading-content">
                  <div className="loading-title"></div>
                  <div className="loading-description"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!items || items.length === 0) {
    return (
      <div className={`universal-carousel ${className}`} {...props}>
        <div className="carousel-container">
          <div className="carousel-empty">
            <p>{emptyMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  // Single item or less than slidesToShow - show as grid
  if (items.length <= slidesToShow) {
    return (
      <div className={`universal-carousel ${className}`} {...props}>
        <div className="carousel-container">
          <div className="carousel-track" style={{ transform: 'none', gap: '16px' }}>
            {items.map((item, index) => (
              <div key={item._id || item.id || index} className="carousel-slide">
                {renderItem ? renderItem(item, index) : (
                  <div className={`carousel-item ${carouselType}-item`}>
                    {item.image && (
                      <div className="carousel-image">
                        <img 
                          src={item.image.url || item.image} 
                          alt={item.image.alt || item.title || item.name}
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="carousel-content">
                      <h3 className="carousel-title">{item.title || item.name}</h3>
                      <p className="carousel-description">{item.description}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Carousel with navigation
  return (
    <div 
      className={`universal-carousel carousel-${itemsPerSlide}-items ${carouselType}-carousel ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {showNavigation && (
        <>
          <button 
            className="carousel-nav carousel-nav-prev" 
            onClick={prevSlide}
            aria-label="Previous slide"
            disabled={totalSlides <= 1}
          >
            <span>‹</span>
          </button>
          
          <button 
            className="carousel-nav carousel-nav-next" 
            onClick={nextSlide}
            aria-label="Next slide"
            disabled={totalSlides <= 1}
          >
            <span>›</span>
          </button>
        </>
      )}
      
      <div className="carousel-container">
        <div 
          className="carousel-track"
          style={{
            transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)`,
            width: `${(items.length / slidesToShow) * 100}%`
          }}
        >
          {Array.from({ length: totalSlides }, (_, slideIndex) => (
            <div key={slideIndex} className="carousel-slide">
              <div className="carousel-slide-content" style={{ display: 'flex', gap: '16px' }}>
                {items.slice(slideIndex * slidesToShow, slideIndex * slidesToShow + slidesToShow).map((item, index) => (
                  <div key={item._id || item.id || index} style={{ flex: `0 0 ${100 / slidesToShow}%` }}>
                    {renderItem ? renderItem(item, index) : (
                      <div className={`carousel-item ${carouselType}-item`}>
                        {item.image && (
                          <div className="carousel-image">
                            <img 
                              src={item.image.url || item.image} 
                              alt={item.image.alt || item.title || item.name}
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="carousel-content">
                          <h3 className="carousel-title">{item.title || item.name}</h3>
                          <p className="carousel-description">{item.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showIndicators && totalSlides > 1 && (
        <div className="carousel-indicators">
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${currentSlide === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UniversalCarousel;
