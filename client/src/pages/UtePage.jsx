import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import { Container, Section, Button, Card, Badge } from '../components/ui';

const UtePage = () => {
  // Fetch services and sub-services data
  const { data: services = [] } = useQuery({ 
    queryKey: ['services'], 
    queryFn: async () => (await api.get('/services')).data || []
  });

  const { data: subServices = [] } = useQuery({ 
    queryKey: ['subServices'], 
    queryFn: async () => (await api.get('/sub-services')).data || []
  });

  // Get ute services and sub-services from API
  const uteService = services.find(s => s.category === 'ute' && s.status === 'active');
  const uteSubServices = subServices.filter(s => s.parentService === uteService?._id && s.status === 'active') || [];

  const features = [
    {
      title: 'Lightweight & Strong',
      description: 'Our aluminium construction provides the perfect balance of strength and weight, ensuring your vehicle maintains optimal performance.',
      icon: '⚡'
    },
    {
      title: 'Fast Installation',
      description: 'Professional installation completed in just 2-3 hours, minimizing downtime and getting you back on the road quickly.',
      icon: '⚡'
    },
    {
      title: 'Customizable Design',
      description: 'Tailor your canopy with custom storage solutions, lighting, and accessories to match your specific needs.',
      icon: '⚡'
    },
    {
      title: 'Perfect Fit',
      description: 'Precisely engineered for your specific vehicle model, ensuring a seamless fit and professional appearance.',
      icon: '⚡'
    }
  ];

  const serviceBodyVariations = [
    {
      name: 'Tradesman Pack',
      description: 'Complete solution for tradespeople with integrated tool storage and workspace.',
      features: ['Tool Drawers', 'Work Bench', 'Ladder Racks', 'Power Outlets'],
      image: 'https://via.placeholder.com/300x200',
      price: 'From $4,500'
    },
    {
      name: 'Security Pack',
      description: 'High-security solution with reinforced construction and advanced locking systems.',
      features: ['Reinforced Doors', 'Advanced Locks', 'Alarm Integration', 'GPS Tracking'],
      image: 'https://via.placeholder.com/300x200',
      price: 'From $5,200'
    },
    {
      name: 'Utility Pack',
      description: 'Versatile solution for utility companies with specialized equipment storage.',
      features: ['Equipment Racks', 'Cable Management', 'Safety Equipment', 'Weather Protection'],
      image: 'https://via.placeholder.com/300x200',
      price: 'From $4,800'
    }
  ];

  const governmentSolutions = [
    {
      name: 'Emergency Services',
      description: 'Specialized solutions for police, fire, and emergency response vehicles.',
      features: ['Emergency Lighting', 'Equipment Mounting', 'Secure Storage', 'Quick Access']
    },
    {
      name: 'Government Fleet',
      description: 'Compliant solutions meeting all government standards and requirements.',
      features: ['ISO Certified', 'Compliance Ready', 'Fleet Branding', 'Maintenance Access']
    },
    {
      name: 'Defense Applications',
      description: 'Military-grade solutions for defense and security applications.',
      features: ['Military Spec', 'Heavy-Duty', 'Custom Mounting', 'Security Clearance']
    }
  ];

  if (!uteService) {
    return (
      <Section padding="4xl">
        <Container>
          <Card variant="elevated" className="text-center py-12">
            <Card.Body>
              <div className="text-6xl mb-4">🚗</div>
              <Card.Title className="text-xl text-gray-600 mb-4">
                No ute services available
              </Card.Title>
              <Card.Text className="text-gray-500">
                Please check back later or contact us for assistance.
              </Card.Text>
            </Card.Body>
          </Card>
        </Container>
      </Section>
    );
  }

  return (
    <>
      <Helmet>
        <title>Ute Canopies & Service Bodies - Australian Equipment Solutions</title>
        <meta name="description" content="Professional ute solutions engineered for performance and durability. Lightweight, strong, and perfectly fitted for your vehicle." />
      </Helmet>

      {/* Hero Section */}
      <Section background="primary" padding="4xl">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Ute Canopies & Service Bodies
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Professional ute solutions engineered for performance and durability. Lightweight, strong, and perfectly fitted for your vehicle.
            </p>
            <Button variant="secondary" size="lg" as={Link} to="/contact">
              Get Quote
            </Button>
          </div>
        </Container>
      </Section>

      {/* Canopy Types */}
      <Section padding="4xl">
        <Container>
          <Section.Header
            title="Canopy Types"
            subtitle="Choose the perfect solution for your needs"
            align="center"
            className="mb-12"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {uteSubServices.map(subService => (
              <Card key={subService._id} variant="elevated" hover className="text-center">
                <div className="relative">
                  <Card.Image
                    src={subService.image}
                    alt={subService.name}
                    className="h-48 object-cover"
                  />
                  {subService.featured && (
                    <Badge 
                      variant="warning" 
                      size="lg"
                      className="absolute top-4 right-4"
                    >
                      Featured
                    </Badge>
                  )}
                </div>
                <Card.Body>
                  <Card.Title className="text-xl mb-3">{subService.name}</Card.Title>
                  <Card.Text className="mb-4">
                    {subService.shortDescription}
                  </Card.Text>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {subService.features?.slice(0, 3).map(feature => (
                      <Badge key={feature} variant="info" size="sm">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <div className="mb-4">
                    <span className="text-lg font-semibold text-gray-800">
                      From ${subService.pricing?.base?.toLocaleString()}
                    </span>
                  </div>

                  <Button variant="primary" size="lg" fullWidth>
                    Get Quote
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Key Features */}
      <Section background="light" padding="4xl">
        <Container>
          <Section.Header
            title="Why Choose HIDRIVE Ute Solutions"
            subtitle="Engineered for performance and reliability"
            align="center"
            className="mb-12"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="text-3xl">{feature.icon}</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Service Body Variations */}
      <Section padding="4xl">
        <Container>
          <Section.Header
            title="Service Body Variations"
            subtitle="Complete solutions for every application"
            align="center"
            className="mb-12"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {serviceBodyVariations.map((variation, index) => (
              <Card key={index} variant="elevated" hover>
                <Card.Image
                  src={variation.image}
                  alt={variation.name}
                  className="h-48 object-cover"
                />
                <Card.Body>
                  <Card.Title className="text-xl mb-3">{variation.name}</Card.Title>
                  <Card.Text className="mb-4">
                    {variation.description}
                  </Card.Text>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {variation.features.map(feature => (
                      <Badge key={feature} variant="success" size="sm">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">
                      {variation.price}
                    </span>
                    <Button variant="primary" size="sm">
                      Learn More
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Government Sector Solutions */}
      <Section background="light" padding="4xl">
        <Container>
          <Section.Header
            title="Government Sector Solutions"
            subtitle="Compliant solutions for government operations"
            align="center"
            className="mb-12"
          />
          
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {governmentSolutions.map((solution, index) => (
                <div key={index}>
                  <h4 className="text-xl font-bold text-gray-800 mb-3">
                    {solution.name}
                  </h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {solution.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {solution.features.map(feature => (
                      <Badge key={feature} variant="primary" size="sm">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section background="primary" padding="4xl">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready for Your Perfect Ute Solution?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Get a custom quote for your ute canopy or service body.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" as={Link} to="/contact">
                Get Quote
              </Button>
              <Button variant="outline" size="lg" as={Link} to="/inspiration">
                View Inspiration Gallery
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};

export default UtePage; 