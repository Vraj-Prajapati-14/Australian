import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Container, Section, Button, Card, Badge } from '../components/ui';
import '../styles/service-detail.css';

const ServiceDetailPage = () => {
  const { slug, subSlug } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [autoScrollIndex, setAutoScrollIndex] = useState(0);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  
  // If we have both slug and subSlug, we're viewing a sub-service
  const isSubService = subSlug;
  const serviceSlug = isSubService ? subSlug : slug;
  
  // Debug logging
  console.log('ServiceDetailPage params:', { slug, subSlug, isSubService, serviceSlug });
  
  const { data: service, isLoading, error } = useQuery({ 
    queryKey: ['service', serviceSlug], 
    queryFn: async () => {
      try {
        console.log('Fetching service with slug:', serviceSlug);
        const response = await api.get(`/services/${serviceSlug}`);
        console.log('Service response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching service by slug:', error);
        
        // If slug fetch fails, try fetching by ID (for backward compatibility)
        if (serviceSlug && !isNaN(serviceSlug)) {
          try {
            console.log('Trying to fetch service by ID:', serviceSlug);
            const response = await api.get(`/services/id/${serviceSlug}`);
            console.log('Service response by ID:', response.data);
            return response.data;
          } catch (idError) {
            console.error('Error fetching service by ID:', idError);
          }
        }
        
        throw error;
      }
    },
    enabled: !!serviceSlug
  });

  const { data: parentService } = useQuery({ 
    queryKey: ['service', slug], 
    queryFn: async () => {
      try {
        const response = await api.get(`/services/${slug}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching parent service:', error);
        return null;
      }
    },
    enabled: isSubService && !!slug // Only fetch parent service if we're viewing a sub-service
  });

  // Fetch projects related to this service
  const { data: relatedProjects = [] } = useQuery({
    queryKey: ['projects', service?._id],
    queryFn: async () => {
      if (!service?._id) return [];
      try {
        const response = await api.get(`/projects?service=${service._id}`);
        return response.data?.data || [];
      } catch (error) {
        console.error('Error fetching related projects:', error);
        return [];
      }
    },
    enabled: !!service?._id
  });

  // Fetch sub-services for main services
  const { data: subServices = [] } = useQuery({
    queryKey: ['sub-services', service?._id],
    queryFn: async () => {
      if (!service?._id || isSubService) return [];
      try {
        const response = await api.get(`/services?parentService=${service._id}&isMainService=false&status=active`);
        return response.data || [];
      } catch (error) {
        console.error('Error fetching sub-services:', error);
        return [];
      }
    },
    enabled: !!service?._id && !isSubService
  });

  // Helper functions
  const getServiceIcon = (serviceTitle) => {
    const title = serviceTitle?.toLowerCase() || '';
    if (title.includes('ute') || title.includes('pickup')) return '🚗';
    if (title.includes('trailer')) return '🚛';
    if (title.includes('truck')) return '🚚';
    if (title.includes('van')) return '🚐';
    if (title.includes('bus')) return '🚌';
    if (title.includes('fleet')) return '🏢';
    return '🚗';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get all images (hero + gallery)
  const getAllImages = () => {
    if (!service) return [];
    const images = [];
    
    // Add hero image if it exists
    if (service.heroImage?.url) {
      images.push({
        url: service.heroImage.url,
        alt: service.heroImage.alt || service.title,
        type: 'hero'
      });
    }
    
    // Add gallery images if they exist
    if (service.gallery && Array.isArray(service.gallery)) {
      service.gallery.forEach((image, index) => {
        if (image.url) {
          images.push({
            url: image.url,
            alt: image.alt || `${service.title} - Image ${index + 1}`,
            type: 'gallery'
          });
        }
      });
    }
    
    return images;
  };

  const allImages = getAllImages();

  // Carousel navigation functions
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const openLightbox = (index = 0) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  // Project navigation functions
  const nextProject = () => {
    setCurrentProjectIndex((prev) => (prev + 1) % relatedProjects.length);
  };

  const prevProject = () => {
    setCurrentProjectIndex((prev) => (prev - 1 + relatedProjects.length) % relatedProjects.length);
  };

  const goToProject = (index) => {
    setCurrentProjectIndex(index);
  };

  // Get current project images (hero + gallery)
  const getCurrentProjectImages = () => {
    if (!relatedProjects[currentProjectIndex]) return [];
    const project = relatedProjects[currentProjectIndex];
    const images = [];
    
    // Add hero image if it exists
    if (project.heroImage?.url) {
      images.push({
        url: project.heroImage.url,
        alt: project.heroImage.alt || project.title,
        type: 'hero'
      });
    }
    
    // Add gallery images if they exist
    if (project.gallery && Array.isArray(project.gallery)) {
      project.gallery.forEach((image, index) => {
        if (image.url) {
          images.push({
            url: image.url,
            alt: image.alt || `${project.title} - Image ${index + 1}`,
            type: 'gallery'
          });
        }
      });
    }
    
    return images;
  };

  const currentProjectImages = getCurrentProjectImages();

  // Auto-scroll functionality
  React.useEffect(() => {
    if (allImages.length <= 4) return; // No auto-scroll if 4 or fewer images
    
    const interval = setInterval(() => {
      setAutoScrollIndex((prev) => (prev + 1) % allImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [allImages.length]);

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  if (isLoading) {
    return (
      <div className="service-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    console.error('Service fetch error:', error);
    return (
      <div className="service-loading">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Error Loading Service</h2>
          <p>There was an error loading the service. Please check the console for details.</p>
          <p>URL: /services/{slug}{subSlug ? `/${subSlug}` : ''}</p>
          <p>Service Slug: {serviceSlug}</p>
          <Link to="/services" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
            ← Back to Services
          </Link>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <Section padding="4xl">
        <Container>
          <Card variant="elevated" className="text-center py-12">
            <Card.Body>
              <div className="text-6xl mb-4">🔍</div>
              <Card.Title className="text-xl text-gray-600 mb-4">
                Service not found
              </Card.Title>
              <Card.Text className="text-gray-500 mb-6">
                The service you're looking for doesn't exist or has been removed.
              </Card.Text>
              <Button variant="primary" as={Link} to="/services">
                Browse All Services
              </Button>
            </Card.Body>
          </Card>
        </Container>
      </Section>
    );
  }

  return (
    <>
      <Helmet>
        <title>{service.title} - Australian Equipment Solutions</title>
        <meta name="description" content={service.shortDescription || service.summary} />
      </Helmet>

      {/* Service Hero Section */}
      <section className="service-hero">
        <div className="service-breadcrumb">
          <Link to="/services">Services</Link>
          {isSubService && parentService && (
            <>
              <span> / </span>
              <Link to={`/services/${parentService.slug}`}>{parentService.title}</Link>
            </>
          )}
          <span> / {service.title}</span>
        </div>
        
        <div className="service-hero-content">
          <h1>{service.title}</h1>
          <p>{service.summary}</p>
        </div>
      </section>

      {/* Service Content */}
      <div className="service-content">
        <div className="service-content-inner">
          <div className="service-main-content">
            {/* Department Information - Above Image */}
            {service.department && (
              <div className="service-department-info">
                <div className="department-badge">
                  <span className="department-label">Department:</span>
                  <span className="department-name">{service.department.name}</span>
                </div>
              </div>
            )}

            {/* Service Image - Centered */}
            <div className="service-image-section">
              {service.heroImage?.url ? (
                <div className="service-image-container">
                  <img
                    src={service.heroImage.url}
                    alt={service.heroImage.alt || service.title}
                    className="service-main-image"
                  />
                </div>
              ) : (
                <div className="service-image-placeholder">
                  <span className="text-6xl">{getServiceIcon(service.title)}</span>
                </div>
              )}
            </div>

            {/* Service Information */}
            <div className="service-info-section">

            {service.pricing && (
                <div className="service-info-card">
                  <h3>
                    <svg className="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23"/>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                    Pricing
                  </h3>
                  <div className="service-info-item">
                    <span className="service-info-label">Starting Price:</span>
                    <span className="service-info-value">${service.pricing.base?.toLocaleString()}</span>
                  </div>
                  {service.pricing.includes && service.pricing.includes.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Includes:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {service.pricing.includes.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {service.content && (
                <div className="service-info-card">
                  <h3>About {service.title}</h3>
                  <div dangerouslySetInnerHTML={{ __html: service.content }} />
                </div>
              )}

              {service.features && service.features.length > 0 && (
                <div className="service-info-card">
                  <h3>Key Features</h3>
                  <ul>
                    {service.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {service.specifications && (
                <div className="service-info-card">
                  <h3>Specifications</h3>
                  <ul>
                    {Object.entries(service.specifications).map(([key, value]) => (
                      value && (
                        <li key={key}>
                          <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {value}
                        </li>
                      )
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          </div>
          </div>

          {/* Features Section */}
          {service.features && service.features.length > 0 && (
            <div className="service-features">
              <h2>Key Features & Benefits</h2>
              <div className="features-grid">
                {service.features.map((feature, index) => (
                  <div key={index} className="feature-card">
                    <div className="feature-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12l2 2 4-4"/>
                        <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                        <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                        <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"/>
                        <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"/>
                      </svg>
                    </div>
                    <h3>Feature {index + 1}</h3>
                    <p>{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Gallery Section */}
          {allImages.length > 1 && (
            <div className="service-gallery">
              <h2>Gallery</h2>
              <div className="gallery-carousel">
                <button 
                  className="carousel-nav carousel-nav-prev" 
                  onClick={() => setAutoScrollIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
                  disabled={allImages.length <= 5}
                >
                  <span>‹</span>
                </button>
                
                <div className="carousel-container">
                  <div className="gallery-round-container">
                    {allImages.map((image, index) => {
                      // Calculate which images to show based on auto-scroll
                      const displayIndex = (autoScrollIndex + index) % allImages.length;
                      const isVisible = index < 5; // Show up to 5 images
                      
                      if (!isVisible) return null;
                      
                      return (
                        <div key={displayIndex} className="gallery-round-item" onClick={() => openLightbox(displayIndex)}>
                          <img
                            src={allImages[displayIndex].url}
                            alt={allImages[displayIndex].alt}
                            className="gallery-round-image"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <button 
                  className="carousel-nav carousel-nav-next" 
                  onClick={() => setAutoScrollIndex((prev) => (prev + 1) % allImages.length)}
                  disabled={allImages.length <= 5}
                >
                  <span>›</span>
                </button>
              </div>
            </div>
          )}

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="service-projects">
              <div className="projects-header">
                <h2>Our Projects</h2>
                <div className="projects-count">
                  <span className="projects-total">{relatedProjects.length}</span>
                  <span className="projects-label">Total Projects</span>
                </div>
              </div>
              
              {/* Project Pagination */}
              <div className="projects-pagination">
                {relatedProjects.map((_, index) => (
                  <button
                    key={index}
                    className={`pagination-btn ${index === currentProjectIndex ? 'active' : ''}`}
                    onClick={() => goToProject(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {/* Current Project Display - Full Width */}
              <div className="current-project-display">
                {relatedProjects[currentProjectIndex] && (
                  <div className="project-full-view">
                    {/* Project Header */}
                    <div className="project-full-header">
                      <h2 className="project-full-title">
                        {relatedProjects[currentProjectIndex].title}
                      </h2>
                      <div className="project-nav-counter">
                        {currentProjectIndex + 1} of {relatedProjects.length}
                      </div>
                    </div>

                    {/* Project Main Image */}
                    <div className="project-full-image-section">
                      {currentProjectImages.length > 0 ? (
                        <div className="project-full-image-container">
                          <img
                            src={currentProjectImages[0].url}
                            alt={currentProjectImages[0].alt}
                            className="project-full-main-image"
                          />
                        </div>
                      ) : (
                        <div className="project-full-placeholder">
                          <span className="text-8xl">📋</span>
                        </div>
                      )}
                    </div>

                    {/* Project Details */}
                    <div className="project-full-details">
                      <div className="project-full-info-grid">
                        {/* Basic Information */}
                        {relatedProjects[currentProjectIndex].clientName && (
                          <div className="project-detail-item">
                            <span className="project-detail-label">Client:</span>
                            <span className="project-detail-value">{relatedProjects[currentProjectIndex].clientName}</span>
                          </div>
                        )}
                        
                        {relatedProjects[currentProjectIndex].service && (
                          <div className="project-detail-item">
                            <span className="project-detail-label">Service:</span>
                            <span className="project-detail-value">
                              {typeof relatedProjects[currentProjectIndex].service === 'object' 
                                ? relatedProjects[currentProjectIndex].service.title 
                                : relatedProjects[currentProjectIndex].service}
                            </span>
                          </div>
                        )}
                        
                        {relatedProjects[currentProjectIndex].department && (
                          <div className="project-detail-item">
                            <span className="project-detail-label">Department:</span>
                            <span className="project-detail-value">
                              {typeof relatedProjects[currentProjectIndex].department === 'object' 
                                ? relatedProjects[currentProjectIndex].department.name 
                                : relatedProjects[currentProjectIndex].department}
                            </span>
                          </div>
                        )}
                        
                        <div className="project-detail-item">
                          <span className="project-detail-label">Status:</span>
                          <span className="project-detail-value">
                            <Badge variant={relatedProjects[currentProjectIndex].status === 'completed' ? 'success' : 
                                           relatedProjects[currentProjectIndex].status === 'in-progress' ? 'warning' : 'info'}>
                              {relatedProjects[currentProjectIndex].status?.replace('-', ' ').toUpperCase()}
                            </Badge>
                          </span>
                        </div>
                        
                        {relatedProjects[currentProjectIndex].isFeatured && (
                          <div className="project-detail-item">
                            <span className="project-detail-label">Featured:</span>
                            <span className="project-detail-value">
                              <Badge variant="success">Yes</Badge>
                            </span>
                          </div>
                        )}
                        
                        {/* Dates */}
                        {relatedProjects[currentProjectIndex].startDate && (
                          <div className="project-detail-item">
                            <span className="project-detail-label">Start Date:</span>
                            <span className="project-detail-value">{formatDate(relatedProjects[currentProjectIndex].startDate)}</span>
                          </div>
                        )}
                        
                        {relatedProjects[currentProjectIndex].endDate && (
                          <div className="project-detail-item">
                            <span className="project-detail-label">End Date:</span>
                            <span className="project-detail-value">{formatDate(relatedProjects[currentProjectIndex].endDate)}</span>
                          </div>
                        )}
                        
                        {relatedProjects[currentProjectIndex].completionDate && (
                          <div className="project-detail-item">
                            <span className="project-detail-label">Completion Date:</span>
                            <span className="project-detail-value">{formatDate(relatedProjects[currentProjectIndex].completionDate)}</span>
                          </div>
                        )}
                        
                        {/* Financial */}
                        {relatedProjects[currentProjectIndex].budget && (
                          <div className="project-detail-item">
                            <span className="project-detail-label">Budget:</span>
                            <span className="project-detail-value">${relatedProjects[currentProjectIndex].budget.toLocaleString()}</span>
                          </div>
                        )}
                        
                        {/* Order */}
                        {relatedProjects[currentProjectIndex].order && (
                          <div className="project-detail-item">
                            <span className="project-detail-label">Order:</span>
                            <span className="project-detail-value">{relatedProjects[currentProjectIndex].order}</span>
                          </div>
                        )}
                        
                        {/* Created Date */}
                        <div className="project-detail-item">
                          <span className="project-detail-label">Created:</span>
                          <span className="project-detail-value">{formatDate(relatedProjects[currentProjectIndex].createdAt)}</span>
                        </div>
                      </div>
                      
                      {/* Short Description */}
                      {relatedProjects[currentProjectIndex].shortDescription && (
                        <div className="project-full-short-description">
                          <h3>Summary</h3>
                          <p>{relatedProjects[currentProjectIndex].shortDescription}</p>
                        </div>
                      )}
                      
                      {/* Full Description */}
                      {relatedProjects[currentProjectIndex].description && (
                        <div className="project-full-description">
                          <h3>Project Description</h3>
                          <p>{relatedProjects[currentProjectIndex].description}</p>
                        </div>
                      )}
                      
                      {/* Technologies */}
                      {relatedProjects[currentProjectIndex].technologies && relatedProjects[currentProjectIndex].technologies.length > 0 && (
                        <div className="project-full-technologies">
                          <h3>Technologies Used</h3>
                          <div className="project-technologies-list">
                            {relatedProjects[currentProjectIndex].technologies.map((tech, index) => (
                              <Badge key={index} variant="info" size="sm">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Challenges */}
                      {relatedProjects[currentProjectIndex].challenges && (
                        <div className="project-full-challenges">
                          <h3>Challenges</h3>
                          <p>{relatedProjects[currentProjectIndex].challenges}</p>
                        </div>
                      )}
                      
                      {/* Results */}
                      {relatedProjects[currentProjectIndex].results && (
                        <div className="project-full-results">
                          <h3>Results</h3>
                          <p>{relatedProjects[currentProjectIndex].results}</p>
                        </div>
                      )}
                      
                      {/* Tags */}
                      {relatedProjects[currentProjectIndex].tags && relatedProjects[currentProjectIndex].tags.length > 0 && (
                        <div className="project-full-tags">
                          <h3>Tags</h3>
                          <div className="project-tags-list">
                            {relatedProjects[currentProjectIndex].tags.map((tag, index) => (
                              <Badge key={index} variant="info" size="sm">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Project Gallery - Using Service Gallery CSS */}
                    {currentProjectImages.length > 1 && (
                      <div className="project-full-gallery">
                        <h3>Project Gallery</h3>
                        <div className="gallery-carousel">
                          <button 
                            className="gallery-nav gallery-prev" 
                            onClick={() => setAutoScrollIndex((prev) => (prev - 1 + currentProjectImages.length) % currentProjectImages.length)}
                            disabled={currentProjectImages.length <= 5}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="15,18 9,12 15,6"/>
                            </svg>
                          </button>
                          
                          <div className="gallery-round-container">
                            {currentProjectImages.map((image, index) => {
                              // Calculate which images to show based on auto-scroll
                              const displayIndex = (autoScrollIndex + index) % currentProjectImages.length;
                              const isVisible = index < 5; // Show up to 5 images
                              
                              if (!isVisible) return null;
                              
                              return (
                                <div key={displayIndex} className="gallery-round-item" onClick={() => openLightbox(displayIndex)}>
                                  <img
                                    src={currentProjectImages[displayIndex].url}
                                    alt={currentProjectImages[displayIndex].alt}
                                    className="gallery-round-image"
                                  />
                                </div>
                              );
                            })}
                          </div>
                          
                          <button 
                            className="gallery-nav gallery-next" 
                            onClick={() => setAutoScrollIndex((prev) => (prev + 1) % currentProjectImages.length)}
                            disabled={currentProjectImages.length <= 5}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="9,18 15,12 9,6"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Project Actions */}
                    {/* <div className="project-full-actions">
                      <Button variant="primary" size="lg" as={Link} to="/contact" className="btn">
                        Get Quote
                      </Button>
                      <Button variant="outline" size="lg" as={Link} to="/case-studies" className="btn">
                        View Case Studies
                      </Button>
                    </div> */}
                  </div>
                )}
              </div>

              {/* All Projects Grid (Hidden by default, shown when needed) */}
              <div className="projects-grid" style={{ display: 'none' }}>
                {relatedProjects.slice(0, 6).map((project) => {
                  // Get all project images (hero + gallery)
                  const projectImages = [];
                  if (project.heroImage?.url) {
                    projectImages.push({
                      url: project.heroImage.url,
                      alt: project.heroImage.alt || project.title,
                      type: 'hero'
                    });
                  }
                  if (project.gallery && Array.isArray(project.gallery)) {
                    project.gallery.forEach((image, index) => {
                      if (image.url) {
                        projectImages.push({
                          url: image.url,
                          alt: image.alt || `${project.title} - Image ${index + 1}`,
                          type: 'gallery'
                        });
                      }
                    });
                  }

                  return (
                    <div key={project._id} className="project-card">
                      <div className="project-image">
                        {project.heroImage?.url ? (
                          <img
                            src={project.heroImage.url}
                            alt={project.heroImage.alt || project.title}
                          />
                        ) : (
                          <div className="placeholder-image">
                            <span className="text-4xl">📋</span>
                          </div>
                        )}
                        {projectImages.length > 1 && (
                          <div className="project-gallery-indicator">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                              <circle cx="8.5" cy="8.5" r="1.5"/>
                              <polyline points="21,15 16,10 5,21"/>
                            </svg>
                            <span>{projectImages.length} images</span>
                          </div>
                        )}
                      </div>
                      <div className="project-content">
                        <h3 className="project-title">{project.title}</h3>
                        <p className="project-description">{project.shortDescription || project.summary}</p>
                        
                        {/* Project Details */}
                        <div className="project-details">
                          {project.clientName && (
                            <div className="project-detail-item">
                              <span className="project-detail-label">Client:</span>
                              <span className="project-detail-value">{project.clientName}</span>
                            </div>
                          )}
                          {project.projectType && (
                            <div className="project-detail-item">
                              <span className="project-detail-label">Type:</span>
                              <span className="project-detail-value">{project.projectType}</span>
                            </div>
                          )}
                          {project.duration && (
                            <div className="project-detail-item">
                              <span className="project-detail-label">Duration:</span>
                              <span className="project-detail-value">{project.duration}</span>
                            </div>
                          )}
                          {project.budget && (
                            <div className="project-detail-item">
                              <span className="project-detail-label">Budget:</span>
                              <span className="project-detail-value">${project.budget.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="project-detail-item">
                            <span className="project-detail-label">Completed:</span>
                            <span className="project-detail-value">{formatDate(project.createdAt)}</span>
                          </div>
                        </div>

                        {/* Project Gallery Preview */}
                        {projectImages.length > 1 && (
                          <div className="project-gallery-preview">
                            <h4>Gallery Preview</h4>
                            <div className="gallery-preview-grid">
                              {projectImages.slice(0, 4).map((image, index) => (
                                <div key={index} className="gallery-preview-item">
                                  <img
                                    src={image.url}
                                    alt={image.alt}
                                    onClick={() => {
                                      // Open lightbox with project images
                                      setCurrentImageIndex(index);
                                      setIsLightboxOpen(true);
                                    }}
                                  />
                                  {index === 3 && projectImages.length > 4 && (
                                    <div className="gallery-more-overlay">
                                      <span>+{projectImages.length - 4}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="project-actions">
                          <Link 
                            to={`/projects/${project.slug || project._id}`} 
                            className="project-btn project-btn-primary"
                          >
                            View Project
                          </Link>
                          <Link 
                            to="/contact" 
                            className="project-btn project-btn-secondary"
                          >
                            Get Quote
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sub-services */}
          {!isSubService && subServices.length > 0 && (
            <div className="service-sub-services">
              <h2>Related Services</h2>
              <div className="sub-services-grid">
                {subServices.map((subService) => (
                  <div key={subService._id} className="sub-service-card">
                    <div className="sub-service-image">
                      {subService.heroImage?.url ? (
                        <img
                          src={subService.heroImage.url}
                          alt={subService.heroImage.alt || subService.title}
                        />
                      ) : (
                        <div className="placeholder-image">
                          <span className="text-4xl">{getServiceIcon(subService.title)}</span>
                        </div>
                      )}
                    </div>
                    <div className="sub-service-content">
                      <h3 className="sub-service-title">{subService.title}</h3>
                      <p className="sub-service-description">
                        {subService.shortDescription || subService.summary}
                      </p>
                      <a 
                        href={`/services/${service.slug}/${subService.slug}`}
                        className="sub-service-btn"
                      >
                        Learn More
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        

      {/* CTA Section - Using exact same structure as HomePage and AboutPage */}
      <section className="cta-section">
        <Container>
          <div className="cta-content">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-subtitle">
              Contact us today for a free consultation and quote for your {service.title.toLowerCase()} project.
            </p>
            <div className="cta-buttons">
              <Link to="/contact">
                <Button variant="primary" size="lg" className="cta-button-primary">
                  Contact Us
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg" className="cta-button-secondary">
                  View Services
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>


      {/* Lightbox Modal */}
      {isLightboxOpen && allImages.length > 0 && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            
            <div className="lightbox-main">
              <img
                src={allImages[currentImageIndex].url}
                alt={allImages[currentImageIndex].alt}
                className="lightbox-image"
              />
              
              {allImages.length > 1 && (
                <>
                  <button className="lightbox-nav lightbox-prev" onClick={prevImage}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15,18 9,12 15,6"/>
                    </svg>
                  </button>
                  
                  <button className="lightbox-nav lightbox-next" onClick={nextImage}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9,18 15,12 9,6"/>
                    </svg>
                  </button>
                </>
              )}
            </div>
            
            {allImages.length > 1 && (
              <div className="lightbox-thumbnails">
                {allImages.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.alt}
                    className={`lightbox-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => goToImage(index)}
                  />
                ))}
              </div>
            )}
            
            <div className="lightbox-info">
              <h3>{allImages[currentImageIndex].alt}</h3>
              <p>{currentImageIndex + 1} of {allImages.length}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceDetailPage;

