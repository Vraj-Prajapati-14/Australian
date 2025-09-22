import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiExternalLink, FiGithub, FiUsers, FiCalendar, FiTarget, FiCheckCircle, FiStar, FiTrendingUp, FiShield, FiZap } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import '../styles/case-study-detail.css';

const CaseStudyDetailPage = () => {
  const { slug } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch case studies from database
  const { data: caseStudiesData, isLoading } = useQuery({ 
    queryKey: ['case-studies'], 
    queryFn: async () => (await api.get('/case-studies')).data 
  });

  const caseStudies = caseStudiesData?.data || [];

  // Enhanced static case study data matching portfolio style (fallback)
  const staticCaseStudies = {
    'mining-fleet-optimization': {
      id: 1,
      title: "Mining Fleet Optimization Project",
      subtitle: "Complete Fleet Transformation with Advanced Safety Systems",
      category: "mining",
      categoryLabel: "Mining",
      client: "Western Mining Corporation",
      duration: "4 months",
      team: "8 developers",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      heroImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
      ],
      challenge: "A leading mining company needed to modernize their aging fleet while improving safety standards and operational efficiency. Their existing vehicles were outdated, lacked proper safety systems, and had no centralized tracking or management capabilities.",
      solution: "We designed and implemented a comprehensive fleet optimization solution with custom service bodies, advanced tracking systems, and integrated safety monitoring. The solution included IoT sensors, predictive analytics, and a mobile app for field technicians.",
      results: [
        "45 vehicles upgraded with new systems",
        "35% improvement in operational efficiency", 
        "$250k in annual cost savings",
        "Zero safety incidents post-implementation",
        "50% reduction in maintenance downtime",
        "Real-time visibility into all fleet operations"
      ],
      technologies: ["Custom Service Bodies", "GPS Tracking", "Safety Monitoring", "Tool Management Systems", "IoT Sensors", "Predictive Analytics"],
      features: [
        "Custom service body design optimized for mining operations",
        "Advanced GPS tracking system with geofencing",
        "Real-time safety monitoring with automated alerts",
        "Integrated tool management with RFID tracking",
        "Automated maintenance scheduling based on usage data",
        "Predictive analytics for equipment failure prevention",
        "Mobile app for field technicians",
        "Cloud-based fleet management dashboard"
      ],
      testimonial: {
        text: "The transformation of our fleet has been remarkable. Productivity increased by 35% and maintenance costs dropped significantly. The custom service bodies and safety systems have revolutionized how we operate in the field.",
        author: "Michael Thompson",
        position: "Fleet Operations Manager",
        company: "Western Mining Corporation",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
      },
      links: {
        live: "https://mining-fleet-demo.com",
        github: "https://github.com/company/mining-fleet"
      },
      stats: {
        vehicles: "45+",
        efficiency: "35%+",
        savings: "$250K+"
      },
      process: [
        { phase: "Discovery & Analysis", description: "Analyzed existing fleet operations, identified pain points, and gathered requirements from field teams", duration: "2 weeks" },
        { phase: "Design & Planning", description: "Created custom service body designs and developed comprehensive implementation plan", duration: "3 weeks" },
        { phase: "Development & Testing", description: "Built custom service bodies, integrated tracking systems, and conducted extensive testing", duration: "8 weeks" },
        { phase: "Deployment & Training", description: "Rolled out new vehicles and provided comprehensive training to all staff", duration: "2 weeks" },
        { phase: "Monitoring & Optimization", description: "Monitored performance and made continuous improvements based on real-world usage", duration: "Ongoing" }
      ]
    },
    'emergency-services-upgrade': {
      id: 2,
      title: "Emergency Services Vehicle Upgrade",
      subtitle: "Advanced Emergency Response Fleet with Life-Saving Technology",
      category: "emergency",
      categoryLabel: "Emergency Services",
      client: "Metropolitan Emergency Services",
      duration: "3 months",
      team: "6 developers",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      heroImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
      ],
      challenge: "The emergency services department needed to upgrade their aging fleet to improve response times and enhance medical capabilities. The existing vehicles lacked modern technology and were not optimized for rapid deployment.",
      solution: "We designed and built specialized emergency response vehicles with cutting-edge technology, advanced medical equipment, and rapid deployment capabilities. Each vehicle was customized for specific emergency scenarios.",
      results: [
        "12 emergency vehicles upgraded with new technology",
        "40% improvement in response times",
        "$180k in operational cost savings",
        "Enhanced medical capabilities for critical situations",
        "Improved communication with dispatch centers",
        "Zero equipment failures during emergency responses"
      ],
      technologies: ["Emergency Lighting", "Communication Systems", "Medical Equipment", "Rapid Deployment", "GPS Navigation", "Patient Monitoring"],
      features: [
        "Advanced emergency lighting system with multiple modes",
        "Integrated communication system with dispatch coordination",
        "State-of-the-art medical equipment and supplies",
        "Rapid deployment mechanisms for quick response",
        "GPS navigation with traffic optimization",
        "Real-time patient monitoring systems",
        "Automated inventory tracking for medical supplies",
        "Weather-resistant design for all conditions"
      ],
      testimonial: {
        text: "Response times improved by 40% and our emergency teams are now better equipped than ever before. The new vehicles have saved countless lives and improved our ability to serve the community.",
        author: "Sarah Martinez",
        position: "Emergency Services Director",
        company: "Metropolitan Emergency Services",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
      },
      links: {
        live: "https://emergency-fleet-demo.com",
        github: "https://github.com/company/emergency-fleet"
      },
      stats: {
        vehicles: "12+",
        response: "40%+",
        savings: "$180K+"
      },
      process: [
        { phase: "Requirements Analysis", description: "Analyzed emergency response protocols and identified critical requirements for vehicle upgrades", duration: "2 weeks" },
        { phase: "Design & Engineering", description: "Designed specialized vehicle layouts and integrated advanced technology systems", duration: "4 weeks" },
        { phase: "Manufacturing & Integration", description: "Built custom vehicles and integrated all emergency response systems", duration: "10 weeks" },
        { phase: "Testing & Certification", description: "Conducted comprehensive testing and obtained all necessary certifications", duration: "2 weeks" },
        { phase: "Training & Deployment", description: "Trained emergency personnel and deployed vehicles to service areas", duration: "2 weeks" }
      ]
    },
    'construction-fleet-modernization': {
      id: 3,
      title: "Construction Company Fleet Modernization",
      subtitle: "Smart Construction Fleet with Integrated Management Systems",
      category: "construction",
      categoryLabel: "Construction",
      client: "Premier Construction Group",
      duration: "6 months",
      team: "8 developers",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      heroImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
      ],
      challenge: "The construction company needed to modernize their fleet to improve tool tracking, reduce losses, and enhance safety compliance. Their existing vehicles lacked proper organization and had no systematic approach to tool management.",
      solution: "We implemented a comprehensive fleet modernization solution with integrated tool management systems, GPS tracking, and safety monitoring. The solution included RFID technology and mobile apps for real-time visibility.",
      results: [
        "28 construction vehicles modernized with new systems",
        "28% improvement in operational efficiency",
        "$320k in annual cost savings",
        "90% reduction in tool loss and theft",
        "Improved safety compliance across all sites",
        "Real-time visibility into fleet and tool status"
      ],
      technologies: ["Tool Management Systems", "GPS Tracking", "Safety Monitoring", "Fleet Analytics", "RFID Technology", "Mobile Apps"],
      features: [
        "Comprehensive tool management system with RFID tracking",
        "Real-time GPS tracking for all vehicles and equipment",
        "Advanced safety monitoring with automated compliance reporting",
        "Fleet analytics dashboard for performance optimization",
        "Mobile app for field workers and supervisors",
        "Automated inventory management for tools and materials",
        "Integration with project management software",
        "Weather-resistant design for construction environments"
      ],
      testimonial: {
        text: "Our construction teams are now more efficient and organized. The integrated tool management system has been a game-changer, reducing tool loss by 90% and improving project completion times significantly.",
        author: "David Chen",
        position: "Operations Director",
        company: "Premier Construction Group",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
      },
      links: {
        live: "https://construction-fleet-demo.com",
        github: "https://github.com/company/construction-fleet"
      },
      stats: {
        vehicles: "28+",
        efficiency: "28%+",
        savings: "$320K+"
      },
      process: [
        { phase: "Site Analysis", description: "Analyzed construction sites and current fleet operations to identify improvement opportunities", duration: "2 weeks" },
        { phase: "System Design", description: "Designed integrated tool management and tracking systems for construction environments", duration: "3 weeks" },
        { phase: "Implementation", description: "Installed new systems and trained staff on new procedures and technology", duration: "6 weeks" },
        { phase: "Testing & Optimization", description: "Tested systems in real construction environments and made necessary adjustments", duration: "2 weeks" },
        { phase: "Full Deployment", description: "Rolled out systems across all construction sites and provided ongoing support", duration: "1 week" }
      ]
    }
  };

  // Find case study from database or fallback to static data
  const caseStudy = caseStudies.find(study => study.slug === slug) || staticCaseStudies[slug];

  // Show loading state
  if (isLoading) {
    return (
      <div className="case-study-detail">
        <div className="container">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading case study...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div className="case-study-detail">
        <div className="container">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Case Study Not Found</h1>
            <p className="text-gray-600 mb-8">The case study you're looking for doesn't exist.</p>
            <Link to="/case-studies" className="btn btn-primary">
              <FiArrowLeft className="mr-2" /> Back to Case Studies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Handle images - use database images or fallback to hero image
  const images = caseStudy.images || 
                 (caseStudy.gallery && caseStudy.gallery.length > 0 ? caseStudy.gallery.map(img => img.url || img) : []) ||
                 (caseStudy.heroImage ? [caseStudy.heroImage.url || caseStudy.heroImage] : []) ||
                 [caseStudy.image || '/api/placeholder/800/600'];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="case-study-detail">
      <Helmet>
        <title>{caseStudy.title} - Case Study</title>
        <meta name="description" content={caseStudy.subtitle} />
      </Helmet>

      {/* Hero Section */}
      <section className="case-study-detail-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="case-study-detail-content"
          >
            <Link to="/case-studies" className="back-link">
              <FiArrowLeft className="mr-2" />
              Back to Case Studies
            </Link>

            <span className="project-category-badge">
              {caseStudy.categoryLabel || caseStudy.category || caseStudy.department?.name || caseStudy.service?.name || 'Project'}
            </span>

            <h1 className="case-studies-hero-title">{caseStudy.title}</h1>
            <p className="case-studies-hero-subtitle">{caseStudy.subtitle || caseStudy.shortDescription || caseStudy.description}</p>

            {/* Project Stats */}
            <div className="project-stats-grid">
              <div className="project-stat-item">
                <div className="project-stat-icon">🚛</div>
                <div className="project-stat-label">Vehicles</div>
                <div className="project-stat-value">{caseStudy.stats?.vehicles || caseStudy.results?.vehiclesUpgraded || caseStudy.projectStats?.stat1?.value || 'N/A'}</div>
              </div>
              <div className="project-stat-item">
                <div className="project-stat-icon">💰</div>
                <div className="project-stat-label">Savings</div>
                <div className="project-stat-value">{caseStudy.stats?.savings || caseStudy.results?.costSavings || caseStudy.projectStats?.stat2?.value || 'N/A'}</div>
              </div>
              <div className="project-stat-item">
                <div className="project-stat-icon">📈</div>
                <div className="project-stat-label">Efficiency</div>
                <div className="project-stat-value">{caseStudy.stats?.efficiency || caseStudy.results?.efficiencyImprovement || caseStudy.projectStats?.stat3?.value || 'N/A'}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="case-studies-grid">
        <div className="case-study-detail-content">
          {/* Main Content - Centered */}
          <div className="case-study-detail-main">
              {/* Image Gallery */}
              <div className="case-study-gallery">
                <div className="case-study-carousel">
                  <div className="case-study-carousel-main">
                    <img
                      src={images[currentImageIndex]}
                      alt={caseStudy.title}
                      className="case-study-carousel-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white" style={{ display: 'none' }}>
                      <div className="text-center">
                        <h3 className="text-2xl font-bold mb-2">{caseStudy.title}</h3>
                        <p className="opacity-90">{caseStudy.subtitle || caseStudy.shortDescription}</p>
                      </div>
                    </div>
                    
                    {images.length > 1 && (
                      <>
                        <button className="case-study-carousel-nav prev" onClick={prevImage}>
                          <div className="case-study-carousel-nav-icon"></div>
                          <span className="sr-only">Previous image</span>
                        </button>
                        <button className="case-study-carousel-nav next" onClick={nextImage}>
                          <div className="case-study-carousel-nav-icon"></div>
                          <span className="sr-only">Next image</span>
                        </button>
                      </>
                    )}
                  </div>

                  {images.length > 1 && (
                    <div className="case-study-carousel-indicators">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          className={`case-study-carousel-indicator ${index === currentImageIndex ? 'active' : ''}`}
                          onClick={() => goToImage(index)}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Project Overview */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="project-overview"
              >
                <h2>The Challenge</h2>
                <p>{caseStudy.challenge || caseStudy.challenges || caseStudy.description || 'No challenge description available.'}</p>
              </motion.div>

              {/* Solution */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="content-section"
              >
                <h2>Our Solution</h2>
                <p>{caseStudy.solution || caseStudy.solutions || caseStudy.description || 'No solution description available.'}</p>
              </motion.div>

              {/* Technologies */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="technologies-section"
              >
                <h3>Technologies Used</h3>
                <div className="technologies-grid">
                  {(caseStudy.technologies || caseStudy.tags || []).map((tech, index) => (
                    <div key={index} className="technology-tag">
                      {typeof tech === 'string' ? tech : (tech?.name || tech?.title || 'Technology')}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Key Features */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="key-features-section"
              >
                <h3>Key Features</h3>
                <div className="key-features-list">
                  {(caseStudy.features || caseStudy.keyFeatures || caseStudy.tags || []).map((feature, index) => (
                    <div key={index} className="key-feature-item">
                      <div className="key-feature-icon">
                        <FiCheckCircle />
                      </div>
                      <div className="key-feature-text">{typeof feature === 'string' ? feature : (feature?.name || feature?.title || 'Feature')}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Development Process */}
              {(caseStudy.process || caseStudy.developmentProcess) && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="development-process-section"
                >
                  <h3>Development Process</h3>
                  <div className="process-steps">
                    {(caseStudy.process || caseStudy.developmentProcess || []).map((phase, index) => (
                      <div key={index} className="process-step">
                        <div className="process-step-number">{index + 1}</div>
                        <div className="process-step-title">{phase.phase || phase.title}</div>
                        <div className="process-step-description">{phase.description}</div>
                        <div className="process-step-duration">{phase.duration}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Key Results */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="key-results-section"
              >
                <h3>
                  <FiTrendingUp className="mr-2" />
                  Key Results
                </h3>
                <div className="key-results-carousel">
                  <div className="key-results-track">
                    <div className="key-results-grid">
                      {(caseStudy.resultsArray || caseStudy.results?.customResults || []).map((result, index) => (
                        <div key={index} className="key-result-item">
                          <div className="key-result-header">
                            <div className="key-result-icon">
                              <FiTrendingUp />
                            </div>
                            <div className="key-result-title">Result {index + 1}</div>
                          </div>
                          <div className="key-result-description">{typeof result === 'string' ? result : (result?.label || result?.value || 'Result')}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Testimonial */}
              {(caseStudy.testimonialObject || (caseStudy.testimonial && typeof caseStudy.testimonial === 'string')) && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="case-study-detail-testimonial"
                >
                  <div className="testimonial-rating">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="testimonial-star">
                        <FiStar />
                      </div>
                    ))}
                  </div>
                  <blockquote>"{caseStudy.testimonialObject?.text || (typeof caseStudy.testimonial === 'string' ? caseStudy.testimonial : '')}"</blockquote>
                  <div className="testimonial-header">
                    <div className="testimonial-avatar">
                      <img src={caseStudy.testimonialObject?.avatar || '/api/placeholder/50/50'} alt={caseStudy.testimonialObject?.author || 'Client'} />
                    </div>
                    <div className="testimonial-info">
                      <div className="testimonial-name">{caseStudy.testimonialObject?.author || caseStudy.clientName || 'Client'}</div>
                      <div className="testimonial-position">{caseStudy.testimonialObject?.position || caseStudy.clientPosition || 'Client'}</div>
                      <div className="testimonial-company">{caseStudy.testimonialObject?.company || caseStudy.clientCompany || caseStudy.client || 'Client Company'}</div>
                    </div>
                  </div>
                </motion.div>
              )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="case-study-detail-cta">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="cta-content"
          >
            <h2 className="cta-title">Ready to Start Your Project?</h2>
            <p className="cta-subtitle">
              Let's discuss how we can help you achieve similar results for your business. Our team is ready to turn your vision into reality.
            </p>
            <div className="case-study-detail-cta-buttons">
              <Link to="/contact" className="cta-button-primary">
                Get Free Consultation
              </Link>
              <Link to="/case-studies" className="cta-button-secondary">
                View More Projects
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudyDetailPage;