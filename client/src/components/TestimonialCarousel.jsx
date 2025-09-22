import { useState, useEffect, useRef } from 'react';
import { LeftOutlined, RightOutlined, StarFilled, PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';

export default function TestimonialCarousel({ testimonials = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef(null);
  const containerRef = useRef(null);

  // Safety check for testimonials
  if (!testimonials || !Array.isArray(testimonials) || testimonials.length === 0) {
    return (
      <div className="text-center">
        <p>No testimonials available.</p>
      </div>
    );
  }

  // Calculate if we need carousel controls
  const needsCarousel = testimonials.length > 3;
  const totalSlides = Math.max(0, testimonials.length - 2); // Show 3 at a time

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && needsCarousel && !isPaused) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex >= totalSlides - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, needsCarousel, isPaused, totalSlides]);

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    if (isAutoPlaying) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (isAutoPlaying) {
      setIsPaused(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex >= totalSlides - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
    setIsPaused(false);
  };

  const visibleTestimonials = needsCarousel 
    ? testimonials.slice(currentIndex, currentIndex + 3)
    : testimonials;

  return (
    <div 
      className="testimonial-carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Auto-play controls */}
      {needsCarousel && (
        <div className="carousel-controls">
          <button 
            className="autoplay-toggle"
            onClick={toggleAutoPlay}
            aria-label={isAutoPlaying ? 'Pause auto-play' : 'Start auto-play'}
          >
            {isAutoPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          </button>
        </div>
      )}

      {/* Navigation arrows - only show if needed */}
      {needsCarousel && (
        <>
          <button 
            className="carousel-nav carousel-nav-prev" 
            onClick={prevSlide}
            aria-label="Previous testimonials"
          >
            <span>‹</span>
          </button>

          <button 
            className="carousel-nav carousel-nav-next" 
            onClick={nextSlide}
            aria-label="Next testimonials"
          >
            <span>›</span>
          </button>
        </>
      )}

      {/* Testimonials container */}
      <div className="carousel-container" ref={containerRef}>
        <div className="carousel-track">
          {visibleTestimonials.map((testimonial, index) => (
            <div 
              key={testimonial._id} 
              className="carousel-slide"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="testimonial-card">
            <div className="testimonial-header">
              <div className="testimonial-avatar">
                                 {testimonial.avatar?.url ? (
                   <img src={testimonial.avatar.url} alt={testimonial.name || 'Client'} />
                 ) : (
                   <div className="avatar-placeholder">
                     {(testimonial.name || 'A').charAt(0).toUpperCase()}
                   </div>
                 )}
              </div>
              <div className="testimonial-info">
                                   <h4 className="testimonial-name">{testimonial.name || 'Client'}</h4>
                   <p className="testimonial-title">{testimonial.position || 'Customer'}</p>
                   <p className="testimonial-company">{testimonial.company || 'Client Company'}</p>
              </div>
            </div>
            
            <div className="testimonial-rating">
              {[...Array(5)].map((_, i) => (
                <StarFilled 
                  key={i} 
                  className={i < (testimonial.rating || 5) ? 'star-filled' : 'star-empty'} 
                />
              ))}
            </div>
            
            <div className="testimonial-content">
                             <p className="testimonial-text">
                 "{testimonial.content || 'Great service and professional team!'}"
               </p>
            </div>
            
            {testimonial.featured && (
              <div className="testimonial-service">
                <span className="service-tag">Featured</span>
              </div>
            )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress indicators */}
      {needsCarousel && (
        <div className="carousel-indicators">
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
