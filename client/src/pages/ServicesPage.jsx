import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import { Container, Section, Button, Card, Badge } from '../components/ui';

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch services and sub-services data
  const { data: services = [] } = useQuery({ 
    queryKey: ['services'], 
    queryFn: async () => (await api.get('/services')).data || []
  });

  const { data: subServices = [] } = useQuery({ 
    queryKey: ['subServices'], 
    queryFn: async () => (await api.get('/sub-services')).data || []
  });

  // Fetch categories for filtering
  const { data: categories = [] } = useQuery({ 
    queryKey: ['service-categories'], 
    queryFn: async () => (await api.get('/service-categories')).data || []
  });

  // Use API data instead of mock data
  const activeServices = services.filter(s => s.status === 'active') || [];
  const activeSubServices = subServices.filter(s => s.status === 'active') || [];

  // Create category filter options from fetched categories
  const categoryOptions = [
    { key: 'all', name: 'All Services', count: activeServices.length },
    ...categories.map(category => ({
      key: category.slug,
      name: category.name,
      count: activeServices.filter(s => s.category === category.slug).length
    }))
  ];

  const filteredServices = selectedCategory === 'all' 
    ? activeServices 
    : activeServices.filter(s => s.category === selectedCategory);

  const getSubServicesForService = (serviceId) => {
    return activeSubServices.filter(sub => sub.parentService === serviceId || sub.parentService?._id === serviceId);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'ute': return 'primary';
      case 'trailer': return 'success';
      case 'truck': return 'warning';
      default: return 'info';
    }
  };

  return (
    <>
      <Helmet>
        <title>Our Services - Australian Equipment Solutions</title>
        <meta name="description" content="Professional vehicle solutions engineered for performance, durability, and efficiency. From ute canopies to heavy-duty truck service bodies." />
      </Helmet>

      {/* Hero Section */}
      <Section background="primary" padding="4xl">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Our Services
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Professional vehicle solutions engineered for performance, durability, and efficiency. From ute canopies to heavy-duty truck service bodies.
            </p>
            <Button variant="secondary" size="lg" as={Link} to="/contact">
              Get Quote
            </Button>
          </div>
        </Container>
      </Section>

      {/* Category Filter */}
      <Section padding="4xl">
        <Container>
          <div className="text-center mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              {categoryOptions.map(category => (
                <Button
                  key={category.key}
                  variant={selectedCategory === category.key ? 'primary' : 'outline'}
                  size="lg"
                  onClick={() => setSelectedCategory(category.key)}
                  className="rounded-full px-6"
                >
                  {category.name}
                  <Badge 
                    variant={selectedCategory === category.key ? 'secondary' : 'primary'}
                    size="sm"
                    className="ml-2"
                  >
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Services Grid */}
      <Section padding="4xl">
        <Container>
          <Section.Header
            title="Our Solutions"
            subtitle="Choose the perfect solution for your needs"
            align="center"
            className="mb-12"
          />
          
          {filteredServices.length === 0 ? (
            <Card variant="elevated" className="text-center py-12">
              <Card.Body>
                <div className="text-6xl mb-4">🔍</div>
                <Card.Title className="text-xl text-gray-600 mb-4">
                  No services found for this category
                </Card.Title>
                <Card.Text className="text-gray-500">
                  Please try selecting a different category or contact us for assistance.
                </Card.Text>
              </Card.Body>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredServices.map(service => {
                const serviceSubServices = getSubServicesForService(service._id);
                
                return (
                  <Card key={service._id} variant="elevated" hover>
                    <Card.Image
                      src={service.heroImage?.url || service.image}
                      alt={service.title || service.name}
                      className="h-64 object-cover"
                    />
                    {service.featured && (
                      <Badge 
                        variant="warning" 
                        size="lg"
                        className="absolute top-4 right-4"
                      >
                        Featured
                      </Badge>
                    )}
                    <Card.Body>
                      <div className="mb-4">
                        <Badge variant={getCategoryColor(service.category)}>
                          {service.category.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <Card.Title className="text-2xl mb-4">
                        {service.title || service.name}
                      </Card.Title>
                      
                      <Card.Text className="mb-6">
                        {service.summary || service.description}
                      </Card.Text>

                      {serviceSubServices.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-800 mb-3">
                            Available Options:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {serviceSubServices.slice(0, 3).map(sub => (
                              <Badge key={sub._id} variant="info" size="sm">
                                {sub.title || sub.name}
                              </Badge>
                            ))}
                            {serviceSubServices.length > 3 && (
                              <Badge variant="secondary" size="sm">
                                +{serviceSubServices.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                          {serviceSubServices.length} option{serviceSubServices.length !== 1 ? 's' : ''} available
                        </span>
                        <Button variant="primary" as={Link} to={`/services/${service.slug}`}>
                          View Details
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          )}
        </Container>
      </Section>

      {/* Featured Sub-Services */}
      <Section background="light" padding="4xl">
        <Container>
          <Section.Header
            title="Featured Solutions"
            subtitle="Our most popular and innovative products"
            align="center"
            className="mb-12"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeSubServices
              .filter(sub => sub.featured)
              .slice(0, 6)
              .map(subService => (
                <Card key={subService._id} variant="elevated" hover>
                  <Card.Image
                    src={subService.heroImage?.url || subService.image}
                    alt={subService.title || subService.name}
                    className="h-48 object-cover"
                  />
                  <Card.Body>
                    <div className="mb-4">
                      <Badge variant="info" size="sm">
                        {subService.parentService?.title || subService.parentServiceName}
                      </Badge>
                      {subService.featured && (
                        <Badge variant="warning" size="sm" className="ml-2">
                          Featured
                        </Badge>
                      )}
                    </div>
                    
                    <Card.Title className="text-xl mb-3">
                      {subService.title || subService.name}
                    </Card.Title>
                    
                    <Card.Text className="mb-4">
                      {subService.shortDescription || subService.summary}
                    </Card.Text>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {subService.features?.slice(0, 3).map(feature => (
                          <Badge key={feature} variant="success" size="sm">
                            ✓ {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800">
                        From ${subService.pricing?.base?.toLocaleString()}
                      </span>
                      <Button variant="primary" size="sm" as={Link} to={`/services/${subService.parentService?.slug || subService.parentServiceSlug}/${subService.slug}`}>
                        View Details
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section background="primary" padding="4xl">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Get a custom quote for your vehicle solution. Our team is ready to help you find the perfect fit.
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

export default ServicesPage;

