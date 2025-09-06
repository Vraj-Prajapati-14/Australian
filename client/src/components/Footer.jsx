import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

const Footer = () => {
  // Fetch settings data
  const { data: settings = {} } = useQuery({ 
    queryKey: ['settings'], 
    queryFn: async () => {
      const response = await api.get('/settings');
      return response.data || {};
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch main services for footer links
  const { data: mainServices = [] } = useQuery({ 
    queryKey: ['mainServices'], 
    queryFn: async () => (await api.get('/services/main')).data || []
  });

  // Extract settings data
  const general = settings.general || {};
  const contact = settings.contact || {};
  const social = settings.social || {};

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Company Info & Logo */}
            <div className="footer-company">
              <div className="footer-logo">
                {general.companyName || 'Australian Automotive'}
              </div>
              <p className="footer-description">
                {general.siteDescription || 'Professional automotive services and solutions across Australia. We provide expert automotive solutions with years of experience and dedication to quality.'}
              </p>
              
              {/* Contact Info */}
              <div className="footer-contact-info">
                {contact.phone && (
                  <div className="footer-contact-item">
                    <svg className="footer-contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="footer-contact-link">
                      {contact.phone}
                    </a>
                  </div>
                )}
                
                {contact.email && (
                  <div className="footer-contact-item">
                    <svg className="footer-contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${contact.email}`} className="footer-contact-link">
                      {contact.email}
                    </a>
                  </div>
                )}
                
                {contact.address && (
                  <div className="footer-contact-item">
                    <svg className="footer-contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="footer-contact-text">{contact.address}</span>
                  </div>
                )}

                {/* Business Hours */}
                {contact.businessHours && (
                  <div className="footer-contact-item">
                    <svg className="footer-contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="footer-contact-text">{contact.businessHours}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h3 className="footer-section-title">Quick Links</h3>
              <ul className="footer-links">
                <li>
                  <Link to="/" className="footer-link">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="footer-link">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="footer-link">
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/case-studies" className="footer-link">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link to="/inspiration-gallery" className="footer-link">
                    Inspiration Gallery
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="footer-link">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="footer-section">
              <h3 className="footer-section-title">Our Services</h3>
              <ul className="footer-links">
                {mainServices.slice(0, 6).map((service) => (
                  <li key={service._id}>
                    <Link 
                      to={`/services/${service.slug}`} 
                      className="footer-link"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
                {mainServices.length > 6 && (
                  <li>
                    <Link to="/services" className="footer-link footer-link-accent">
                      View All Services →
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Social & Newsletter */}
            <div className="footer-section">
              <h3 className="footer-section-title">Connect With Us</h3>
              
              {/* Social Links */}
              <div className="footer-social">
                {social.facebook && (
                  <a 
                    href={social.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="footer-social-link"
                    aria-label="Facebook"
                  >
                    <svg className="footer-social-icon" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
                
                {social.instagram && (
                  <a 
                    href={social.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="footer-social-link"
                    aria-label="Instagram"
                  >
                    <svg className="footer-social-icon" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.928-.875-1.418-2.026-1.418-3.323s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244z"/>
                    </svg>
                  </a>
                )}
                
                {social.linkedin && (
                  <a 
                    href={social.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="footer-social-link"
                    aria-label="LinkedIn"
                  >
                    <svg className="footer-social-icon" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}

                {social.twitter && (
                  <a 
                    href={social.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="footer-social-link"
                    aria-label="Twitter"
                  >
                    <svg className="footer-social-icon" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                )}

                {social.youtube && (
                  <a 
                    href={social.youtube} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="footer-social-link"
                    aria-label="YouTube"
                  >
                    <svg className="footer-social-icon" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}
              </div>

              {/* Newsletter Signup */}
              <div className="footer-newsletter">
                <h4 className="footer-newsletter-title">Stay Updated</h4>
                <p className="footer-newsletter-text">
                  Subscribe to our newsletter for the latest updates and offers.
                </p>
                <form className="footer-newsletter-form">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="footer-newsletter-input"
                    required
                  />
                  <button type="submit" className="footer-newsletter-button">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              © {currentYear} {general.companyName || 'Australian Automotive'}. All rights reserved.
            </div>
            
            <div className="footer-legal">
              <Link to="/privacy" className="footer-legal-link">
                Privacy Policy
              </Link>
              <Link to="/terms" className="footer-legal-link">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="footer-legal-link">
                Sitemap
              </Link>
              <Link to="/accessibility" className="footer-legal-link">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

