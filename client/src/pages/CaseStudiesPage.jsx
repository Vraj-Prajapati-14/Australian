import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import { Container, Button } from '../components/ui';
import { useThemeSettings } from '../hooks/useThemeSettings';
import '../styles/case-studies-page.css';

const CaseStudiesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const settings = useThemeSettings();

  // Fetch case studies from database
  const { data: caseStudiesData, isLoading: caseStudiesLoading } = useQuery({ 
    queryKey: ['case-studies'], 
    queryFn: async () => (await api.get('/case-studies')).data 
  });

  // Fetch departments for filtering
  const { data: departmentsData, isLoading: departmentsLoading } = useQuery({ 
    queryKey: ['departments'], 
    queryFn: async () => (await api.get('/departments')).data 
  });

  const caseStudies = caseStudiesData?.data || [];
  const departments = departmentsData?.data || [];
  const general = settings?.general || {};

  // Static case study data for demonstration
  const staticCaseStudies = [
    {
      _id: 'static-1',
      title: 'Mining Fleet Optimization Project',
      shortDescription: 'Complete transformation of a mining company\'s vehicle fleet with custom service bodies and advanced safety systems.',
      description: 'We helped a leading mining company optimize their fleet operations by implementing custom service bodies, advanced safety systems, and integrated tool management solutions.',
      clientName: 'Western Mining Corporation',
      completionDate: '2023-08-15',
      status: 'completed',
      service: 'Fleet Management',
      department: 'Mining',
      tags: ['Mining', 'Fleet Management', 'Safety Systems', 'Custom Design'],
      heroImage: { url: '/api/placeholder/600/400' },
      slug: 'mining-fleet-optimization',
      results: {
        vehiclesUpgraded: 45,
        costSavings: 250,
        efficiencyImprovement: 35
      },
      testimonial: 'The transformation of our fleet has been remarkable. Productivity increased by 35% and maintenance costs dropped significantly.',
      technologies: ['Custom Service Bodies', 'GPS Tracking', 'Safety Monitoring', 'Tool Management Systems']
    },
    {
      _id: 'static-2',
      title: 'Emergency Services Vehicle Upgrade',
      shortDescription: 'Specialized emergency response vehicles equipped with cutting-edge technology and rapid deployment capabilities.',
      description: 'Designed and implemented specialized emergency response vehicles for a major city\'s emergency services department.',
      clientName: 'Metropolitan Emergency Services',
      completionDate: '2023-06-20',
      status: 'completed',
      service: 'Emergency Vehicles',
      department: 'Emergency Services',
      tags: ['Emergency Services', 'Rapid Deployment', 'Specialized Equipment', 'Public Safety'],
      heroImage: { url: '/api/placeholder/600/400' },
      slug: 'emergency-services-upgrade',
      results: {
        vehiclesUpgraded: 12,
        costSavings: 180,
        efficiencyImprovement: 40
      },
      testimonial: 'Response times improved by 40% and our emergency teams are now better equipped than ever before.',
      technologies: ['Emergency Lighting', 'Communication Systems', 'Medical Equipment', 'Rapid Deployment']
    },
    {
      _id: 'static-3',
      title: 'Construction Company Fleet Modernization',
      shortDescription: 'Complete fleet modernization for a major construction company with integrated tool management and safety systems.',
      description: 'Modernized the entire fleet of a major construction company with state-of-the-art service bodies and integrated management systems.',
      clientName: 'Premier Construction Group',
      completionDate: '2023-04-10',
      status: 'completed',
      service: 'Construction Fleet',
      department: 'Construction',
      tags: ['Construction', 'Fleet Modernization', 'Tool Management', 'Safety Systems'],
      heroImage: { url: '/api/placeholder/600/400' },
      slug: 'construction-fleet-modernization',
      results: {
        vehiclesUpgraded: 28,
        costSavings: 320,
        efficiencyImprovement: 28
      },
      testimonial: 'Our construction teams are now more efficient and organized. The integrated tool management system has been a game-changer.',
      technologies: ['Tool Management Systems', 'GPS Tracking', 'Safety Monitoring', 'Fleet Analytics']
    },
    {
      _id: 'static-4',
      title: 'Telecommunications Infrastructure Support',
      shortDescription: 'Specialized vehicles for telecommunications infrastructure maintenance and installation across remote areas.',
      description: 'Developed specialized vehicles for telecommunications infrastructure maintenance and installation in remote and challenging environments.',
      clientName: 'National Telecom Services',
      completionDate: '2023-02-28',
      status: 'completed',
      service: 'Telecommunications',
      department: 'Telecommunications',
      tags: ['Telecommunications', 'Remote Access', 'Infrastructure', 'Specialized Equipment'],
      heroImage: { url: '/api/placeholder/600/400' },
      slug: 'telecom-infrastructure-support',
      results: {
        vehiclesUpgraded: 18,
        costSavings: 200,
        efficiencyImprovement: 32
      },
      testimonial: 'These specialized vehicles have enabled us to reach remote areas that were previously inaccessible.',
      technologies: ['Specialized Equipment', 'Remote Access Systems', 'Communication Tools', 'Safety Equipment']
    },
    {
      _id: 'static-5',
      title: 'Agricultural Equipment Service Fleet',
      shortDescription: 'Custom agricultural service vehicles designed for farm equipment maintenance and field operations.',
      description: 'Created custom agricultural service vehicles for a large farming operation, enabling efficient equipment maintenance and field operations.',
      clientName: 'Golden Plains Agriculture',
      completionDate: '2023-01-15',
      status: 'completed',
      service: 'Agricultural Services',
      department: 'Agriculture',
      tags: ['Agriculture', 'Farm Equipment', 'Field Operations', 'Custom Design'],
      heroImage: { url: '/api/placeholder/600/400' },
      slug: 'agricultural-service-fleet',
      results: {
        vehiclesUpgraded: 22,
        costSavings: 280,
        efficiencyImprovement: 25
      },
      testimonial: 'Our field operations are now more efficient and our equipment maintenance has never been better organized.',
      technologies: ['Agricultural Tools', 'Field Equipment', 'Maintenance Systems', 'Custom Storage']
    },
    {
      _id: 'static-6',
      title: 'Utilities Maintenance Fleet Enhancement',
      shortDescription: 'Enhanced utility maintenance vehicles with advanced safety systems and specialized equipment for power line maintenance.',
      description: 'Enhanced utility maintenance vehicles with advanced safety systems and specialized equipment for power line and infrastructure maintenance.',
      clientName: 'Regional Power Utilities',
      completionDate: '2022-11-30',
      status: 'completed',
      service: 'Utilities Maintenance',
      department: 'Utilities',
      tags: ['Utilities', 'Power Lines', 'Safety Systems', 'Infrastructure'],
      heroImage: { url: '/api/placeholder/600/400' },
      slug: 'utilities-maintenance-enhancement',
      results: {
        vehiclesUpgraded: 15,
        costSavings: 220,
        efficiencyImprovement: 30
      },
      testimonial: 'Safety improvements and efficiency gains have been outstanding. Our maintenance teams are now better protected and more productive.',
      technologies: ['Safety Systems', 'Specialized Tools', 'Power Equipment', 'Communication Systems']
    }
  ];

  // Combine database and static case studies
  const allCaseStudies = [...caseStudies, ...staticCaseStudies];

  // Filter case studies based on selected department and search query
  const filteredCaseStudies = allCaseStudies.filter(study => {
    // Filter by category
    let categoryMatch = true;
    if (selectedCategory !== 'all') {
      if (study.department) {
        if (typeof study.department === 'object') {
          categoryMatch = study.department.name?.toLowerCase() === selectedCategory.toLowerCase();
        } else {
          categoryMatch = study.department.toLowerCase() === selectedCategory.toLowerCase();
        }
      } else {
        categoryMatch = false;
      }
    }

    // Filter by search query
    let searchMatch = true;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      searchMatch = 
        study.title?.toLowerCase().includes(query) ||
        study.description?.toLowerCase().includes(query) ||
        study.shortDescription?.toLowerCase().includes(query) ||
        study.clientName?.toLowerCase().includes(query) ||
        study.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        study.service?.toLowerCase().includes(query);
    }

    return categoryMatch && searchMatch;
  });

  // Get departments for filter buttons
  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'mining', name: 'Mining' },
    { id: 'emergency services', name: 'Emergency Services' },
    { id: 'construction', name: 'Construction' },
    { id: 'telecommunications', name: 'Telecommunications' },
    { id: 'agriculture', name: 'Agriculture' },
    { id: 'utilities', name: 'Utilities' },
    ...departments.map(dept => ({
      id: dept.name?.toLowerCase().replace(/\s+/g, '-') || dept.slug,
      name: dept.name || 'Department'
    }))
  ];

  if (caseStudiesLoading || departmentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Case Studies & Success Stories - {general.siteName || general.companyName || 'Australian Engineering Solutions'}</title>
        <meta name="description" content={`See how leading fleet managers & trade businesses make certain with ${general.siteName || general.companyName || 'Australian Engineering Solutions'}. Real success stories from real customers.`} />
      </Helmet>

      {/* Hero Section */}
      <section className="case-studies-hero">
        <Container>
          <div className="case-studies-hero-content">
            <h1 className="case-studies-hero-title">
              Case Studies & Success Stories
            </h1>
            <p className="case-studies-hero-subtitle">
              See how leading fleet managers & trade businesses make certain with {general.siteName || general.companyName || 'Australian Engineering Solutions'}
            </p>
            
            {/* Search Bar */}
            <div className="case-studies-search-container">
              <div className="case-studies-search-bar">
                <input
                  type="text"
                  placeholder="Search case studies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="case-studies-search-input"
                />
                <div className="case-studies-search-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Filter Navigation */}
      <section className="case-studies-filters">
        <Container>
          <div className="filters-nav">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`filter-button ${selectedCategory === category.id ? 'active' : ''}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Case Studies Grid */}
      <section className="case-studies-grid">
        <Container>
          {filteredCaseStudies.length > 0 ? (
            <div className="case-studies-list">
              {filteredCaseStudies.map((study) => (
                <div key={study._id} className="case-study-card">
                  <div className="case-study-image">
                    <img 
                      src={study.heroImage?.url || '/placeholder-case-study.jpg'} 
                      alt={study.title}
                    />
                    <div className={`case-study-status ${study.status || 'completed'}`}>
                      {study.status === 'completed' ? 'Completed' : 
                       study.status === 'in-progress' ? 'In Progress' : 
                       study.status === 'draft' ? 'Draft' : 'Completed'}
                    </div>
                  </div>
                  
                  <div className="case-study-content">
                    <div className="case-study-meta">
                      <span className="icon"></span>
                      <span>{study.clientName || 'Client Location'}</span>
                      <span>•</span>
                      <span className="calendar-icon"></span>
                      <span>{new Date(study.completionDate || study.createdAt).getFullYear()}</span>
                    </div>
                    
                    <h3 className="case-study-title">
                      {study.title}
                    </h3>
                    
                    <p className="case-study-description">
                      {study.shortDescription || study.description || 'A comprehensive case study showcasing our expertise and successful project delivery.'}
                    </p>
                    
                    <div className="case-study-tags">
                      {study.tags && study.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="case-study-tag">
                          {tag}
                        </span>
                      ))}
                      {study.service && (
                        <span className="case-study-tag">
                          {typeof study.service === 'object' ? study.service.title : study.service}
                        </span>
                      )}
                    </div>
                    
                    <Link to={`/case-studies/${study.slug}`} className="case-study-button">
                      View Details
                      <span className="arrow-icon"></span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="case-studies-empty">
              <div className="case-studies-empty-icon">📋</div>
              <h3 className="case-studies-empty-title">No Case Studies Found</h3>
              <p className="case-studies-empty-text">
                No case studies match the selected category. Try selecting a different filter or check back later for new content.
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* CTA Section - Using exact same structure as HomePage and AboutPage */}
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
              <Link to="/services">
                <Button variant="outline" size="lg" className="cta-button-secondary">
                  View Services
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default CaseStudiesPage; 