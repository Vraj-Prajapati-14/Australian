import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Container, Section, Button, Card, Badge, Alert } from '../components/ui';
import UniversalCarousel from '../components/UniversalCarousel';

// Inspiration Gallery Component for Homepage
const InspirationGallery = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [slidesToShow, setSlidesToShow] = React.useState(3);

  const { data: inspirationItems = [], isLoading, error } = useQuery({
    queryKey: ['inspiration-featured'],
    queryFn: async () => {
      const response = await api.get('/inspiration/published?limit=12');
      return response.data?.data || [];
    }
  });

  // Only use real inspiration items from database
  const displayItems = inspirationItems;

  // Debug logging
  console.log('Inspiration items:', inspirationItems);
  console.log('Display items:', displayItems);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

  // Update slides to show based on screen size
  React.useEffect(() => {
    const updateSlidesToShow = () => {
      if (window.innerWidth < 480) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 768) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, []);

  const totalSlides = Math.max(0, displayItems.length - slidesToShow + 1);

  const nextSlide = () => {
    setCurrentSlide(prev => prev < totalSlides - 1 ? prev + 1 : 0);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => prev > 0 ? prev - 1 : totalSlides - 1);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (isLoading) {
    return (
      <div className="inspiration-loading">
        <div className="loading-carousel">
          <div className="loading-carousel-track">
            {[...Array(3)].map((_, index) => (
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

  // Show carousel if more than 3 items, otherwise show centered grid
  if (displayItems.length > 3) {
    return (
      <div className="inspiration-gallery">
        <div className="inspiration-carousel">
          <button className="carousel-nav carousel-nav-prev" onClick={prevSlide}>
            <span>‹</span>
          </button>
          
          <div className="carousel-container">
            <div 
              className="carousel-track"
              style={{
                transform: `translateX(-${currentSlide * (100 / 3)}%)`,
                width: `${(displayItems.length / 3) * 100}%`
              }}
            >
              {Array.from({ length: totalSlides }, (_, slideIndex) => (
                <div key={slideIndex} className="carousel-slide">
                  <div className="carousel-slide-content" style={{ display: 'flex', gap: '16px' }}>
                    {displayItems.slice(slideIndex * 3, slideIndex * 3 + 3).map((item, index) => (
                      <div key={item._id} style={{ flex: '0 0 33.333%' }}>
                        <div className="inspiration-item">
                          <div className="inspiration-image">
                            {item.image?.url ? (
                              <img 
                                src={item.image.url} 
                                alt={item.image.alt || item.title}
                                loading="lazy"
                              />
                            ) : (
                              <div className="placeholder-image">
                                <span>⚙️</span>
                              </div>
                            )}
                            <div className="inspiration-overlay">
                              <div className="overlay-content">
                                <h4 className="overlay-title">{item.title}</h4>
                                {item.service && (
                                  <Badge variant="primary" className="service-badge">
                                    {item.service.title}
                                  </Badge>
                                )}
                                <div className="overlay-description">
                                  <p>Precision Engineering Excellence</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="inspiration-content">
                            <h3 className="inspiration-title">{item.title}</h3>
                            <p className="inspiration-description">{item.description}</p>
                            {item.tags && item.tags.length > 0 && (
                              <div className="inspiration-tags">
                                {item.tags.slice(0, 2).map((tag, tagIndex) => (
                                  <span key={tagIndex} className="tag">{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="carousel-nav carousel-nav-next" onClick={nextSlide}>
            <span>›</span>
          </button>
        </div>

        <div className="carousel-indicators">
          {Array.from({ length: Math.max(1, totalSlides) }, (_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${currentSlide === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    );
  }

  // Show centered grid for 3 or fewer items
  return (
    <div className="inspiration-gallery">
      <div className={`carousel-grid ${displayItems.length === 1 ? 'single-item' : displayItems.length === 2 ? 'two-items' : 'three-items'}`}>
        {displayItems.map((item, index) => (
          <div key={item._id} className="inspiration-item">
            <div className="inspiration-image">
              {item.image?.url ? (
                <img 
                  src={item.image.url} 
                  alt={item.image.alt || item.title}
                  loading="lazy"
                />
              ) : (
                <div className="placeholder-image">
                  <span>⚙️</span>
                </div>
              )}
              <div className="inspiration-overlay">
                <div className="overlay-content">
                  <h4 className="overlay-title">{item.title}</h4>
                  {item.service && (
                    <Badge variant="primary" className="service-badge">
                      {item.service.title}
                    </Badge>
                  )}
                  <div className="overlay-description">
                    <p>Precision Engineering Excellence</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="inspiration-content">
              <h3 className="inspiration-title">{item.title}</h3>
              <p className="inspiration-description">{item.description}</p>
              {item.tags && item.tags.length > 0 && (
                <div className="inspiration-tags">
                  {item.tags.slice(0, 2).map((tag, tagIndex) => (
                    <span key={tagIndex} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Testimonials Carousel Component
const TestimonialsCarousel = ({ testimonials = [] }) => {
  // Only use real testimonials from database - memoize to prevent unnecessary re-renders
  const displayTestimonials = React.useMemo(() => 
    Array.isArray(testimonials) ? testimonials : [], 
    [testimonials]
  );

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);
  const [itemsPerSlide, setItemsPerSlide] = React.useState(3);
  const [progress, setProgress] = React.useState(0);

  // Calculate items per slide based on screen size
  React.useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth < 768) {
        setItemsPerSlide(1); // 1 item per slide on mobile
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(2); // 2 items per slide on tablet
      } else {
        setItemsPerSlide(3); // 3 items per slide on desktop
      }
    };

    updateItemsPerSlide();
    window.addEventListener('resize', updateItemsPerSlide);
    return () => window.removeEventListener('resize', updateItemsPerSlide);
  }, []);

  // Auto-swipe functionality
  React.useEffect(() => {
    if (!isAutoPlaying || displayTestimonials.length <= itemsPerSlide || displayTestimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const maxSlides = Math.ceil(displayTestimonials.length / itemsPerSlide);
        if (maxSlides <= 1) return prev; // Prevent infinite loop if only one slide
        return (prev + 1) % maxSlides;
      });
    }, 4000); // Auto-swipe every 4 seconds for better engagement

    return () => clearInterval(interval);
  }, [isAutoPlaying, displayTestimonials.length, itemsPerSlide]);

  // Update progress bar
  React.useEffect(() => {
    if (!isAutoPlaying || displayTestimonials.length <= itemsPerSlide || displayTestimonials.length === 0) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setProgress(0);
          return 0;
        }
        return prev + (100 / 40); // 4 seconds = 40 * 0.1s intervals
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [isAutoPlaying, displayTestimonials.length, itemsPerSlide]);

  // Reset progress when slide changes
  React.useEffect(() => {
    setProgress(0);
  }, [currentSlide]);

  // Calculate total slides
  const totalSlides = Math.ceil(displayTestimonials.length / itemsPerSlide);

  // Event handlers
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const nextSlide = () => {
    if (totalSlides <= 1) return; // Prevent navigation if only one slide
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    if (totalSlides <= 1) return; // Prevent navigation if only one slide
    setCurrentSlide((prev) => 
      prev === 0 ? totalSlides - 1 : prev - 1
    );
  };

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  // Debug logging to see what data we're getting (only when testimonials change)
  React.useEffect(() => {
    console.log('Testimonials received:', testimonials);
    console.log('Testimonials type:', typeof testimonials);
    console.log('Testimonials length:', testimonials?.length);
  }, [testimonials]);

  // If no testimonials, show empty state
  if (displayTestimonials.length === 0) {
    return (
      <div className="testimonials-empty">
        <p>No testimonials available at the moment.</p>
      </div>
    );
  }

  // Show carousel for more than 3 testimonials, otherwise show centered grid
  if (displayTestimonials.length > 3) {
    return (
      <div 
        className="testimonial-carousel"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Left Arrow */}
        <button className="carousel-nav carousel-nav-prev" onClick={prevSlide}>
          <span>‹</span>
        </button>
        
        <div className="carousel-container">
          <div 
            className="carousel-track"
            style={{
              transform: `translateX(-${currentSlide * (100 / itemsPerSlide)}%)`,
              width: `${(displayTestimonials.length / itemsPerSlide) * 100}%`
            }}
          >
            {Array.from({ length: totalSlides }, (_, slideIndex) => (
              <div key={slideIndex} className="carousel-slide">
                <div className="carousel-slide-content" style={{ display: 'flex', gap: '16px' }}>
                  {displayTestimonials.slice(slideIndex * itemsPerSlide, slideIndex * itemsPerSlide + itemsPerSlide).map((testimonial, index) => (
                    <div key={testimonial._id} style={{ flex: `0 0 ${100 / itemsPerSlide}%` }}>
                      <div className="testimonial-card">
                        <div className="testimonial-content">
                          <div className="testimonial-rating">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`star ${i < (testimonial.rating || 5) ? 'filled' : ''}`}>
                                ★
                              </span>
                            ))}
                          </div>
                          <div className="quote-icon">"</div>
                          <p className="testimonial-text">"{testimonial.content}"</p>
                          <div className="testimonial-author">
                            <div className="author-avatar">
                              {testimonial.avatar?.url ? (
                                <img src={testimonial.avatar.url} alt={testimonial.name} />
                              ) : (
                                <div className="avatar-placeholder">
                                  {testimonial.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="author-info">
                              <h4 className="author-name">{testimonial.name}</h4>
                              <p className="author-position">{testimonial.position}</p>
                              <p className="author-company">{testimonial.company}</p>
                            </div>
                          </div>
                          <div className="testimonial-tags">
                            {testimonial.tags?.map((tag, tagIndex) => (
                              <span key={tagIndex} className="tag">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button className="carousel-nav carousel-nav-next" onClick={nextSlide}>
          <span>›</span>
        </button>

        {/* Progress Bar for Auto-scroll */}
        {displayTestimonials.length > itemsPerSlide && (
          <div className="carousel-progress">
            <div 
              className="progress-bar" 
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="carousel-indicators">
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${currentSlide === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    );
  }

  // Show centered grid for 3 or fewer testimonials
  return (
    <div className={`carousel-grid ${displayTestimonials.length === 1 ? 'single-item' : displayTestimonials.length === 2 ? 'two-items' : 'three-items'}`}>
      {displayTestimonials.map((testimonial, index) => (
        <div key={testimonial._id} className="testimonial-card">
          <div className="testimonial-content">
            <div className="testimonial-rating">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`star ${i < (testimonial.rating || 5) ? 'filled' : ''}`}>
                  ★
                </span>
              ))}
            </div>
            <div className="quote-icon">"</div>
            <p className="testimonial-text">"{testimonial.content}"</p>
            <div className="testimonial-author">
              <div className="author-avatar">
                {testimonial.avatar?.url ? (
                  <img src={testimonial.avatar.url} alt={testimonial.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="author-info">
                <h4 className="author-name">{testimonial.name}</h4>
                <p className="author-position">{testimonial.position}</p>
                <p className="author-company">{testimonial.company}</p>
              </div>
            </div>
            <div className="testimonial-tags">
              {testimonial.tags?.map((tag, tagIndex) => (
                <span key={tagIndex} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const HomePage = () => {
  // Fetch settings data
  const { data: settings = {} } = useQuery({ 
    queryKey: ['settings'], 
    queryFn: async () => {
      const response = await api.get('/settings');
      return response.data || {};
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });



  // Fetch testimonials
  const { data: testimonialsResponse = { data: [] } } = useQuery({ 
    queryKey: ['testimonials'], 
    queryFn: async () => {
      try {
        const response = await api.get('/testimonials/public?limit=6');
        console.log('Testimonials API response:', response);
        return response.data || { data: [] };
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        return { data: [] };
      }
    }
  });

  // Extract testimonials from response
  const testimonials = testimonialsResponse?.data || [];



  // Fetch team members
  const { data: teamMembers = [] } = useQuery({ 
    queryKey: ['teamMembers'], 
    queryFn: async () => (await api.get('/team?featured=true&limit=4')).data || []
  });

  // Fetch featured services
  const { data: featuredServices = [] } = useQuery({ 
    queryKey: ['featuredServices'], 
    queryFn: async () => {
      try {
        const response = await api.get('/services?featured=true&limit=4');
        return response.data?.data || [];
      } catch (error) {
        console.error('Error fetching featured services:', error);
        return [];
      }
    }
  });

  // Fetch featured projects
  const { data: featuredProjects = [] } = useQuery({ 
    queryKey: ['featuredProjects'], 
    queryFn: async () => {
      try {
        const response = await api.get('/projects?featured=true&limit=4');
        return response.data?.data || [];
      } catch (error) {
        console.error('Error fetching featured projects:', error);
        return [];
      }
    }
  });

  // Extract settings data
  const general = settings.general || {};
  const appearance = settings.appearance || {};
  const contact = settings.contact || {};

  // Static data fallbacks
  const staticStats = [
    { number: '500+', label: 'Projects Completed' },
    { number: '50+', label: 'Team Members' },
    { number: '10+', label: 'Years Experience' },
    { number: '98%', label: 'Client Satisfaction' }
  ];



  return (
    <>
      <Helmet>
        <title>{general.siteName || 'Australian Engineering Solutions'}</title>
        <meta name="description" content={general.siteDescription || 'Professional vehicle modifications and engineering solutions'} />
      </Helmet>

      {/* Hero Section - Exact replica of website */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-badge">
              {general.heroBadge || 'AU Leading Australian Mechanical Services'}
            </div>
            <h1 className="hero-title">
              {general.heroTitle || 'Professional'} <span className="hero-title-highlight">{general.heroTitleHighlight || 'Mechanical Services'}</span> {general.heroTitleSuffix || 'You Can Trust'}
            </h1>
            <p className="hero-subtitle">
              {general.heroSubtitle || '30+ years of experience delivering exceptional mechanical solutions across Australia. From complex industrial projects to precision maintenance services.'}
            </p>

            {/* Call to Action Buttons */}
            <div className="hero-buttons">
              <button className="hero-cta-primary">
                {general.primaryCTA || 'Start Your Project'} <span className="arrow-icon">→</span>
              </button>
              <button className="hero-cta-secondary">
                <span className="play-icon-small">▶</span> {general.secondaryCTA || 'Watch Demo'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{general.projectsCompleted || '500+'}</div>
              <div className="stat-label">PROJECTS COMPLETED</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{general.teamSize || '50+'}</div>
              <div className="stat-label">TEAM MEMBERS</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{general.yearsExperience || '10+'}</div>
              <div className="stat-label">YEARS EXPERIENCE</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{general.clientSatisfaction || '98%'}</div>
              <div className="stat-label">CLIENT SATISFACTION</div>
            </div>
          </div>
      </section>

      {/* What We Offer Section */}
      <section className="what-we-offer-section">
        <div className="section-header">
          <h2 className="section-title">What We Offer</h2>
          <p className="section-subtitle">
            Professional engineering solutions designed to accelerate your business growth
          </p>
        </div>
        
        <div className="offer-content-grid">
            <div className="offer-item">
              <div className="offer-icon engineering"></div>
              <h3 className="offer-title">Mechanical Design & Engineering</h3>
              <p className="offer-description">
                Our mechanical design and engineering services deliver precision-engineered solutions. From sheet metal design to complete product development, we handle reverse engineering, product re-design, and provide comprehensive DFM & DFMA drawings that ensure manufacturability and cost-effectiveness for your projects.
              </p>
            </div>
            
            <div className="offer-item">
              <div className="offer-icon building"></div>
              <h3 className="offer-title">HVAC & Building Systems</h3>
              <p className="offer-description">
                We specialize in HVAC design and drafting services that optimize building performance and energy efficiency. Our BIM services provide comprehensive building information modeling, enabling better collaboration, reduced errors, and streamlined construction processes for complex building systems.
              </p>
            </div>
            
            <div className="offer-item">
              <div className="offer-icon analysis"></div>
              <h3 className="offer-title">Simulation & Analysis</h3>
              <p className="offer-description">
                Through advanced Finite Element Analysis (FEA), we ensure structural integrity and optimize performance before manufacturing. Our simulation services help identify potential issues early, reduce prototyping costs, and guarantee that your products meet the highest safety and performance standards.
              </p>
            </div>
            
            <div className="offer-item">
              <div className="offer-icon prototype"></div>
              <h3 className="offer-title">Prototyping & Visualization</h3>
              <p className="offer-description">
                Transform your concepts into reality with our custom 3D prototyping services. We provide detailed 3D rendering and visualization that helps you visualize the final product, make informed design decisions, and present compelling proposals to stakeholders and clients.
              </p>
            </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners-section">
        <div className="partners-header">
          <h2 className="partners-title">TRUSTED BY LEADING COMPANIES & TRADE BUSINESSES</h2>
        </div>
        
        <div className="partners-grid">
          <div className="partner-logo">
            <div className="logo-placeholder">AGL</div>
          </div>
          <div className="partner-logo">
            <div className="logo-placeholder">COLES</div>
          </div>
          <div className="partner-logo">
            <div className="logo-placeholder">AUSPOST</div>
          </div>
          <div className="partner-logo">
            <div className="logo-placeholder">TELSTRA</div>
          </div>
          <div className="partner-logo">
            <div className="logo-placeholder">BHP</div>
          </div>
          <div className="partner-logo">
            <div className="logo-placeholder">QANTAS</div>
          </div>
          <div className="partner-logo">
            <div className="logo-placeholder">WOOLWORTHS</div>
          </div>
          <div className="partner-logo">
            <div className="logo-placeholder">SANTOS</div>
          </div>
          <div className="partner-logo">
            <div className="logo-placeholder">BUNNINGS</div>
          </div>
          <div className="partner-logo">
            <div className="logo-placeholder">HARVEY NORMAN</div>
          </div>
          <div className="partner-logo">
            <div className="logo-placeholder">TOYOTA</div>
          </div>
          <div className="partner-logo">
            <div className="logo-placeholder">FORD</div>
          </div>
          <div className="partner-logo">
            <div className="logo-placeholder">CATERPILLAR</div>
          </div>
          <div className="partner-logo">
            <div className="logo-placeholder">JOHN DEERE</div>
          </div>
          <div className="partner-logo">
            <div className="logo-placeholder">KOMATSU</div>
          </div>
          <div className="partner-logo">
            <div className="logo-placeholder">HITACHI</div>
          </div>
        </div>
      </section>

      {/* Inspiration Gallery Section */}
      <section className="inspiration-section">
        <div className="inspiration-layout">
          <div className="inspiration-text">
            <h2 className="inspiration-main-title">INSPIRATION GALLERY</h2>
            <p className="inspiration-description">
              Explore our cutting-edge mechanical engineering solutions, innovative designs, and precision manufacturing projects that drive industry excellence
            </p>
          </div>
          
          <div className="inspiration-images-grid">
            <InspirationGallery />
          </div>
        </div>
      </section>

      {/* Our Commitments Section */}
      <section className="commitment-section">
        <div className="commitment-container">
          <div className="commitment-header">
            <h2 className="commitment-title">Our Commitments</h2>
            <p className="commitment-subtitle">
              We deliver exceptional results through our proven methodology, experienced team, and commitment to excellence.
            </p>
          </div>
          
          <div className="commitment-grid">
            <div className="commitment-card">
              <div className="commitment-icon">
                <div className="icon-wrapper quality">
                  <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                    <path d="M19 15L19.74 12.26L23 12L19.74 11.74L19 9L18.26 11.74L15 12L18.26 12.26L19 15Z" fill="currentColor"/>
                    <path d="M5 15L5.74 12.26L9 12L5.74 11.74L5 9L4.26 11.74L1 12L4.26 12.26L5 15Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              <div className="commitment-content">
                <h3 className="commitment-card-title">Precision Engineering</h3>
                <p className="commitment-description">
                  Meticulous attention to detail in every mechanical design, ensuring accuracy and reliability in all our engineering solutions.
                </p>
              </div>
            </div>

            <div className="commitment-card">
              <div className="commitment-icon">
                <div className="icon-wrapper innovation">
                  <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                    <path d="M19 15L19.74 12.26L23 12L19.74 11.74L19 9L18.26 11.74L15 12L18.26 12.26L19 15Z" fill="currentColor"/>
                    <path d="M5 15L5.74 12.26L9 12L5.74 11.74L5 9L4.26 11.74L1 12L4.26 12.26L5 15Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              <div className="commitment-content">
                <h3 className="commitment-card-title">Innovation & Technology</h3>
                <p className="commitment-description">
                  Cutting-edge mechanical solutions incorporating the latest technologies and innovative approaches to complex engineering challenges.
                </p>
              </div>
            </div>

            <div className="commitment-card">
              <div className="commitment-icon">
                <div className="icon-wrapper reliability">
                  <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="commitment-content">
                <h3 className="commitment-card-title">Quality Assurance</h3>
                <p className="commitment-description">
                  Rigorous testing and quality control processes ensuring every mechanical system meets the highest industry standards.
                </p>
              </div>
            </div>

            <div className="commitment-card">
              <div className="commitment-icon">
                <div className="icon-wrapper safety">
                  <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="commitment-content">
                <h3 className="commitment-card-title">Safety First</h3>
                <p className="commitment-description">
                  Comprehensive safety protocols and compliance with all Australian safety standards in every mechanical project.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="services-section">
        <div className="services-container">
          <div className="services-header">
            <h2 className="services-title">Our Services</h2>
            <p className="services-subtitle">
              We offer comprehensive mechanical engineering services to help businesses achieve their operational goals and stay ahead of the competition.
            </p>
          </div>
          
          <div className="services-grid">
            {featuredServices.length > 0 ? (
              featuredServices.map((service, index) => (
                <div key={service._id} className="service-card">
                  <div className="service-icon">
                    <div className="icon-wrapper service">
                      <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <div className="service-content" style={{ textAlign: 'center' }}>
                    <h3 className="service-card-title" style={{ textAlign: 'center', margin: '0 auto 16px auto', width: '100%' }}>{service.title}</h3>
                    <p className="service-description" style={{ textAlign: 'center', margin: '0 auto 24px auto', width: '100%' }}>
                      {service.description || 'Professional mechanical engineering solutions tailored to your specific needs and requirements.'}
                    </p>
                    <Link to={`/services/${service.slug}`} className="service-link" style={{ textAlign: 'center', margin: '0 auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      Learn More →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              // Fallback dummy services if no services from database
              [
                {
                  _id: '1',
                  title: 'Mechanical Design',
                  description: 'Comprehensive mechanical design services including CAD modeling, prototyping, and engineering analysis.',
                  slug: 'mechanical-design'
                },
                {
                  _id: '2', 
                  title: 'HVAC Systems',
                  description: 'Complete HVAC design, installation, and maintenance services for commercial and industrial facilities.',
                  slug: 'hvac-systems'
                },
                {
                  _id: '3',
                  title: 'Industrial Automation',
                  description: 'Advanced automation solutions to streamline your manufacturing and production processes.',
                  slug: 'industrial-automation'
                },
                {
                  _id: '4',
                  title: 'Equipment Maintenance',
                  description: 'Preventive and corrective maintenance services to ensure optimal equipment performance.',
                  slug: 'equipment-maintenance'
                }
              ].map((service, index) => (
                <div key={service._id} className="service-card">
                  <div className="service-icon">
                    <div className="icon-wrapper service">
                      <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <div className="service-content" style={{ textAlign: 'center' }}>
                    <h3 className="service-card-title" style={{ textAlign: 'center', margin: '0 auto 16px auto', width: '100%' }}>{service.title}</h3>
                    <p className="service-description" style={{ textAlign: 'center', margin: '0 auto 24px auto', width: '100%' }}>
                      {service.description}
                    </p>
                    <Link to={`/services/${service.slug}`} className="service-link" style={{ textAlign: 'center', margin: '0 auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      Learn More →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="testimonials-header">
            <h2 className="testimonials-title">What Our Clients Say</h2>
            <p className="testimonials-subtitle">Trusted by leading companies across Australia</p>
          </div>
          <TestimonialsCarousel testimonials={testimonials} />
          </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container>
          <div className="cta-content">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-subtitle">
              Contact us today for a free consultation and quote
            </p>
            <div className="cta-buttons">
              <Link to="/contact">
                <Button variant="primary" size="lg" className="cta-button-primary">
                  Contact Us
                </Button>
              </Link>
              <Link to="/case-studies">
                <Button variant="outline" size="lg" className="cta-button-secondary">
                  View Case Studies
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default HomePage;

