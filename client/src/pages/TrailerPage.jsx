import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import { Container, Section, Button, Card, Badge } from '../components/ui';

const TrailerPage = () => {
  const { data: services } = useQuery({ queryKey: ['services'], queryFn: async () => (await api.get('/services')).data })

  const trailerServices = services?.filter(s => s.category?.includes('trailer')) || []

  const trailerTypes = [
    {
      name: 'Service Body Trailers',
      description: 'Professional-grade trailers with integrated storage and workspace solutions. Perfect for mobile service operations.',
      icon: '🚛',
      color: 'primary'
    },
    {
      name: 'Trailer Packs',
      description: 'Complete trailer solutions with pre-configured storage and equipment. Ready to work straight from delivery.',
      icon: '📦',
      color: 'success'
    },
    {
      name: 'All-Rounder Packs',
      description: 'Versatile trailer configurations that adapt to multiple applications. The perfect solution for diverse operational needs.',
      icon: '🔄',
      color: 'warning'
    }
  ];

  const features = [
    {
      title: 'Heavy-Duty Construction',
      description: 'Built to withstand the toughest conditions. Our trailer service bodies are constructed using premium materials and proven engineering principles.',
      icon: '🏗️'
    },
    {
      title: 'Modular Design',
      description: 'Customize your trailer with our modular system. Add or remove components as your needs change over time.',
      icon: '🧩'
    },
    {
      title: 'Integrated Storage',
      description: 'Every inch of space is optimized for efficiency. Custom drawers, shelves, and compartments keep everything organized and accessible.',
      icon: '🗄️'
    },
    {
      title: 'Easy Towing',
      description: 'Designed for optimal weight distribution and towing stability. Get to your destination safely and efficiently.',
      icon: '🚗'
    }
  ];

  const industryApplications = [
    {
      name: 'Construction',
      description: 'Mobile workshops and tool storage for construction sites. Keep your team equipped and productive.',
      badges: ['Tools', 'Equipment']
    },
    {
      name: 'Maintenance',
      description: 'Service trailers for maintenance operations. Complete mobile workshops with all necessary equipment.',
      badges: ['Workshop', 'Service']
    },
    {
      name: 'Emergency Response',
      description: 'Rapid response trailers for emergency services. Quick deployment with essential equipment and supplies.',
      badges: ['Emergency', 'Response']
    }
  ];

  return (
    <>
      <Helmet>
        <title>Trailer Service Bodies & Canopies - Australian Equipment Solutions</title>
        <meta name="description" content="Versatile, customizable solutions for any industry. Built for performance and reliability." />
      </Helmet>

      {/* Hero Section */}
      <Section background="primary" padding="4xl">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Trailer Service Bodies & Canopies
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Versatile, customizable solutions for any industry. Built for performance and reliability.
            </p>
            <Button variant="secondary" size="lg" as={Link} to="/contact">
              Get Quote
            </Button>
          </div>
        </Container>
      </Section>

      {/* Trailer Types */}
      <Section padding="4xl">
        <Container>
          <Section.Header
            title="Trailer Service Body Types"
            subtitle="Choose the perfect solution for your needs"
            align="center"
            className="mb-12"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trailerTypes.map((type, index) => (
              <Card key={index} variant="elevated" hover className="text-center">
                <div className={`h-48 bg-gradient-to-br from-${type.color}-500 to-${type.color}-700 flex items-center justify-center text-white text-6xl`}>
                  {type.icon}
                </div>
                <Card.Body>
                  <Card.Title className="text-xl mb-3">{type.name}</Card.Title>
                  <Card.Text className="mb-4">
                    {type.description}
                  </Card.Text>
                  <Button variant="primary" size="lg">
                    Learn More
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
            title="Why Choose HIDRIVE Trailer Solutions"
            subtitle="Engineered for versatility and durability"
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

      {/* Trailer Services */}
      <Section padding="4xl">
        <Container>
          <Section.Header
            title="Trailer Service Solutions"
            subtitle="Professional solutions for every industry"
            align="center"
            className="mb-12"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {trailerServices.slice(0, 6).map((service) => (
              <Card key={service._id} variant="elevated" hover>
                <div className="h-48 bg-gray-100 flex items-center justify-center text-4xl text-gray-600">
                  🚛
                </div>
                <Card.Body>
                  <Card.Title className="text-lg mb-3">{service.name}</Card.Title>
                  <Card.Text className="mb-4">
                    {service.description}
                  </Card.Text>
                  <Button variant="primary" as={Link} to={`/services/${service.slug}`}>
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Applications */}
      <Section background="light" padding="4xl">
        <Container>
          <Section.Header
            title="Industry Applications"
            subtitle="Trailer solutions for every sector"
            align="center"
            className="mb-12"
          />
          
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {industryApplications.map((application, index) => (
                <div key={index}>
                  <h4 className="text-xl font-bold text-gray-800 mb-3">
                    {application.name}
                  </h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {application.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {application.badges.map(badge => (
                      <Badge key={badge} variant="primary" size="sm">
                        {badge}
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
              Ready for Your Perfect Trailer Solution?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Get a custom quote for your trailer service body or canopy.
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

export default TrailerPage; 