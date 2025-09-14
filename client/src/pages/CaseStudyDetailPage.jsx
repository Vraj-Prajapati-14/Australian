import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Container, Button } from '../components/ui';
import { useThemeSettings } from '../hooks/useThemeSettings';
import '../styles/case-study-detail.css';

const CaseStudyDetailPage = () => {
  const { slug } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const settings = useThemeSettings();

  // Fetch case study by slug
  const { data: caseStudyData, isLoading, error } = useQuery({ 
    queryKey: ['case-study', slug], 
    queryFn: async () => (await api.get(`/case-studies/${slug}`)).data,
    enabled: !!slug
  });

  const caseStudy = caseStudyData?.data;
  const general = settings?.general || {};

  // Get all images (hero + gallery)
  const allImages = [
    ...(caseStudy?.heroImage?.url ? [caseStudy.heroImage] : []),
    ...(caseStudy?.gallery || [])
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Case Study Not Found</h1>
          <p className="text-gray-600 mb-6">The case study you're looking for doesn't exist or has been removed.</p>
          <Link to="/case-studies" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            View All Case Studies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{caseStudy.seoTitle || caseStudy.title} - {general.siteName || general.companyName || 'Australian Engineering Solutions'}</title>
        <meta name="description" content={caseStudy.seoDescription || caseStudy.shortDescription || caseStudy.description} />
      </Helmet>

      {/* Hero Section */}
      <section className="case-study-detail-hero">
        <Container>
          <div className="case-study-detail-content">
            <Link to="/case-studies" className="back-link">
              <span className="back-arrow">←</span>
              Back to Case Studies
            </Link>
            
            <div className="project-category-badge">
              {caseStudy.service?.title || caseStudy.department?.name || 'Engineering Project'}
            </div>
            
            <h1 className="case-studies-hero-title">
              {caseStudy.title}
            </h1>
            <p className="case-studies-hero-subtitle">
              {caseStudy.shortDescription || caseStudy.description}
            </p>
            
            {/* Project Stats in Hero */}
            {caseStudy.projectStats && (
              <div className="project-stats-grid">
                {caseStudy.projectStats.stat1 && (
                  <div className="project-stat-item">
                    <div className="project-stat-icon">👥</div>
                    <div className="project-stat-label">{caseStudy.projectStats.stat1.label}</div>
                    <div className="project-stat-value">{caseStudy.projectStats.stat1.value}</div>
                  </div>
                )}
                {caseStudy.projectStats.stat2 && (
                  <div className="project-stat-item">
                    <div className="project-stat-icon">📅</div>
                    <div className="project-stat-label">{caseStudy.projectStats.stat2.label}</div>
                    <div className="project-stat-value">{caseStudy.projectStats.stat2.value}</div>
                  </div>
                )}
                {caseStudy.projectStats.stat3 && (
                  <div className="project-stat-item">
                    <div className="project-stat-icon">🏢</div>
                    <div className="project-stat-label">{caseStudy.projectStats.stat3.label}</div>
                    <div className="project-stat-value">{caseStudy.projectStats.stat3.value}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Case Study Content */}
      <section className="case-studies-grid">
        <Container>
          <div className="case-study-detail-content">
            {/* Image Carousel */}
            {allImages.length > 0 && (
              <div className="case-study-gallery">
                <div className="case-study-carousel">
                  <div className="case-study-carousel-main">
                    <img 
                      src={allImages[currentImageIndex]?.url} 
                      alt={allImages[currentImageIndex]?.alt || caseStudy.title}
                      className="case-study-carousel-image"
                    />
                    {allImages.length > 1 && (
                      <>
                        <button 
                          className="case-study-carousel-nav prev"
                          onClick={prevImage}
                          aria-label="Previous image"
                        >
                          <span className="case-study-carousel-nav-icon"></span>
                        </button>
                        <button 
                          className="case-study-carousel-nav next"
                          onClick={nextImage}
                          aria-label="Next image"
                        >
                          <span className="case-study-carousel-nav-icon"></span>
                        </button>
                      </>
                    )}
                  </div>
                  
                  {allImages.length > 1 && (
                    <>
                      <div className="case-study-carousel-indicators">
                        {allImages.map((_, index) => (
                          <button
                            key={index}
                            className={`case-study-carousel-indicator ${index === currentImageIndex ? 'active' : ''}`}
                            onClick={() => goToImage(index)}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>
                      
                      <div className="case-study-carousel-thumbnails">
                        {allImages.map((image, index) => (
                          <img
                            key={index}
                            src={image.url}
                            alt={image.alt || `Thumbnail ${index + 1}`}
                            className={`case-study-carousel-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                            onClick={() => goToImage(index)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Case Study Details */}
            <div className="case-study-detail-grid">
              {/* Main Content */}
              <div className="case-study-detail-main">
                {/* Project Overview */}
                <div className="project-overview">
                  <h2>Project Overview</h2>
                  <p>{caseStudy.description}</p>
                </div>

                {caseStudy.projectScope && (
                  <div className="content-section">
                    <h3>Project Scope</h3>
                    <p>{caseStudy.projectScope}</p>
                  </div>
                )}

                {caseStudy.challenges && (
                  <div className="content-section">
                    <h3>Challenges</h3>
                    <p>{caseStudy.challenges}</p>
                  </div>
                )}

                {caseStudy.solutions && (
                  <div className="content-section">
                    <h3>Solutions</h3>
                    <p>{caseStudy.solutions}</p>
                  </div>
                )}

                {/* Development Process Section */}
                {caseStudy.developmentProcess && caseStudy.developmentProcess.length > 0 && (
                  <div className="development-process-section">
                    <h3>Development Process</h3>
                    <div className="development-process-timeline">
                      {caseStudy.developmentProcess.map((process, index) => (
                        <div key={index} className="development-process-item">
                          <div className="process-step-number">{process.step}</div>
                          <div className="process-step-content">
                            <h4 className="process-step-title">{process.title}</h4>
                            <p className="process-step-description">{process.description}</p>
                            {process.duration && (
                              <div className="process-step-duration">{process.duration}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Technologies Used Section */}
                {caseStudy.technologies && caseStudy.technologies.length > 0 && (
                  <div className="technologies-section">
                    <h3>Technologies Used</h3>
                    <div className="technologies-grid">
                      {caseStudy.technologies.map((tech, index) => (
                        <div key={index} className="technology-tag">
                          {tech}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="case-study-detail-sidebar">
                <h3>Project Details</h3>
                
                <div className="case-study-detail-meta">
                  <div className="case-study-detail-meta-item">
                    <span className="case-study-detail-meta-label">Client:</span>
                    <span className="case-study-detail-meta-value">{caseStudy.clientName || 'Confidential'}</span>
                  </div>

                  <div className="case-study-detail-meta-item">
                    <span className="case-study-detail-meta-label">Status:</span>
                    <span className="case-study-detail-meta-value capitalize">{caseStudy.status || 'Completed'}</span>
                  </div>

                  {caseStudy.completionDate && (
                    <div className="case-study-detail-meta-item">
                      <span className="case-study-detail-meta-label">Completion Date:</span>
                      <span className="case-study-detail-meta-value">
                        {new Date(caseStudy.completionDate).toLocaleDateString('en-AU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}

                  {caseStudy.service && (
                    <div className="case-study-detail-meta-item">
                      <span className="case-study-detail-meta-label">Service:</span>
                      <span className="case-study-detail-meta-value">
                        {typeof caseStudy.service === 'object' ? caseStudy.service.title : caseStudy.service}
                      </span>
                    </div>
                  )}

                  {caseStudy.department && (
                    <div className="case-study-detail-meta-item">
                      <span className="case-study-detail-meta-label">Department:</span>
                      <span className="case-study-detail-meta-value">
                        {typeof caseStudy.department === 'object' ? caseStudy.department.name : caseStudy.department}
                      </span>
                    </div>
                  )}
                </div>

                {/* Results */}
                {caseStudy.results && (
                  <div className="case-study-detail-results">
                    <h4>Results</h4>
                    <div className="case-study-detail-results-grid">
                      {caseStudy.results.vehiclesUpgraded && (
                        <div className="case-study-detail-result-item">
                          <span className="case-study-detail-result-label">Vehicles Upgraded:</span>
                          <span className="case-study-detail-result-value">{caseStudy.results.vehiclesUpgraded}</span>
                        </div>
                      )}
                      {caseStudy.results.costSavings && (
                        <div className="case-study-detail-result-item">
                          <span className="case-study-detail-result-label">Cost Savings:</span>
                          <span className="case-study-detail-result-value">${caseStudy.results.costSavings}k</span>
                        </div>
                      )}
                      {caseStudy.results.efficiencyImprovement && (
                        <div className="case-study-detail-result-item">
                          <span className="case-study-detail-result-label">Efficiency Improvement:</span>
                          <span className="case-study-detail-result-value">{caseStudy.results.efficiencyImprovement}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {caseStudy.tags && caseStudy.tags.length > 0 && (
                  <div className="mt-6">
                    <h4>Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.tags.map((tag, index) => (
                        <span key={index} className="case-study-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Key Features Section - Full Width */}
            {caseStudy.keyFeatures && caseStudy.keyFeatures.length > 0 && (
              <div className="key-features-section">
                <h3>Key Features</h3>
                <div className="key-features-list">
                  {caseStudy.keyFeatures.map((feature, index) => (
                    <div key={index} className="key-feature-item">
                      <div className="key-feature-icon"></div>
                      <div className="key-feature-text">{feature}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Results Section - Full Width with Carousel */}
            {caseStudy.results && (caseStudy.results.customResults || caseStudy.results.vehiclesUpgraded || caseStudy.results.costSavings || caseStudy.results.efficiencyImprovement) && (
              <div className="key-results-section">
                <h3>Key Results</h3>
                <div className="key-results-carousel">
                  <div className="key-results-track auto-scroll">
                    <div className="key-results-grid">
                      {caseStudy.results.customResults && caseStudy.results.customResults.map((result, index) => (
                        <div key={index} className="key-result-item">
                          <div className="key-result-header">
                            <div className="key-result-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 13h2l3-7 5 12 3-9h2l-4 16-6-14-3 7z"/>
                              </svg>
                            </div>
                            <div className="key-result-title">Result {index + 1}</div>
                          </div>
                          <div className="key-result-description">{result.value}</div>
                        </div>
                      ))}
                      
                      {caseStudy.results.vehiclesUpgraded && (
                        <div className="key-result-item">
                          <div className="key-result-header">
                            <div className="key-result-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                              </svg>
                            </div>
                            <div className="key-result-title">Vehicles Upgraded</div>
                          </div>
                          <div className="key-result-description">{caseStudy.results.vehiclesUpgraded} vehicles</div>
                        </div>
                      )}
                      
                      {caseStudy.results.costSavings && (
                        <div className="key-result-item">
                          <div className="key-result-header">
                            <div className="key-result-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                              </svg>
                            </div>
                            <div className="key-result-title">Cost Savings</div>
                          </div>
                          <div className="key-result-description">${caseStudy.results.costSavings}k saved</div>
                        </div>
                      )}
                      
                      {caseStudy.results.efficiencyImprovement && (
                        <div className="key-result-item">
                          <div className="key-result-header">
                            <div className="key-result-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
                              </svg>
                            </div>
                            <div className="key-result-title">Efficiency</div>
                          </div>
                          <div className="key-result-description">{caseStudy.results.efficiencyImprovement}% improvement</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Testimonial Section - Card Design Like Second Image */}
            {caseStudy.testimonial && (
              <div className="case-study-detail-testimonial">
                <div className="testimonial-rating">
                  <span className="testimonial-star">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </span>
                  <span className="testimonial-star">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </span>
                  <span className="testimonial-star">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </span>
                  <span className="testimonial-star">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </span>
                  <span className="testimonial-star">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </span>
                </div>
                
                <blockquote>
                  {caseStudy.testimonial}
                </blockquote>
                
                <div className="testimonial-header">
                  <div className="testimonial-avatar">
                    👤
                  </div>
                  <div className="testimonial-info">
                    <div className="testimonial-name">
                      {caseStudy.clientName || 'Project Client'}
                    </div>
                    <div className="testimonial-position">
                      {caseStudy.clientPosition || 'Project Manager'}
                    </div>
                    <div className="testimonial-company">
                      {caseStudy.clientCompany || 'Client Company'}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </Container>
      </section>

      {/* CTA Section - Full Width */}
      <section className="case-study-detail-cta">
        <Container>
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Your Project?</h2>
            <p className="cta-subtitle">
              Let us help you achieve similar results for your business.
            </p>
            <div className="case-study-detail-cta-buttons">
              <Link to="/contact" className="cta-button-primary">
                Get Started
              </Link>
              <Link to="/case-studies" className="cta-button-secondary">
                View More Case Studies
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default CaseStudyDetailPage;
