import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui';
import '../styles/case-studies-page.css';

const CaseStudiesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  // Filter case studies based on selected department
  const filteredCaseStudies = caseStudies.filter(study => {
    if (selectedCategory === 'all') return true;
    
    // Filter by department
    if (study.department && typeof study.department === 'object') {
      return study.department.name?.toLowerCase() === selectedCategory.toLowerCase();
    }
    return false;
  });

  // Get departments for filter buttons
  const categories = [
    { id: 'all', name: 'All Projects' },
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
        <title>Case Studies & Success Stories - Australian Equipment Solutions</title>
        <meta name="description" content="See how leading fleet managers & trade businesses make certain with Australian Equipment Solutions. Real success stories from real customers." />
      </Helmet>

      {/* Hero Section */}
      <section className="case-studies-hero">
        <Container>
          <div className="case-studies-hero-content">
            <h1 className="case-studies-hero-title">
              Case Studies & Success Stories
            </h1>
            <p className="case-studies-hero-subtitle">
              See how leading fleet managers & trade businesses make certain with Australian Equipment Solutions
            </p>
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
    </>
  );
};

export default CaseStudiesPage; 