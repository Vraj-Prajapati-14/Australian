import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import { Container, Section, Button, Card, Badge } from '../components/ui';

const TruckPage = () => {
  const { data: services } = useQuery({ queryKey: ['services'], queryFn: async () => (await api.get('/services')).data })

  const truckServices = services?.filter(s => s.category?.includes('truck')) || []

  const truckTypes = [
    {
      name: 'Service Body Trucks',
      description: 'Heavy-duty service bodies designed for maximum payload and durability. Perfect for demanding industrial applications.',
      icon: '🚚',
      color: 'primary'
    },
    {
      name: 'Crane Mounted',
      description: 'Service bodies with integrated crane systems. Handle heavy loads and equipment with precision and safety.',
      icon: '🏗️',
      color: 'success'
    },
    {
      name: 'Specialized Configurations',
      description: 'Custom truck service bodies for specific industries. Tailored solutions that meet your exact requirements.',
      icon: '⚙️',
      color: 'warning'
    }
  ];

  const features = [
    {
      title: 'Aircraft-Grade Construction',
      description: 'Our aluminium service bodies are engineered using the same techniques as aircraft construction. Polyurethane adhesives and oven bonding ensure years of vibration resistance.',
      icon: '✈️'
    },
    {
      title: 'Integrated Manufacturing',
      description: 'We design, manufacture and install everything in-house. From shelves and benches to towbars and accessories - complete control over quality and delivery.',
      icon: '🏭'
    },
    {
      title: 'Comprehensive Support',
      description: 'National installation network with dedicated customer care. We coordinate with dealers, fleet managers and all stakeholders for seamless delivery.',
      icon: '🛠️'
    },
    {
      title: 'GVM Upgrades & Compliance',
      description: 'Handle your compliant GVM upgrade, bullbar, towbar and fleet branding. One-stop solution for all your truck modification needs.',
      icon: '📋'
    }
  ];

  const industrySolutions = [
    {
      name: 'Government Fleet',
      description: 'Compliant truck service bodies for government operations. Built to meet all standards and requirements.',
      badges: ['ISO Certified', 'Compliant']
    },
    {
      name: 'Mining & Construction',
      description: 'Heavy-duty solutions for the toughest environments. Built to withstand extreme conditions and heavy loads.',
      badges: ['Heavy-Duty', 'Durable']
    },
    {
      name: 'Utility & Service',
      description: 'Professional service bodies for utility companies and service providers. Maximum efficiency and reliability.',
      badges: ['Utility', 'Service']
    }
  ];

  return (
    <>
      <Helmet>
        <title>Truck Service Bodies & Canopies - Australian Equipment Solutions</title>
        <meta name="description" content="Heavy-duty solutions engineered for maximum performance and durability. Built different to be light & strong." />
      </Helmet>

      {/* Hero Section */}
      <Section background="primary" padding="4xl">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Truck Service Bodies & Canopies
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Heavy-duty solutions engineered for maximum performance and durability. Built different to be light & strong.
            </p>
            <Button variant="secondary" size="lg" as={Link} to="/contact">
              Get Quote
            </Button>
          </div>
        </Container>
      </Section>

      {/* Truck Types */}
      <Section padding="4xl">
        <Container>
          <Section.Header
            title="Truck Service Body Types"
            subtitle="Professional solutions for heavy-duty applications"
            align="center"
            className="mb-12"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {truckTypes.map((type, index) => (
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
            title="Why Choose HIDRIVE Truck Solutions"
            subtitle="Built different to be light & strong"
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

      {/* Truck Services */}
      <Section padding="4xl">
        <Container>
          <Section.Header
            title="Truck Service Solutions"
            subtitle="Heavy-duty solutions for every industry"
            align="center"
            className="mb-12"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {truckServices.slice(0, 6).map((service) => (
              <Card key={service._id} variant="elevated" hover>
                <div className="h-48 bg-gray-100 flex items-center justify-center text-4xl text-gray-600">
                  🚚
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

      {/* Government & Industry */}
      <Section background="light" padding="4xl">
        <Container>
          <Section.Header
            title="Government & Industry Solutions"
            subtitle="Compliant solutions for demanding applications"
            align="center"
            className="mb-12"
          />
          
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {industrySolutions.map((solution, index) => (
                <div key={index}>
                  <h4 className="text-xl font-bold text-gray-800 mb-3">
                    {solution.name}
                  </h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {solution.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {solution.badges.map(badge => (
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

      {/* Finance Section */}
      <Section background="primary" padding="4xl">
        <Container>
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Finance for HIDRIVE Service Bodies
                </h3>
                <p className="text-lg text-gray-600">
                  Now available from $104 per week. Flexible payment terms to suit your business needs and cash flow requirements.
                </p>
              </div>
              <div className="flex justify-center md:justify-end">
                <Button variant="primary" size="lg">
                  Find Out More
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section background="primary" padding="4xl">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready for Your Heavy-Duty Solution?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Get a custom quote for your truck service body or canopy.
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

export default TruckPage; 