import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Button, Container } from './ui';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expandedService, setExpandedService] = useState(null);
  const location = useLocation();

  // Fetch settings data
  const { data: settings = {} } = useQuery({ 
    queryKey: ['settings'], 
    queryFn: async () => {
      const response = await api.get('/settings');
      return response.data || {};
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch main services with their sub-services
  const { data: mainServices = [] } = useQuery({ 
    queryKey: ['mainServices'], 
    queryFn: async () => (await api.get('/services/main')).data || []
  });

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Extract settings data
  const general = settings.general || {};
  const contact = settings.contact || {};

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
    setExpandedService(null);
  };

  const handleServiceClick = (serviceSlug, event) => {
    event.preventDefault();
    if (expandedService === serviceSlug) {
      setExpandedService(null);
    } else {
      setExpandedService(serviceSlug);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        {/* Logo */}
        <Link to="/" className="header-logo">
          {general.companyName || 'Australian Automotive'}
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav">
          {/* Home */}
          <Link
            to="/"
            className={`header-nav-item ${isActive('/') ? 'active' : ''}`}
          >
            HOME
          </Link>

          {/* About */}
          <Link
            to="/about"
            className={`header-nav-item ${isActive('/about') ? 'active' : ''}`}
          >
            ABOUT
          </Link>

          {/* Case Studies */}
          <Link
            to="/case-studies"
            className={`header-nav-item ${isActive('/case-studies') ? 'active' : ''}`}
          >
            CASE STUDIES
          </Link>

          {/* Inspiration Gallery */}
          <Link
            to="/inspiration-gallery"
            className={`header-nav-item ${isActive('/inspiration-gallery') ? 'active' : ''}`}
          >
            INSPIRATION GALLERY
          </Link>

          {/* Services Dropdown */}
          <div className="dropdown">
            <button className="header-nav-item flex items-center">
              SERVICES
              <svg className="w-1.5 h-1.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 1.5 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="dropdown-menu">
              {mainServices.map((service) => {
                const subServices = service.subServices || [];
                const isExpanded = expandedService === service.slug;
                
                return (
                  <div key={service.slug} className="service-group">
                    {/* Main Service - Clickable to expand */}
                    <button
                      onClick={(e) => handleServiceClick(service.slug, e)}
                      className="dropdown-item main-service expandable"
                    >
                      <span>{service.title}</span>
                                                {subServices.length > 0 && (
                            <svg 
                              className={`w-1 h-1 ml-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              style={{ strokeWidth: 1 }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                    </button>
                    
                    {/* Sub Services - Show only when expanded */}
                    {subServices.length > 0 && isExpanded && (
                      <div className="sub-services expanded">
                        {subServices
                          .filter(sub => sub.status === 'active')
                          .map(sub => (
                            <Link
                              key={sub.slug}
                              to={`/services/${service.slug}/${sub.slug}`}
                              className="dropdown-item sub-service"
                              onClick={handleMobileMenuClose}
                            >
                              {sub.title}
                            </Link>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact */}
          <Link
            to="/contact"
            className={`header-nav-item ${isActive('/contact') ? 'active' : ''}`}
          >
            CONTACT
          </Link>
        </nav>

        {/* Contact Info & CTA */}
        <div className="header-contact">
          {contact.phone && (
            <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="header-phone">
              <svg className="header-phone-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="phone-number">{contact.phone}</span>
            </a>
          )}
          <Button variant="primary" size="sm">
            Get Quote
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="header-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="header-mobile-menu show">
          <div className="header-mobile-nav">
            {/* Home */}
            <Link
              to="/"
              className={`header-mobile-item ${isActive('/') ? 'text-primary-600' : ''}`}
              onClick={handleMobileMenuClose}
            >
              HOME
            </Link>

            {/* About */}
            <Link
              to="/about"
              className={`header-mobile-item ${isActive('/about') ? 'text-primary-600' : ''}`}
              onClick={handleMobileMenuClose}
            >
              ABOUT
            </Link>

            {/* Case Studies */}
            <Link
              to="/case-studies"
              className={`header-mobile-item ${isActive('/case-studies') ? 'text-primary-600' : ''}`}
              onClick={handleMobileMenuClose}
            >
              CASE STUDIES
            </Link>

            {/* Inspiration Gallery */}
            <Link
              to="/inspiration-gallery"
              className={`header-mobile-item ${isActive('/inspiration-gallery') ? 'text-primary-600' : ''}`}
              onClick={handleMobileMenuClose}
            >
              INSPIRATION GALLERY
            </Link>

            {/* Services */}
            <div>
              <div className="header-mobile-item">
                SERVICES
              </div>
              <div className="header-mobile-submenu">
                {mainServices.map((service) => {
                  const subServices = service.subServices || [];
                  const isExpanded = expandedService === service.slug;
                  
                  return (
                    <div key={service.slug} className="mobile-service-group">
                      {/* Main Service - Clickable to expand */}
                      <button
                        onClick={() => handleServiceClick(service.slug, { preventDefault: () => {} })}
                        className="header-mobile-subitem main-service expandable"
                      >
                        <span>{service.title}</span>
                        {subServices.length > 0 && (
                          <svg 
                            className={`w-1 h-1 ml-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            style={{ strokeWidth: 1 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </button>
                      
                      {/* Sub Services - Show only when expanded */}
                      {subServices.length > 0 && isExpanded && (
                        <div className="mobile-sub-services expanded">
                          {subServices
                            .filter(sub => sub.status === 'active')
                            .map(sub => (
                              <Link
                                key={sub.slug}
                                to={`/services/${service.slug}/${sub.slug}`}
                                className="header-mobile-subitem sub-service"
                                onClick={handleMobileMenuClose}
                              >
                                {sub.title}
                              </Link>
                            ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contact */}
            <Link
              to="/contact"
              className={`header-mobile-item ${isActive('/contact') ? 'text-primary-600' : ''}`}
              onClick={handleMobileMenuClose}
            >
              CONTACT
            </Link>
            
            {/* Mobile Contact Info */}
            {contact.phone && (
              <div className="pt-4 border-t border-gray-200">
                <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="header-phone">
                  <svg className="header-phone-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="phone-number">{contact.phone}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

