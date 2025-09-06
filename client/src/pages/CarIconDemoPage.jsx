import React from 'react';
import { Helmet } from 'react-helmet-async';
import CarIcon from '../components/CarIcon';
import { Container, Section, Card } from '../components/ui';

const CarIconDemoPage = () => {
  return (
    <>
      <Helmet>
        <title>Car Icon Component Demo</title>
        <meta name="description" content="Demo page for the CarIcon component showcasing different sizes and usage examples." />
      </Helmet>

      <Section padding="4xl">
        <Container>
          <Section.Header
            title="Car Icon Component"
            subtitle="A minimalist car icon design with colorful tabs"
            align="center"
            className="mb-12"
          />
          
          <div className="space-y-12">
            {/* Different Sizes */}
            <Card variant="elevated">
              <Card.Body>
                <Card.Title className="text-2xl mb-6">Different Sizes</Card.Title>
                <div className="flex flex-wrap items-center justify-center gap-8">
                  <div className="flex flex-col items-center gap-2">
                    <CarIcon size="small" />
                    <span className="text-sm text-gray-600">Small</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <CarIcon size="medium" />
                    <span className="text-sm text-gray-600">Medium</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <CarIcon size="large" />
                    <span className="text-sm text-gray-600">Large</span>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Multiple Icons */}
            <Card variant="elevated">
              <Card.Body>
                <Card.Title className="text-2xl mb-6">Multiple Icons</Card.Title>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <CarIcon />
                  <CarIcon />
                  <CarIcon />
                  <CarIcon />
                  <CarIcon />
                </div>
              </Card.Body>
            </Card>

            {/* Usage Example */}
            <Card variant="elevated">
              <Card.Body>
                <Card.Title className="text-2xl mb-6">Usage Example</Card.Title>
                <div className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
{`import CarIcon from './components/CarIcon';

// Basic usage
<CarIcon />

// With custom size
<CarIcon size="large" />

// With custom className
<CarIcon className="my-custom-class" />`}
                  </pre>
                </div>
              </Card.Body>
            </Card>

            {/* Features */}
            <Card variant="elevated">
              <Card.Body>
                <Card.Title className="text-2xl mb-6">Features</Card.Title>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✅</span>
                    <span>Responsive design</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✅</span>
                    <span>Hover effects</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✅</span>
                    <span>Multiple sizes (small, medium, large)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✅</span>
                    <span>Customizable with CSS classes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✅</span>
                    <span>SVG-based for crisp rendering</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✅</span>
                    <span>Matches the original design exactly</span>
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
};

export default CarIconDemoPage;
