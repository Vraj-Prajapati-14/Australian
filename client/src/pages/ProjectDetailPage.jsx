import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Container, Section, Button, Card, Badge } from '../components/ui';
import '../styles/project-detail.css';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  // Fetch project data
  const { data: project, isLoading, error } = useQuery({ 
    queryKey: ['project', slug], 
    queryFn: async () => {
      try {
        const response = await api.get(`/projects/${slug}`);
        return response.data?.data;
      } catch (error) {
        console.error('Error fetching project:', error);
        throw error;
      }
    },
    enabled: !!slug
  });

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get all images (hero + gallery)
  const getAllImages = () => {
    if (!project) return [];
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
      <div className="project-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-loading">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Error Loading Project</h2>
          <p>There was an error loading the project. Please check the console for details.</p>
          <Link to="/projects" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <Section padding="4xl">
        <Container>
          <Card variant="elevated" className="text-center py-12">
            <Card.Body>
              <div className="text-6xl mb-4">🔍</div>
              <Card.Title className="text-xl text-gray-600 mb-4">
                Project not found
              </Card.Title>
              <Card.Text className="text-gray-500 mb-6">
                The project you're looking for doesn't exist or has been removed.
              </Card.Text>
              <Button variant="primary" as={Link} to="/projects">
                Browse All Projects
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
        <title>{project.title} - Australian Equipment Solutions</title>
        <meta name="description" content={project.shortDescription || project.description} />
      </Helmet>

      {/* Hero Section */}
      <div className="project-hero">
        <div className="project-hero-content">
          <div className="project-hero-text">
            <h1>{project.title}</h1>
            <p>{project.shortDescription || project.description}</p>
            <div className="project-hero-actions">
              <Button variant="secondary" size="lg" as={Link} to="/contact" className="btn">
                Get Quote
              </Button>
              <Button variant="outline" size="lg" as={Link} to="/case-studies" className="btn">
                View Case Studies
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="project-content">
        <div className="project-content-inner">
          {/* Main Project Card */}
          <div className="project-main-card">
            <div className="project-main-image">
              {allImages.length > 0 ? (
                <div className="project-image-container">
                  <img
                    src={allImages[0].url}
                    alt={allImages[0].alt}
                    onClick={() => openLightbox(0)}
                    className="project-main-img"
                  />
                  {allImages.length > 1 && (
                    <div className="project-image-overlay">
                      <button 
                        className="gallery-toggle-btn"
                        onClick={() => openLightbox(0)}
                        title="View Gallery"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21,15 16,10 5,21"/>
                        </svg>
                        <span>View Gallery ({allImages.length})</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="placeholder-image">
                  <span className="text-6xl">📋</span>
                </div>
              )}
            </div>
            
            <div className="project-info">
              <div className="project-info-header">
                <h2>Project Information</h2>
                <div className="project-status">
                  <Badge variant={project.status === 'completed' ? 'success' : project.status === 'in-progress' ? 'warning' : 'info'}>
                    {project.status?.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <div className="project-info-grid">
                <div className="project-info-item">
                  <span className="project-info-label">Client:</span>
                  <span className="project-info-value">{project.clientName || 'Confidential'}</span>
                </div>
                
                {project.service && (
                  <div className="project-info-item">
                    <span className="project-info-label">Service:</span>
                    <span className="project-info-value">
                      {typeof project.service === 'object' ? project.service.title : project.service}
                    </span>
                  </div>
                )}
                
                {project.department && (
                  <div className="project-info-item">
                    <span className="project-info-label">Department:</span>
                    <span className="project-info-value">
                      {typeof project.department === 'object' ? project.department.name : project.department}
                    </span>
                  </div>
                )}
                
                {project.startDate && (
                  <div className="project-info-item">
                    <span className="project-info-label">Start Date:</span>
                    <span className="project-info-value">{formatDate(project.startDate)}</span>
                  </div>
                )}
                
                {project.completionDate && (
                  <div className="project-info-item">
                    <span className="project-info-label">Completion Date:</span>
                    <span className="project-info-value">{formatDate(project.completionDate)}</span>
                  </div>
                )}
                
                {project.budget && (
                  <div className="project-info-item">
                    <span className="project-info-label">Budget:</span>
                    <span className="project-info-value">{formatCurrency(project.budget)}</span>
                  </div>
                )}
                
                {project.location && (
                  <div className="project-info-item">
                    <span className="project-info-label">Location:</span>
                    <span className="project-info-value">{project.location}</span>
                  </div>
                )}
              </div>
              
              <div className="project-description">
                <h3>Project Description</h3>
                <p>{project.description}</p>
              </div>
              
              {project.tags && project.tags.length > 0 && (
                <div className="project-tags">
                  <h3>Tags</h3>
                  <div className="tags-list">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="info" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="project-actions">
                <Button variant="primary" size="lg" as={Link} to="/contact" className="btn">
                  Get Quote
                </Button>
                <Button variant="outline" size="lg" as={Link} to="/case-studies" className="btn">
                  View Case Studies
                </Button>
              </div>
            </div>
          </div>

          {/* Project Gallery */}
          {allImages.length > 1 && (
            <div className="project-gallery">
              <h2>Project Gallery</h2>
              <div className="gallery-carousel">
                <div className="gallery-track" style={{ transform: `translateX(-${currentImageIndex * (100 / 3)}%)` }}>
                  {allImages.slice(1).map((image, index) => (
                    <div key={index} className="gallery-slide" onClick={() => openLightbox(index + 1)}>
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="gallery-image"
                      />
                      <div className="gallery-overlay">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="11" cy="11" r="8"/>
                          <path d="M21 21l-4.35-4.35"/>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
                
                {allImages.length > 3 && (
                  <>
                    <button className="carousel-nav carousel-prev" onClick={prevImage}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15,18 9,12 15,6"/>
                      </svg>
                    </button>
                    
                    <button className="carousel-nav carousel-next" onClick={nextImage}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9,18 15,12 9,6"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>
              
              {allImages.length > 3 && (
                <div className="carousel-indicators">
                  {Array.from({ length: Math.ceil((allImages.length - 1) / 3) }).map((_, index) => (
                    <button
                      key={index}
                      className={`carousel-indicator ${Math.floor(currentImageIndex / 3) === index ? 'active' : ''}`}
                      onClick={() => goToImage(index * 3)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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
}

