import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Container } from '../components/ui';
import '../styles/case-studies-page.css';

const CaseStudyDetailPage = () => {
  const { slug } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch case study by slug
  const { data: caseStudyData, isLoading, error } = useQuery({ 
    queryKey: ['case-study', slug], 
    queryFn: async () => (await api.get(`/case-studies/${slug}`)).data,
    enabled: !!slug
  });

  const caseStudy = caseStudyData?.data;

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
        <title>{caseStudy.seoTitle || caseStudy.title} - Case Study</title>
        <meta name="description" content={caseStudy.seoDescription || caseStudy.shortDescription || caseStudy.description} />
      </Helmet>

      {/* Hero Section */}
      <section className="case-study-detail-hero">
        <Container>
          <div className="case-study-detail-content">
            <div className="mb-4">
              <Link to="/case-studies" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                ← Back to Case Studies
              </Link>
            </div>
            <h1 className="case-studies-hero-title">
              {caseStudy.title}
            </h1>
            <p className="case-studies-hero-subtitle">
              {caseStudy.shortDescription || caseStudy.description}
            </p>
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
                <div className="case-study-detail-section">
                  <h2>Project Overview</h2>
                  <p>{caseStudy.description}</p>
                </div>

                {caseStudy.projectScope && (
                  <div className="case-study-detail-section">
                    <h3>Project Scope</h3>
                    <p>{caseStudy.projectScope}</p>
                  </div>
                )}

                {caseStudy.challenges && (
                  <div className="case-study-detail-section">
                    <h3>Challenges</h3>
                    <p>{caseStudy.challenges}</p>
                  </div>
                )}

                {caseStudy.solutions && (
                  <div className="case-study-detail-section">
                    <h3>Solutions</h3>
                    <p>{caseStudy.solutions}</p>
                  </div>
                )}

                {caseStudy.technologies && caseStudy.technologies.length > 0 && (
                  <div className="case-study-detail-section">
                    <h3>Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.technologies.map((tech, index) => (
                        <span key={index} className="case-study-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Testimonial */}
                {caseStudy.testimonial && (
                  <div className="case-study-detail-testimonial">
                    <blockquote>
                      {caseStudy.testimonial}
                    </blockquote>
                    {caseStudy.clientName && (
                      <cite>— {caseStudy.clientName}</cite>
                    )}
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

            {/* CTA */}
            <div className="case-study-detail-cta">
              <h3>Ready to Start Your Project?</h3>
              <p>Let us help you achieve similar results for your business.</p>
              <div className="case-study-detail-cta-buttons">
                <Link to="/contact" className="case-study-detail-cta-button">
                  Get Started
                </Link>
                <Link to="/case-studies" className="case-study-detail-cta-button secondary">
                  View More Case Studies
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default CaseStudyDetailPage;
