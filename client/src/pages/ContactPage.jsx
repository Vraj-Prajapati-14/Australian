import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Container, Section, Button, Card, Input, Alert } from '../components/ui';
import '../styles/contact-page.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    enquiryType: '',
    serviceCategory: '',
    specificService: '',
    department: '',
    vehicleType: '',
    vehicleDetails: '',
    urgency: '',
    message: '',
    marketingConsent: false,
    privacyConsent: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Fetch settings data
  const { data: settings = {} } = useQuery({ 
    queryKey: ['settings'], 
    queryFn: async () => {
      const response = await api.get('/settings');
      return response.data || {};
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch services and departments
  const { data: services = [] } = useQuery({ 
    queryKey: ['services'], 
    queryFn: async () => {
      const response = await api.get('/services');
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: departments = [] } = useQuery({ 
    queryKey: ['departments'], 
    queryFn: async () => {
      const response = await api.get('/departments');
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Extract settings data
  const general = settings.general || {};
  const contact = settings.contact || {};

  // Form options
  const enquiryTypes = [
    { value: 'general', label: 'General Enquiry' },
    { value: 'service', label: 'Service Information' },
    { value: 'quote', label: 'Request Quote' },
    { value: 'support', label: 'Technical Support' },
    { value: 'warranty', label: 'Warranty Claim' },
    { value: 'installation', label: 'Installation Service' },
    { value: 'parts', label: 'Parts & Accessories' },
    { value: 'fleet', label: 'Fleet Services' }
  ];

  const vehicleTypes = [
    { value: 'ute', label: 'Ute' },
    { value: 'trailer', label: 'Trailer' },
    { value: 'truck', label: 'Truck' },
    { value: 'van', label: 'Van' },
    { value: 'other', label: 'Other' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low - No rush' },
    { value: 'medium', label: 'Medium - Within a week' },
    { value: 'high', label: 'High - Within 2-3 days' },
    { value: 'emergency', label: 'Emergency - Same day' }
  ];

  // Filter main services (categories) and sub-services
  const mainServices = services.filter(service => service.isMainService);
  const subServices = services.filter(service => !service.isMainService && service.parentService);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.enquiryType) newErrors.enquiryType = 'Please select an enquiry type';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    if (!formData.privacyConsent) newErrors.privacyConsent = 'You must agree to the privacy policy';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Clean up form data - remove empty strings and convert to proper format
      const cleanedFormData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        company: formData.company?.trim() || undefined,
        jobTitle: formData.jobTitle?.trim() || undefined,
        enquiryType: formData.enquiryType,
        serviceCategory: formData.serviceCategory || undefined,
        specificService: formData.specificService || undefined,
        department: formData.department || undefined,
        vehicleType: formData.vehicleType || undefined,
        vehicleDetails: formData.vehicleDetails?.trim() || undefined,
        urgency: formData.urgency || undefined,
        message: formData.message.trim(),
        marketingConsent: formData.marketingConsent,
        privacyConsent: formData.privacyConsent
      };

      console.log('Submitting contact form:', cleanedFormData);
      
      const response = await api.post('/contacts/submit', cleanedFormData);
      console.log('Contact form response:', response);
      
      setSubmitStatus('success');
      setShowSuccessPopup(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        jobTitle: '',
        enquiryType: '',
        serviceCategory: '',
        specificService: '',
        department: '',
        vehicleType: '',
        vehicleDetails: '',
        urgency: '',
        message: '',
        marketingConsent: false,
        privacyConsent: true
      });
      
      // Hide popup after 5 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 5000);
    } catch (error) {
      console.error('Contact form error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Check if it's a network error (server not running)
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.error('Server appears to be down or not accessible');
        setSubmitStatus('error');
        return;
      }
      
      // Check for specific server errors
      if (error.response?.status === 500) {
        console.error('Server internal error');
        setSubmitStatus('error');
        return;
      }
      
      if (error.response?.status === 400) {
        console.error('Bad request - validation error:', error.response.data);
        setSubmitStatus('error');
        return;
      }
      
      setSubmitStatus('error');
      
      // Show more specific error message
      if (error.response?.data?.message) {
        console.error('Server error message:', error.response.data.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - {general.siteTitle || 'Australian Automotive Services'}</title>
        <meta name="description" content="Get in touch with us for professional automotive services and solutions." />
      </Helmet>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <div className="success-popup-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="success-popup-content">
              <h3>Thank you for your enquiry!</h3>
              <p>We'll get back to you within 24 hours.</p>
            </div>
            <button 
              className="success-popup-close"
              onClick={() => setShowSuccessPopup(false)}
              aria-label="Close notification"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="contact-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>
            Get in touch with our team of experts for professional automotive services and solutions.
          </p>
        </div>
      </div>

      {/* Contact Form & Info */}
      <div className="contact-page-layout">
        <div className="container">
          <div className="contact-info-form-grid">
            {/* Contact Information - 2x2 Grid */}
            <div>
              <div className="contact-info-grid">
                {/* Phone */}
                <div className="contact-info-card">
                  <div className="flex">
                    <div className="contact-info-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="contact-info-content">
                      <h3>Phone</h3>
                      <a href="tel:+61212345678">+61 2 1234 5678</a>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="contact-info-card">
                  <div className="flex">
                    <div className="contact-info-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="contact-info-content">
                      <h3>Email</h3>
                      <a href="mailto:info@australianengineering.com.au">info@australianengineering.com.au</a>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="contact-info-card">
                  <div className="flex">
                    <div className="contact-info-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="contact-info-content">
                      <h3>Address</h3>
                      <p>123 Engineering Street, Sydney NSW 2000</p>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="contact-info-card">
                  <div className="flex">
                    <div className="contact-info-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="contact-info-content">
                      <h3>Business Hours</h3>
                      <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form - Second */}
            <div className="contact-form-container">
              <h2>Send us a Message</h2>
              <p className="contact-form-subtitle">Fill out the form below and we'll get back to you within 24 hours</p>
              
              {submitStatus === 'success' && (
                <Alert variant="success" className="mb-6">
                  Thank you for your enquiry! We'll get back to you within 24 hours.
                </Alert>
              )}
              
              {submitStatus === 'error' && (
                <Alert variant="error" className="mb-6">
                  Sorry, there was an error sending your message. Please try again.
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="contact-form space-y-6">
                {/* Personal Information */}
                <div className="form-section">
                  <h3 className="form-section-title">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                      name="firstName"
                      value={formData.firstName}
                    onChange={handleInputChange}
                      error={errors.firstName}
                    required
                  />
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      error={errors.lastName}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                      error={errors.email}
                      required
                    />
                    <Input
                      label="Phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      error={errors.phone}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                      label="Company (Optional)"
                      name="company"
                      value={formData.company}
                    onChange={handleInputChange}
                  />
                  <Input
                      label="Job Title (Optional)"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Enquiry Details */}
                <div className="form-section">
                  <h3 className="form-section-title">Enquiry Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input.Select
                      label="Enquiry Type"
                      name="enquiryType"
                      value={formData.enquiryType}
                    onChange={handleInputChange}
                      options={enquiryTypes}
                      placeholder="Select enquiry type"
                      error={errors.enquiryType}
                    required
                  />
                    <Input.Select
                      label="Urgency Level"
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      options={urgencyLevels}
                      placeholder="Select urgency"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input.Select
                      label="Service Category"
                      name="serviceCategory"
                      value={formData.serviceCategory}
                      onChange={handleInputChange}
                      options={mainServices.map(service => ({ value: service._id, label: service.title }))}
                      placeholder="Select service category"
                    />
                    <Input.Select
                      label="Department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      options={departments.map(dept => ({ value: dept._id, label: dept.name }))}
                      placeholder="Select department"
                    />
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="form-section">
                  <h3 className="form-section-title">Vehicle Information (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input.Select
                      label="Vehicle Type"
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleInputChange}
                      options={vehicleTypes}
                      placeholder="Select vehicle type"
                    />
                    <Input
                      label="Vehicle Details"
                      name="vehicleDetails"
                      value={formData.vehicleDetails}
                      onChange={handleInputChange}
                      placeholder="Make, model, year, etc."
                    />
                  </div>
                </div>
                
                {/* Message */}
                <div className="form-section">
                  <h3 className="form-section-title">Your Message</h3>
                <Input.Textarea
                  label="Message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                    error={errors.message}
                    placeholder="Please provide details about your enquiry..."
                    required
                  />
                </div>

                {/* Consent */}
                <div className="form-section">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="privacyConsent"
                        name="privacyConsent"
                        checked={formData.privacyConsent}
                        onChange={handleInputChange}
                        className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  required
                />
                      <label htmlFor="privacyConsent" className="text-sm text-gray-700">
                        I agree to the <a href="/privacy" className="text-primary-600 hover:text-primary-700 underline">Privacy Policy</a> and consent to the processing of my personal data. *
                      </label>
                    </div>
                    {errors.privacyConsent && (
                      <p className="text-sm text-red-600">{errors.privacyConsent}</p>
                    )}
                    
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="marketingConsent"
                        name="marketingConsent"
                        checked={formData.marketingConsent}
                        onChange={handleInputChange}
                        className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="marketingConsent" className="text-sm text-gray-700">
                        I would like to receive marketing communications and updates about your services.
                      </label>
                    </div>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isSubmitting}
                  fullWidth
                  className="submit-button"
                >
                  {isSubmitting ? 'Sending...' : 'Send Enquiry'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Google Map Section - Full Width */}
      <div className="contact-map-section">
        <div className="container">
          <div className="contact-info-card map-card">
            <div className="flex">
              <div className="contact-info-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="contact-info-content">
                <h3>Our Location</h3>
                <p>123 Engineering Street, Sydney NSW 2000</p>
              </div>
            </div>
            
            <div className="map-container">
              <img 
                src="https://staticmap.openstreetmap.de/staticmap.php?center=-33.8688,151.2093&zoom=15&size=600x300&maptype=mapnik&markers=-33.8688,151.2093,red-pushpin"
                alt="Our location in Sydney"
                className="map-image"
                onError={(e) => {
                  e.target.src = `data:image/svg+xml;base64,${btoa(`
                    <svg width="600" height="300" xmlns="http://www.w3.org/2000/svg">
                      <rect width="600" height="300" fill="#f8fafc"/>
                      <g transform="translate(300, 150)">
                        <circle cx="0" cy="0" r="8" fill="#175490"/>
                        <text x="0" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="600" fill="#333333">
                          Our Location
                        </text>
                        <text x="0" y="50" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#666666">
                          123 Engineering Street, Sydney NSW 2000
                        </text>
                      </g>
                    </svg>
                  `)}`;
                }}
              />
              <div className="map-overlay">
                <button 
                  className="map-button"
                  onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=123+Engineering+Street,Sydney,NSW,2000,Australia', '_blank')}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open in Google Maps
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;

