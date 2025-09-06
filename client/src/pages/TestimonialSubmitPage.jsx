import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Container, Section, Button, Card, Input, Alert } from '../components/ui';

const TestimonialSubmitPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    company: '',
    email: '',
    phone: '',
    rating: 5,
    content: '',
    avatar: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const submitMutation = useMutation({
    mutationFn: async (values) => {
      const formDataToSend = new FormData();
      
      // Add form fields
      Object.keys(values).forEach(key => {
        if (values[key] !== undefined && values[key] !== null) {
          if (key === 'avatar' && values[key]) {
            formDataToSend.append('avatar', values[key]);
          } else if (key !== 'avatar') {
            formDataToSend.append(key, values[key]);
          }
        }
      });

      const response = await api.post('/testimonials', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    },
    onSuccess: () => {
      setSubmitStatus('success');
      setFormData({
        name: '',
        position: '',
        company: '',
        email: '',
        phone: '',
        rating: 5,
        content: '',
        avatar: null
      });
      setErrors({});
    },
    onError: (error) => {
      setSubmitStatus('error');
      console.error('Form submission error:', error);
    }
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Please enter your job position';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Please enter your company name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Please share your experience';
    } else if (formData.content.length < 20) {
      newErrors.content = 'Please provide at least 20 characters';
    } else if (formData.content.length > 500) {
      newErrors.content = 'Testimonial cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    if (validateForm()) {
      try {
        await submitMutation.mutateAsync(formData);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
    setIsSubmitting(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => handleInputChange('rating', star)}
            className={`text-2xl ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Submit Your Testimonial - Australian Equipment Solutions</title>
        <meta name="description" content="Share your experience with Australian Equipment Solutions. Submit your testimonial and help others discover our quality mobile workspace solutions." />
      </Helmet>

      <Section background="primary" padding="4xl">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Share Your Experience
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              We'd love to hear about your experience with Australian Equipment Solutions. Your feedback helps us improve and helps others discover our services.
            </p>
          </div>
        </Container>
      </Section>

      <Section padding="4xl">
        <Container>
          <div className="max-w-2xl mx-auto">
            {submitStatus === 'success' && (
              <Alert variant="success" className="mb-6">
                Thank you! Your testimonial has been submitted successfully. It will be reviewed before being published.
              </Alert>
            )}

            {submitStatus === 'error' && (
              <Alert variant="error" className="mb-6">
                Failed to submit testimonial. Please try again.
              </Alert>
            )}

            <Card variant="elevated">
              <Card.Body>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      error={errors.name}
                      required
                      placeholder="Your full name"
                    />

                    <Input
                      label="Job Position"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      error={errors.position}
                      required
                      placeholder="e.g., Fleet Manager, CEO"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      error={errors.company}
                      required
                      placeholder="Your company name"
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      error={errors.email}
                      required
                      placeholder="your.email@company.com"
                    />
                  </div>

                  <Input
                    label="Phone Number (Optional)"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Your phone number"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Overall Rating <span className="text-red-500">*</span>
                    </label>
                    {renderStars()}
                    {errors.rating && (
                      <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
                    )}
                  </div>

                  <Input.Textarea
                    label="Your Testimonial"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    error={errors.content}
                    required
                    rows={6}
                    maxLength={500}
                    placeholder="Tell us about your experience with Australian Equipment Solutions. What services did you use? How did we help you? What would you say to others considering our services?"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Photo (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                  </div>

                  <Alert variant="info">
                    <strong>Privacy Notice:</strong> Your testimonial will be reviewed before publication. We may contact you to verify your submission. Your email address will not be published publicly.
                  </Alert>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={isSubmitting}
                    loading={isSubmitting}
                  >
                    Submit Testimonial
                  </Button>
                </form>
              </Card.Body>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
};

export default TestimonialSubmitPage; 