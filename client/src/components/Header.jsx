import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Button, Container } from './ui';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expandedService, setExpandedService] = useState(null);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
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

    // Set initial scroll state immediately
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Extract settings data
  const general = settings.general || {};
  const contact = settings.contact || {};
  const appearance = settings.appearance || {};

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
    setExpandedService(null);
  };

  const handleMobileMenuToggle = () => {
    console.log('Mobile menu toggle clicked, current state:', mobileMenuOpen);
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleServiceClick = (serviceSlug, event) => {
    event.preventDefault();
    if (expandedService === serviceSlug) {
      setExpandedService(null);
    } else {
      setExpandedService(serviceSlug);
    }
  };

  const handleServicesDropdownToggle = () => {
    setServicesDropdownOpen(!servicesDropdownOpen);
  };

  const handleServicesDropdownClose = () => {
    setServicesDropdownOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Debug mobile menu state
  useEffect(() => {
    console.log('Mobile menu state changed:', mobileMenuOpen);
  }, [mobileMenuOpen]);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        {/* Logo */}
        <Link to="/" className="header-logo">
          {general.siteName || general.companyName || 'Australian Engineering Solutions'}
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
            <button 
              className="header-nav-item services-dropdown-trigger"
              onClick={handleServicesDropdownToggle}
              onMouseEnter={() => setServicesDropdownOpen(true)}
            >
              SERVICES
              <svg 
                className={`dropdown-arrow ${servicesDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div 
              className={`dropdown-menu services-dropdown ${servicesDropdownOpen ? 'show' : ''}`}
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
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
                          className={`sub-dropdown-arrow ${isExpanded ? 'rotate-90' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
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
                              onClick={handleServicesDropdownClose}
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
          <Link to="/contact">
            <Button variant="primary" size="sm" className="get-quote-btn">
              Get Quote
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="header-mobile-toggle"
          onClick={handleMobileMenuToggle}
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
      <div className={`header-mobile-menu ${mobileMenuOpen ? 'show' : ''}`}>
        <ul className="header-mobile-nav">
            {/* Home */}
            <li>
              <Link
                to="/"
                className={`header-mobile-item ${isActive('/') ? 'active' : ''}`}
                onClick={handleMobileMenuClose}
              >
                HOME
              </Link>
            </li>

            {/* About */}
            <li>
              <Link
                to="/about"
                className={`header-mobile-item ${isActive('/about') ? 'active' : ''}`}
                onClick={handleMobileMenuClose}
              >
                ABOUT
              </Link>
            </li>

            {/* Case Studies */}
            <li>
              <Link
                to="/case-studies"
                className={`header-mobile-item ${isActive('/case-studies') ? 'active' : ''}`}
                onClick={handleMobileMenuClose}
              >
                CASE STUDIES
              </Link>
            </li>

            {/* Inspiration Gallery */}
            <li>
              <Link
                to="/inspiration-gallery"
                className={`header-mobile-item ${isActive('/inspiration-gallery') ? 'active' : ''}`}
                onClick={handleMobileMenuClose}
              >
                INSPIRATION GALLERY
              </Link>
            </li>

            {/* Services */}
            <li>
              <div className="header-mobile-submenu">
                <button
                  className="header-mobile-item"
                  onClick={() => setExpandedService(expandedService === 'services' ? null : 'services')}
                >
                  <span>SERVICES</span>
                  <svg className={`mobile-sub-dropdown-arrow ${expandedService === 'services' ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <ul className={`header-mobile-submenu-list ${expandedService === 'services' ? 'show' : ''}`}>
                  {mainServices.map((service) => (
                    <li key={service.slug}>
                      <Link
                        to={`/services/${service.slug}`}
                        className="header-mobile-subitem"
                        onClick={handleMobileMenuClose}
                      >
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            {/* Contact */}
            <li>
              <Link
                to="/contact"
                className={`header-mobile-item ${isActive('/contact') ? 'active' : ''}`}
                onClick={handleMobileMenuClose}
              >
                CONTACT
              </Link>
            </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;

