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
      if (serviceTitle.includes('hvac') || serviceTitle.includes('building')) return '⚙️';
      if (serviceTitle.includes('mechanical') || serviceTitle.includes('design')) return '🔧';
      if (serviceTitle.includes('engineering')) return '📐';
      if (serviceTitle.includes('construction')) return '🏗️';
      if (serviceTitle.includes('electrical')) return '⚡';
      if (serviceTitle.includes('plumbing')) return '🔩';
      if (serviceTitle.includes('maintenance')) return '🛠️';
      if (serviceTitle.includes('consulting')) return '📊';
      return '⚙️'; // Default for services
    }
    
    if (item.department) {
      const deptName = item.department.name?.toLowerCase() || '';
      if (deptName.includes('government') || deptName.includes('municipal')) return '🏛️';
      if (deptName.includes('emergency') || deptName.includes('fire') || deptName.includes('police')) return '🚨';
      if (deptName.includes('health') || deptName.includes('medical')) return '🏥';
      if (deptName.includes('education') || deptName.includes('school')) return '🎓';
      if (deptName.includes('transport') || deptName.includes('logistics')) return '📦';
      if (deptName.includes('engineering')) return '📐';
      return '🏢'; // Default for departments
    }
    
    return '⚙️'; // Ultimate fallback
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
      <div className="inspiration-hero">
        <div className="hero-content">
          <div className="inspiration-tag">
            🇦🇺 Australian Engineering Excellence
          </div>
          <h1 className="hero-title">Inspiration Gallery</h1>
          <p className="hero-subtitle">
            Discover how we transform vehicles into mobile workspaces. Browse our collection of successful builds and get inspired for your next project.
          </p>
        </div>
      </div>

       {/* Filters - Service-based Pills */}
       <div className="inspiration-filters">
         <div className="filter-container">
           <div className="filter-pills">
             <button
               className={`filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
               onClick={() => setSelectedCategory('all')}
             >
               All Projects
             </button>
             {services.slice(0, 6).map((service) => (
               <button
                 key={service._id}
                 className={`filter-pill ${selectedCategory === `service_${service._id}` ? 'active' : ''}`}
                 onClick={() => setSelectedCategory(`service_${service._id}`)}
               >
                 {service.title}
               </button>
             ))}
           </div>
           
           <div className="search-container">
             <div className="search-icon">🔍</div>
             <input
               type="text"
               placeholder="Search case studies..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="search-input"
             />
           </div>
         </div>
       </div>

      {/* Gallery Grid */}
      <div className="inspiration-gallery-main">
        {/* <div className="inspiration-gallery-header">
          <h2>Inspiration Gallery</h2>
          <p>Showing {filteredItems.length} items</p>
        </div> */}
        
        {isLoading ? (
          <div className="gallery-loading">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className={`inspiration-gallery-grid ${filteredItems.length === 1 ? 'single-item' : filteredItems.length === 2 ? 'two-items' : 'multiple-items'}`}>
             {filteredItems.map((item) => (
               <div key={item._id} className="inspiration-gallery-card" onClick={() => handleImageClick(item)}>
                 <div className="inspiration-gallery-card-image">
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
                 </div>
                 
                 <div className="inspiration-gallery-card-content">
                   <h3 className="inspiration-gallery-card-title">{item.title}</h3>
                   <p className="inspiration-gallery-card-description">
                     {item.description}
                   </p>
                   
                   {item.tags && item.tags.length > 0 && (
                     <div className="inspiration-gallery-card-tags">
                       {item.tags.slice(0, 2).map((tag, index) => (
                         <span key={index} className="gallery-tag">
                           {tag}
                         </span>
                       ))}
                     </div>
                   )}
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>

      {/* Browse by Category - All Services with Carousel */}
      <section className="inspiration-categories-section">
        <div className="inspiration-gallery-header">
          <h2>Browse by Category</h2>
          <p>Find inspiration for your specific needs</p>
        </div>
        
        <div className="inspiration-categories-grid">
          {services.length > 0 ? (
            services.map((service) => (
              <div key={service._id} className="inspiration-category-card">
                <div className="category-icon-wrapper">
                  <div className="category-icon">
                    {getCategoryIcon({ service })}
                  </div>
                </div>
                <div className="category-content">
                  <h3 className="category-title">{service.title}</h3>
                  <p className="category-description">
                    {service.description || `Professional ${service.title.toLowerCase()} solutions designed for maximum efficiency and performance.`}
                  </p>
                  <a href={`/services/${service.slug || service._id}`} className="category-btn">
                    LEARN MORE <span className="arrow-icon">→</span>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="inspiration-category-card">
              <div className="category-icon-wrapper">
                <div className="category-icon">
                  🔧
                </div>
              </div>
              <div className="category-content">
                <h3 className="category-title">Our Services</h3>
                <p className="category-description">
                  Professional engineering solutions designed for maximum efficiency and performance.
                </p>
                <a href="/services" className="category-btn">
                  LEARN MORE <span className="arrow-icon">→</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <div className="inspiration-cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-subtitle">
            Contact us today for a free consultation and quote
          </p>
          <div className="cta-buttons">
            <Link to="/contact" className="cta-button-primary">
              CONTACT US
            </Link>
            <Link to="/services" className="cta-button-secondary">
              VIEW SERVICES
            </Link>
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