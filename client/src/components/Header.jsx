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
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            HOME
          </Link>

          {/* About */}
          <Link
            to="/about"
            className={`header-nav-item ${isActive('/about') ? 'active' : ''}`}
          >
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ABOUT
          </Link>

          {/* Case Studies */}
          <Link
            to="/case-studies"
            className={`header-nav-item ${isActive('/case-studies') ? 'active' : ''}`}
          >
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            CASE STUDIES
          </Link>

          {/* Inspiration Gallery */}
          <Link
            to="/inspiration-gallery"
            className={`header-nav-item ${isActive('/inspiration-gallery') ? 'active' : ''}`}
          >
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            INSPIRATION GALLERY
          </Link>

          {/* Services Dropdown */}
          <div className="dropdown">
            <button 
              className="header-nav-item services-dropdown-trigger"
              onClick={handleServicesDropdownToggle}
              onMouseEnter={() => setServicesDropdownOpen(true)}
            >
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              SERVICES
              <svg 
                className={`dropdown-arrow ${servicesDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
                      <div className="service-item-content">
                        <svg className="service-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        <span>{service.title}</span>
                      </div>
                      {subServices.length > 0 && (
                        <svg 
                          className={`sub-dropdown-arrow ${isExpanded ? 'rotate-90' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
                              <svg className="sub-service-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
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
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            CONTACT
          </Link>
        </nav>

        {/* Get Quote Button */}
        <div className="header-cta">
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
                <div className="mobile-item-content">
                  <svg className="mobile-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>HOME</span>
                </div>
              </Link>
            </li>

            {/* About */}
            <li>
              <Link
                to="/about"
                className={`header-mobile-item ${isActive('/about') ? 'active' : ''}`}
                onClick={handleMobileMenuClose}
              >
                <div className="mobile-item-content">
                  <svg className="mobile-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>ABOUT</span>
                </div>
              </Link>
            </li>

            {/* Case Studies */}
            <li>
              <Link
                to="/case-studies"
                className={`header-mobile-item ${isActive('/case-studies') ? 'active' : ''}`}
                onClick={handleMobileMenuClose}
              >
                <div className="mobile-item-content">
                  <svg className="mobile-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>CASE STUDIES</span>
                </div>
              </Link>
            </li>

            {/* Inspiration Gallery */}
            <li>
              <Link
                to="/inspiration-gallery"
                className={`header-mobile-item ${isActive('/inspiration-gallery') ? 'active' : ''}`}
                onClick={handleMobileMenuClose}
              >
                <div className="mobile-item-content">
                  <svg className="mobile-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>INSPIRATION GALLERY</span>
                </div>
              </Link>
            </li>

            {/* Services */}
            <li>
              <div className="header-mobile-submenu">
                <button
                  className="header-mobile-item"
                  onClick={() => setExpandedService(expandedService === 'services' ? null : 'services')}
                >
                  <div className="mobile-item-content">
                    <svg className="mobile-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <span>SERVICES</span>
                    <svg className={`mobile-sub-dropdown-arrow ${expandedService === 'services' ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
                <ul className={`header-mobile-submenu-list ${expandedService === 'services' ? 'show' : ''}`}>
                  {mainServices.map((service) => (
                    <li key={service.slug}>
                      <Link
                        to={`/services/${service.slug}`}
                        className="header-mobile-subitem"
                        onClick={handleMobileMenuClose}
                      >
                        <div className="mobile-subitem-content">
                          <svg className="mobile-sub-service-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{service.title}</span>
                        </div>
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
                <div className="mobile-item-content">
                  <svg className="mobile-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>CONTACT</span>
                </div>
              </Link>
            </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;

