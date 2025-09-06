import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import { Container, Section, Button, Card, Badge, Input } from '../components/ui';
import '../styles/inspiration-gallery.css';

const InspirationGalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Fetch inspiration data
  const { data: inspirationItems = [], isLoading } = useQuery({
    queryKey: ['inspiration-published', selectedCategory, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        // Handle new category format
        if (selectedCategory.startsWith('service_')) {
          const serviceId = selectedCategory.replace('service_', '');
          params.append('service', serviceId);
        } else if (selectedCategory.startsWith('department_')) {
          const departmentId = selectedCategory.replace('department_', '');
          params.append('department', departmentId);
        } else {
          // Fallback for old category format
          params.append('category', selectedCategory);
        }
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await api.get(`/inspiration/published?${params.toString()}`);
      return response.data?.data || [];
    }
  });

  // Fetch services for dynamic categories
  const { data: services = [] } = useQuery({
    queryKey: ['main-services'],
    queryFn: async () => {
      try {
        const response = await api.get('/services?type=main&status=active');
        return response.data || [];
      } catch (error) {
        console.error('Error fetching services:', error);
        return [];
      }
    }
  });

  // Fetch departments for dynamic categories
  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      try {
        const response = await api.get('/departments');
        return response.data || [];
      } catch (error) {
        console.error('Error fetching departments:', error);
        return [];
      }
    }
  });

  // Create dynamic categories from database
  const categories = React.useMemo(() => {
    const categoryList = [{ value: 'all', label: 'All Categories' }];
    
    // Add services as categories
    services.forEach(service => {
      if (service.status === 'active') {
        categoryList.push({
          value: `service_${service._id}`,
          label: service.title,
          type: 'service',
          data: service
        });
      }
    });
    
    // Add departments as categories
    departments.forEach(department => {
      if (department.status === 'active') {
        categoryList.push({
          value: `department_${department._id}`,
          label: department.name,
          type: 'department',
          data: department
        });
      }
    });
    
    return categoryList;
  }, [services, departments]);

  // Filtering is now handled by the API
  const filteredItems = inspirationItems;

  const getCategoryIcon = (item) => {
    // Check if item has service or department data
    if (item.service) {
      const serviceTitle = item.service.title?.toLowerCase() || '';
      if (serviceTitle.includes('ute') || serviceTitle.includes('pickup')) return '🚗';
      if (serviceTitle.includes('trailer')) return '🚛';
      if (serviceTitle.includes('truck')) return '🚚';
      if (serviceTitle.includes('fleet')) return '🏢';
      if (serviceTitle.includes('van')) return '🚐';
      if (serviceTitle.includes('bus')) return '🚌';
      return '🚗'; // Default for services
    }
    
    if (item.department) {
      const deptName = item.department.name?.toLowerCase() || '';
      if (deptName.includes('government') || deptName.includes('municipal')) return '🏛️';
      if (deptName.includes('emergency') || deptName.includes('fire') || deptName.includes('police')) return '🚨';
      if (deptName.includes('health') || deptName.includes('medical')) return '🏥';
      if (deptName.includes('education') || deptName.includes('school')) return '🎓';
      if (deptName.includes('transport') || deptName.includes('logistics')) return '🚛';
      return '🏢'; // Default for departments
    }
    
    return '🚗'; // Ultimate fallback
  };

  const getCategoryColor = (item) => {
    // Check if item has service or department data
    if (item.service) {
      const serviceTitle = item.service.title?.toLowerCase() || '';
      if (serviceTitle.includes('ute') || serviceTitle.includes('pickup')) return 'primary';
      if (serviceTitle.includes('trailer')) return 'success';
      if (serviceTitle.includes('truck')) return 'warning';
      if (serviceTitle.includes('fleet')) return 'info';
      if (serviceTitle.includes('van')) return 'accent';
      if (serviceTitle.includes('bus')) return 'secondary';
      return 'primary'; // Default for services
    }
    
    if (item.department) {
      const deptName = item.department.name?.toLowerCase() || '';
      if (deptName.includes('government') || deptName.includes('municipal')) return 'secondary';
      if (deptName.includes('emergency') || deptName.includes('fire') || deptName.includes('police')) return 'error';
      if (deptName.includes('health') || deptName.includes('medical')) return 'success';
      if (deptName.includes('education') || deptName.includes('school')) return 'info';
      if (deptName.includes('transport') || deptName.includes('logistics')) return 'warning';
      return 'primary'; // Default for departments
    }
    
    return 'primary'; // Ultimate fallback
  };

  // Interactive functions
  const handleImageClick = (item) => {
    setSelectedImage(item);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
  };


  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  };

  // Add keyboard event listener
  React.useEffect(() => {
    if (isLightboxOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isLightboxOpen]);

  return (
    <>
      <Helmet>
        <title>Inspiration Gallery - Australian Equipment Solutions</title>
        <meta name="description" content="Discover how HIDRIVE transforms vehicles into mobile workspaces. Browse our collection of successful builds and get inspired for your next project." />
      </Helmet>

      {/* Hero Section */}
      <div className="gallery-hero">
        <div className="gallery-hero-content">
          <h1>Inspiration Gallery</h1>
          <p>
            Discover how HIDRIVE transforms vehicles into mobile workspaces. Browse our collection of successful builds and get inspired for your next project.
          </p>
          <Button variant="secondary" size="lg" as={Link} to="/contact" className="btn">
            Get Quote
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="gallery-filters">
        <div className="filter-container">
          <div className="filter-grid">
            <div className="filter-select">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="search-container">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                placeholder="Search inspiration gallery..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="gallery-main">
        <div className="gallery-header">
          <h2>Inspiration Gallery</h2>
          <p>Showing {filteredItems.length} items</p>
        </div>
        
        {isLoading ? (
          <div className="gallery-loading">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="gallery-grid">
            {filteredItems.map((item) => (
              <div key={item._id} className="gallery-card">
                <div className="gallery-card-image">
                  {item.image && item.image.url ? (
                    <img
                      src={item.image.url}
                      alt={item.image.alt || item.title}
                    />
                  ) : (
                    <div className="placeholder-image">
                      <span>{getCategoryIcon(item.category)}</span>
                    </div>
                  )}
                  
                  <div className="gallery-card-overlay">
                    <div className="overlay-content">
                      <h3 className="overlay-title">{item.title}</h3>
                      <div className="overlay-actions">
                        <a href="#" className="overlay-btn">View Details</a>
                        <a href="#" className="overlay-btn">Get Quote</a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="gallery-card-actions">
                    <button 
                      className="action-btn" 
                      title="View Details"
                      onClick={() => handleImageClick(item)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="gallery-card-content">
                  <h3 className="gallery-card-title">{item.title}</h3>
                  <p className="gallery-card-description">
                    {item.description}
                  </p>
                  
                  <div className="gallery-card-tags">
                    {item.tags?.map((tag, index) => (
                      <span key={index} className="gallery-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="gallery-card-footer">
                    <a href="#" className="gallery-card-btn gallery-card-btn-primary">
                      View Project
                    </a>
                    <a href="#" className="gallery-card-btn gallery-card-btn-secondary">
                      Get Quote
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Categories Showcase */}
      <div className="categories-showcase">
        <div className="gallery-header">
          <h2>Browse by Category</h2>
          <p>Find inspiration for your specific needs</p>
        </div>
        
        <div className="categories-grid">
          {services.slice(0, 6).map((service) => (
            <div key={service._id} className="category-card">
              <div className={`category-icon category-${getCategoryColor({ service })}`}>
                {getCategoryIcon({ service })}
              </div>
              <div className="category-content">
                <h3 className="category-title">{service.title}</h3>
                <p className="category-description">
                  {service.description || `Professional ${service.title.toLowerCase()} solutions designed for maximum efficiency and performance.`}
                </p>
                <Button 
                  variant="primary" 
                  as={Link} 
                  to={`/services/${service.slug || service._id}`} 
                  className="btn"
                >
                  Explore {service.title}
                </Button>
              </div>
            </div>
          ))}
          
          {departments.slice(0, 3).map((department) => (
            <div key={department._id} className="category-card">
              <div className={`category-icon category-${getCategoryColor({ department })}`}>
                {getCategoryIcon({ department })}
              </div>
              <div className="category-content">
                <h3 className="category-title">{department.name}</h3>
                <p className="category-description">
                  {department.description || `Specialized solutions for ${department.name.toLowerCase()} sector requirements.`}
                </p>
                <Button 
                  variant="primary" 
                  as={Link} 
                  to={`/departments/${department.slug || department._id}`} 
                  className="btn"
                >
                  Explore {department.name}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="gallery-cta">
        <div className="cta-content">
          <h2>Ready to Create Your Perfect Mobile Workspace?</h2>
          <p>
            Get inspired by our gallery and start building your custom solution today.
          </p>
          <div className="cta-buttons">
            <Button variant="secondary" size="lg" as={Link} to="/contact" className="btn">
              Get Quote
            </Button>
            <Button variant="outline" size="lg" as={Link} to="/case-studies" className="btn">
              View Case Studies
            </Button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && selectedImage && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              ✕
            </button>
            <div className="lightbox-image">
              {selectedImage.image && selectedImage.image.url ? (
                <img
                  src={selectedImage.image.url}
                  alt={selectedImage.image.alt || selectedImage.title}
                />
              ) : (
                <div className="lightbox-placeholder">
                  <span>{getCategoryIcon(selectedImage.category)}</span>
                </div>
              )}
            </div>
            <div className="lightbox-info">
              <h3>{selectedImage.title}</h3>
              <p>{selectedImage.description}</p>
              {selectedImage.tags && selectedImage.tags.length > 0 && (
                <div className="lightbox-tags">
                  {selectedImage.tags.map((tag, index) => (
                    <span key={index} className="lightbox-tag">{tag}</span>
                  ))}
                </div>
              )}
              <div className="lightbox-actions">
                <Button variant="primary" as={Link} to="/contact">
                  Get Quote
                </Button>
                <Button variant="outline" as={Link} to="/case-studies">
                  View Case Studies
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InspirationGalleryPage; 