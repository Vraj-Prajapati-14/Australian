import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = ({ 
  title = "Ready to Get Started?", 
  description = "Contact us today to learn more about our services and how we can help you.",
  primaryButton = { text: "Contact Us", link: "/contact" },
  secondaryButton = { text: "Learn More", link: "/services" },
  className = ""
}) => {
  return (
    <section className={`cta-section ${className}`}>
      <div className="cta-content">
        <h2 className="cta-title">{title}</h2>
        <p className="cta-description">{description}</p>
        <div className="cta-buttons">
          <Link to={primaryButton.link} className="btn-primary">
            {primaryButton.text}
          </Link>
          <Link to={secondaryButton.link} className="btn-outline">
            {secondaryButton.text}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
