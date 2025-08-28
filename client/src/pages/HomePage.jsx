import { useState, useEffect, useRef } from 'react';
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Space, 
  Button, 
  Statistic, 
  Avatar, 
  Tag, 
  Divider,
  Carousel,
  List,
  Badge,
  Progress,
  Timeline,
  Image,
  message,
  Spin,
  Alert,
  FloatButton
} from 'antd';
import './HomePage.css';
import { 
  PlayCircleOutlined, 
  CheckCircleOutlined, 
  StarOutlined, 
  TrophyOutlined,
  TeamOutlined,
  RocketOutlined,
  SafetyOutlined,
  CustomerServiceOutlined,
  GlobalOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ArrowRightOutlined,
  CarOutlined,
  ToolOutlined,
  SettingOutlined,
  BulbOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  UpOutlined,
  FireOutlined,
  CrownOutlined,
  ExperimentOutlined,
  CompassOutlined,
  TrophyFilled,
  StarFilled,
  HeartFilled,
  ThunderboltFilled,
  BuildOutlined,
  ApiOutlined,
  CloudOutlined,
  DatabaseOutlined,
  MonitorOutlined,
  BugOutlined,
  SafetyCertificateOutlined,
  AppstoreOutlined,
  DashboardOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  AreaChartOutlined,
  HeatMapOutlined,
  BoxPlotOutlined,
  RadarChartOutlined,
  FunnelPlotOutlined,
  FundOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  BankOutlined,
  CreditCardOutlined,
  WalletOutlined,
  ShoppingOutlined,
  GiftOutlined,
  FireFilled,
  CrownFilled,
  ExperimentFilled,
  CompassFilled
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { usePageSettings } from '../hooks/usePageSettings';
import { Helmet } from 'react-helmet-async';
import { api } from '../lib/api';

const { Title, Paragraph, Text } = Typography;

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const servicesRef = useRef(null);
  const featuresRef = useRef(null);
  const projectsRef = useRef(null);
  const testimonialsRef = useRef(null);
  
  // Use page-specific settings with theme integration
  const { pageSettings, general, appearance, seo } = usePageSettings('home');

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const refs = [heroRef, statsRef, servicesRef, featuresRef, projectsRef, testimonialsRef];
    refs.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Enhanced static data with better content
  const staticStats = {
    projectsCompleted: 850,
    happyClients: 320,
    yearsExperience: 18,
    serviceLocations: 75
  };

  // Enhanced services data inspired by Hidrive
  const staticServices = [
    {
      _id: '1',
      title: 'Mobile Office Solutions',
      shortDescription: 'Transform any vehicle into a fully functional mobile workspace with our innovative engineering solutions.',
      slug: 'mobile-office-solutions',
      heroImage: { url: null },
      subServices: [
        { _id: '1a', title: 'Desk Systems' },
        { _id: '1b', title: 'Storage Solutions' },
        { _id: '1c', title: 'Power Systems' }
      ]
    },
    {
      _id: '2',
      title: 'Custom Engineering',
      shortDescription: 'Bespoke engineering solutions tailored to your specific requirements and industry standards.',
      slug: 'custom-engineering',
      heroImage: { url: null },
      subServices: [
        { _id: '2a', title: 'Design & CAD' },
        { _id: '2b', title: 'Prototyping' },
        { _id: '2c', title: 'Manufacturing' }
      ]
    },
    {
      _id: '3',
      title: 'Fleet Solutions',
      shortDescription: 'Comprehensive fleet management and optimization solutions for businesses of all sizes.',
      slug: 'fleet-solutions',
      heroImage: { url: null },
      subServices: [
        { _id: '3a', title: 'Fleet Analysis' },
        { _id: '3b', title: 'Optimization' },
        { _id: '3c', title: 'Maintenance' }
      ]
    },
    {
      _id: '4',
      title: 'Safety Systems',
      shortDescription: 'Advanced safety and security systems designed to protect your mobile workforce.',
      slug: 'safety-systems',
      heroImage: { url: null },
      subServices: [
        { _id: '4a', title: 'Monitoring' },
        { _id: '4b', title: 'Alerts' },
        { _id: '4c', title: 'Reporting' }
      ]
    },
    {
      _id: '5',
      title: 'Technology Integration',
      shortDescription: 'Seamless integration of cutting-edge technology into your mobile workspace.',
      slug: 'technology-integration',
      heroImage: { url: null },
      subServices: [
        { _id: '5a', title: 'IoT Solutions' },
        { _id: '5b', title: 'Connectivity' },
        { _id: '5c', title: 'Software' }
      ]
    },
    {
      _id: '6',
      title: 'Maintenance Services',
      shortDescription: 'Comprehensive maintenance and support services to keep your systems running optimally.',
      slug: 'maintenance-services',
      heroImage: { url: null },
      subServices: [
        { _id: '6a', title: 'Preventive' },
        { _id: '6b', title: 'Repairs' },
        { _id: '6c', title: 'Updates' }
      ]
    }
  ];

  // Enhanced projects data
  const staticProjects = [
    {
      _id: '1',
      title: 'Emergency Response Vehicle',
      shortDescription: 'Custom mobile command center for emergency services with integrated communication systems.',
      slug: 'emergency-response-vehicle',
      heroImage: { url: null },
      category: 'Emergency Services'
    },
    {
      _id: '2',
      title: 'Mobile Medical Unit',
      shortDescription: 'Fully equipped mobile medical facility with advanced diagnostic and treatment capabilities.',
      slug: 'mobile-medical-unit',
      heroImage: { url: null },
      category: 'Healthcare'
    },
    {
      _id: '3',
      title: 'Field Research Laboratory',
      shortDescription: 'Portable research facility with state-of-the-art equipment for field studies and data collection.',
      slug: 'field-research-laboratory',
      heroImage: { url: null },
      category: 'Research'
    }
  ];

  // Use static data for immediate display (API calls disabled for now)
  const mainServices = staticServices;
  const servicesLoading = false;
  const servicesError = null;

  const { data: featuredProjects = staticProjects, isLoading: projectsLoading, error: projectsError } = useQuery({
    queryKey: ['featuredProjects'],
    queryFn: async () => {
      try {
        const response = await api.get('/projects?featured=true&limit=6');
        return response.data || staticProjects;
      } catch (error) {
        console.error('Error fetching featured projects:', error);
        return staticProjects;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  const { data: stats = staticStats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      try {
        const response = await api.get('/analytics/stats');
        return response.data || staticStats;
      } catch (error) {
        console.error('Error fetching stats:', error);
        return staticStats;
      }
    },
    retry: 1,
    staleTime: 10 * 60 * 1000 // 10 minutes
  });

  // Enhanced features data with black and white theme
  const features = [
    {
      icon: <RocketOutlined />,
      title: "Innovation First",
      description: "Cutting-edge technology and innovative solutions that set industry standards and drive progress",
      color: "#000000",
      gradient: "linear-gradient(135deg, #000000 0%, #333333 100%)"
    },
    {
      icon: <SafetyOutlined />,
      title: "Quality Assured",
      description: "ISO certified manufacturing with rigorous quality control processes ensuring excellence in every detail",
      color: "#000000",
      gradient: "linear-gradient(135deg, #000000 0%, #333333 100%)"
    },
    {
      icon: <CustomerServiceOutlined />,
      title: "24/7 Support",
      description: "Round-the-clock customer support and emergency service response when you need us most",
      color: "#000000",
      gradient: "linear-gradient(135deg, #000000 0%, #333333 100%)"
    },
    {
      icon: <GlobalOutlined />,
      title: "Nationwide Coverage",
      description: "Service network spanning across all Australian states and territories for complete accessibility",
      color: "#000000",
      gradient: "linear-gradient(135deg, #000000 0%, #333333 100%)"
    }
  ];

  // Enhanced testimonials data
  const fallbackTestimonials = [
    {
      name: "Sarah Johnson",
      position: "Fleet Manager",
      company: "Transport Solutions Ltd",
      content: "HIDRIVE transformed our entire fleet with their mobile workspace solutions. The quality and attention to detail is outstanding. Our productivity has increased by 40%!",
      rating: 5,
      avatar: "/images/testimonial-1.jpg",
      badge: "Verified Customer"
    },
    {
      name: "Michael Chen",
      position: "Operations Director",
      company: "Construction Corp",
      content: "Their custom engineering solutions have significantly improved our operational efficiency. The team's expertise and dedication are unmatched. Highly recommended!",
      rating: 5,
      avatar: "/images/testimonial-2.jpg",
      badge: "Premium Client"
    },
    {
      name: "Emma Wilson",
      position: "CEO",
      company: "Mobile Services Australia",
      content: "Professional service from start to finish. Their team went above and beyond our expectations. The results speak for themselves - exceptional quality!",
      rating: 5,
      avatar: "/images/testimonial-3.jpg",
      badge: "Long-term Partner"
    }
  ];

  // Fetch dynamic testimonials
  const { data: testimonials = fallbackTestimonials, isLoading: testimonialsLoading, error: testimonialsError } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      try {
        const response = await api.get('/testimonials/public?featured=true&limit=3');
        return response.data.data || fallbackTestimonials;
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        return fallbackTestimonials;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Hero carousel data with modern messaging
  const heroSlides = [
    {
      title: "Revolutionary Mobile Workspace Solutions",
      subtitle: "Transform your vehicle into a cutting-edge mobile office with our innovative engineering solutions. Experience the future of mobile productivity.",
      image: "/images/hero-1.jpg",
      cta: "Explore Solutions",
      link: "/services",
      badge: "Innovation Leader"
    },
    {
      title: "Custom Engineering Excellence",
      subtitle: "From concept to completion, we deliver precision-engineered solutions that exceed expectations. Your vision, our expertise.",
      image: "/images/hero-2.jpg",
      cta: "View Projects",
      link: "/projects",
      badge: "Award Winning"
    },
    {
      title: "Nationwide Service Network",
      subtitle: "Comprehensive support across Australia with rapid response times and expert technicians. Wherever you are, we're there.",
      image: "/images/hero-3.jpg",
      cta: "Contact Us",
      link: "/contact",
      badge: "24/7 Support"
    }
  ];

  // Get theme colors from settings
  const primaryColor = appearance?.primaryColor || '#000000';
  const secondaryColor = appearance?.secondaryColor || '#ffffff';
  const textColor = appearance?.textColor || '#000000';
  const backgroundColor = appearance?.backgroundColor || '#ffffff';

  return (
    <>
      {/* Dynamic SEO Meta Tags */}
      <Helmet>
        <title>{pageSettings?.title || seo?.metaTitle || general?.siteName || 'Australian Engineering Solutions'}</title>
        <meta name="description" content={pageSettings?.description || seo?.metaDescription || 'Leading mobile workspace solutions and custom engineering services across Australia'} />
        <meta name="keywords" content={pageSettings?.keywords || seo?.metaKeywords || 'mobile workspace, engineering solutions, custom engineering, Australia'} />
        {pageSettings?.ogImage?.url && (
          <meta property="og:image" content={pageSettings.ogImage.url} />
        )}
      </Helmet>

      {/* Dynamic Theme CSS */}
      <style>
        {`
          :root {
            --primary-color: ${primaryColor};
            --secondary-color: ${secondaryColor};
            --text-color: ${textColor};
            --background-color: ${backgroundColor};
            --primary-dark: ${primaryColor === '#000000' ? '#333333' : '#1d4ed8'};
            --primary-light: ${primaryColor === '#000000' ? '#666666' : '#3b82f6'};
            --text-secondary: ${textColor === '#000000' ? '#666666' : '#94a3b8'};
            --text-light: ${textColor === '#000000' ? '#999999' : '#94a3b8'};
            --bg-primary: ${backgroundColor};
            --bg-secondary: ${backgroundColor === '#ffffff' ? '#f8fafc' : '#1a1a1a'};
            --bg-tertiary: ${backgroundColor === '#ffffff' ? '#f1f5f9' : '#2a2a2a'};
            --border-color: ${backgroundColor === '#ffffff' ? '#e2e8f0' : '#404040'};
          }
        `}
      </style>

      {/* Custom CSS from settings */}
      {pageSettings?.customCSS && (
        <style>{pageSettings.customCSS}</style>
      )}

      {/* Error Alerts */}
      {(servicesError || projectsError || statsError || testimonialsError) && (
        <Alert
          message="Data Loading Notice"
          description="Some data is being loaded from cache. The page will update with fresh data shortly."
          type="info"
          showIcon
          className="error-alert"
        />
      )}

      {/* Hero Section */}
      <section className="hero-section" ref={heroRef} id="hero">
        <div className="hero-background">
          <div className="hero-particles"></div>
        </div>
        <Carousel
          autoplay
          effect="fade"
          dots={{ position: 'bottom', style: { bottom: 20 } }}
          beforeChange={(from, to) => setCurrentSlide(to)}
          className="hero-carousel"
        >
          {heroSlides.map((slide, index) => (
            <div key={index} className="hero-slide">
              <div className="hero-content">
                <div className="hero-text">
                  <Badge.Ribbon text={slide.badge} color="default" className="hero-badge">
                    <div className="hero-title-container">
                      <Title level={1} className="hero-title">
                        {slide.title}
                      </Title>
                    </div>
                  </Badge.Ribbon>
                  <Paragraph className="hero-subtitle">
                    {slide.subtitle}
                  </Paragraph>
                  <Space size="large" className="hero-buttons">
                    <Button 
                      type="primary" 
                      size="large"
                      className="hero-cta-primary"
                      icon={<ArrowRightOutlined />}
                    >
                      <Link to={slide.link}>{slide.cta}</Link>
                    </Button>
                    <Button 
                      size="large"
                      className="hero-cta-secondary"
                      icon={<PlayCircleOutlined />}
                    >
                      Watch Video
                    </Button>
                  </Space>
                  <div className="hero-stats">
                    <div className="hero-stat">
                      <Text className="hero-stat-number">850+</Text>
                      <Text className="hero-stat-label">Projects</Text>
                    </div>
                    <div className="hero-stat">
                      <Text className="hero-stat-number">320+</Text>
                      <Text className="hero-stat-label">Clients</Text>
                    </div>
                    <div className="hero-stat">
                      <Text className="hero-stat-number">18+</Text>
                      <Text className="hero-stat-label">Years</Text>
                    </div>
                  </div>
                </div>
                <div className="hero-image">
                  <div className="hero-image-container">
                    <div className="hero-image-placeholder">
                      <CarOutlined className="hero-icon" />
                    </div>
                    <div className="hero-floating-elements">
                      <div className="floating-element element-1">
                        <TrophyFilled />
                      </div>
                      <div className="floating-element element-2">
                        <StarFilled />
                      </div>
                      <div className="floating-element element-3">
                        <HeartFilled />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* Stats Section */}
      <section className="stats-section" ref={statsRef} id="stats">
        <div className="container">
          <div className="stats-background">
            <div className="stats-pattern"></div>
          </div>
          <Row gutter={[32, 32]} justify="center" className="stats-row">
            <Col xs={12} sm={6} className="stat-col">
              <div className="stat-card">
                <div className="stat-icon">
                  <TrophyOutlined />
                </div>
                <Statistic
                  title="Projects Completed"
                  value={stats.projectsCompleted || 850}
                  suffix="+"
                  className="stat-item"
                />
              </div>
            </Col>
            <Col xs={12} sm={6} className="stat-col">
              <div className="stat-card">
                <div className="stat-icon">
                  <HeartOutlined />
                </div>
                <Statistic
                  title="Happy Clients"
                  value={stats.happyClients || 320}
                  suffix="+"
                  className="stat-item"
                />
              </div>
            </Col>
            <Col xs={12} sm={6} className="stat-col">
              <div className="stat-card">
                <div className="stat-icon">
                  <ClockCircleOutlined />
                </div>
                <Statistic
                  title="Years Experience"
                  value={stats.yearsExperience || 18}
                  suffix="+"
                  className="stat-item"
                />
              </div>
            </Col>
            <Col xs={12} sm={6} className="stat-col">
              <div className="stat-card">
                <div className="stat-icon">
                  <GlobalOutlined />
                </div>
                <Statistic
                  title="Service Locations"
                  value={stats.serviceLocations || 75}
                  suffix="+"
                  className="stat-item"
                />
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section" ref={servicesRef} id="services">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Text>Our Services</Text>
            </div>
            <Title level={2} className="section-title">
              Comprehensive Mobile Workspace Solutions
            </Title>
            <Paragraph className="section-subtitle">
              Transform your vehicle into a fully functional mobile office with our cutting-edge engineering solutions
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]} className="services-row">
            {Array.isArray(mainServices) && mainServices.slice(0, 6).map((service, index) => (
              <Col xs={24} sm={12} lg={8} key={service._id} className="service-col">
                <Card 
                  hoverable
                  className="service-card"
                  cover={
                    <div className="service-image">
                      {service.heroImage?.url ? (
                        <Image
                          src={service.heroImage.url}
                          alt={service.title}
                          preview={false}
                        />
                      ) : (
                        <div className="service-image-placeholder">
                          <ToolOutlined className="service-icon" />
                        </div>
                      )}
                      <div className="service-overlay">
                        <Button type="primary" size="large" className="service-overlay-btn">
                          <Link to={`/services/${service.slug}`}>Learn More</Link>
                        </Button>
                      </div>
                    </div>
                  }
                >
                  <Card.Meta
                    title={service.title}
                    description={service.shortDescription}
                  />
                  {service.subServices && Array.isArray(service.subServices) && service.subServices.length > 0 && (
                    <div className="service-subservices">
                      <Text type="secondary">Includes:</Text>
                      <div className="subservice-tags">
                        {service.subServices.slice(0, 3).map((sub) => (
                          <Tag key={sub._id} size="small" color="default">
                            {sub.title}
                          </Tag>
                        ))}
                        {service.subServices.length > 3 && (
                          <Tag size="small">+{service.subServices.length - 3} more</Tag>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
          
          <div className="section-footer">
            <Button 
              type="primary" 
              size="large"
              className="view-all-button"
              icon={<ArrowRightOutlined />}
            >
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" ref={featuresRef} id="features">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Text>Why Choose Us</Text>
            </div>
            <Title level={2} className="section-title">
              Excellence Through Innovation
            </Title>
            <Paragraph className="section-subtitle">
              We deliver excellence through innovation, quality, and customer satisfaction
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]} className="features-row">
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index} className="feature-col">
                <Card className="feature-card">
                  <div className="feature-icon" style={{ background: feature.gradient }}>
                    {feature.icon}
                  </div>
                  <Title level={4} className="feature-title">
                    {feature.title}
                  </Title>
                  <Paragraph className="feature-description">
                    {feature.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="projects-section" ref={projectsRef} id="projects">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Text>Our Work</Text>
            </div>
            <Title level={2} className="section-title">
              Featured Projects
            </Title>
            <Paragraph className="section-subtitle">
              Showcasing our latest work and engineering excellence
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]} className="projects-row">
            {Array.isArray(featuredProjects) && featuredProjects.slice(0, 3).map((project, index) => (
              <Col xs={24} lg={8} key={project._id} className="project-col">
                <Card 
                  hoverable
                  className="project-card"
                  cover={
                    <div className="project-image">
                      {project.heroImage?.url ? (
                        <Image
                          src={project.heroImage.url}
                          alt={project.title}
                          preview={false}
                        />
                      ) : (
                        <div className="project-image-placeholder">
                          <SettingOutlined className="project-icon" />
                        </div>
                      )}
                      <div className="project-overlay">
                        <Button type="primary" size="large" className="project-overlay-btn">
                          <Link to={`/projects/${project.slug}`}>View Project</Link>
                        </Button>
                      </div>
                    </div>
                  }
                >
                  <Card.Meta
                    title={project.title}
                    description={project.shortDescription}
                  />
                  <div className="project-meta">
                    <Tag color="default">{project.category}</Tag>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          
          <div className="section-footer">
            <Button 
              type="primary" 
              size="large"
              className="view-all-button"
              icon={<ArrowRightOutlined />}
            >
              <Link to="/projects">View All Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section" ref={testimonialsRef} id="testimonials">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Text>Testimonials</Text>
            </div>
            <Title level={2} className="section-title">
              What Our Clients Say
            </Title>
            <Paragraph className="section-subtitle">
              Real feedback from satisfied customers across Australia
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]} className="testimonials-row">
            {Array.isArray(testimonials) && testimonials.slice(0, 3).map((testimonial, index) => (
              <Col xs={24} lg={8} key={index} className="testimonial-col">
                <Card className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="testimonial-badge">
                      {testimonial.badge}
                    </div>
                    <div className="testimonial-rating">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarFilled key={i} className="star-icon" />
                      ))}
                    </div>
                    <Paragraph className="testimonial-text">
                      "{testimonial.content}"
                    </Paragraph>
                    <div className="testimonial-author">
                      <Avatar 
                        size={48} 
                        src={testimonial.avatar}
                        className="testimonial-avatar"
                      >
                        {testimonial.name.charAt(0)}
                      </Avatar>
                      <div className="testimonial-info">
                        <Text className="testimonial-name">{testimonial.name}</Text>
                        <Text className="testimonial-position">{testimonial.position}</Text>
                        <Text className="testimonial-company">{testimonial.company}</Text>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="cta">
        <div className="container">
          <div className="cta-background">
            <div className="cta-pattern"></div>
          </div>
          <div className="cta-content">
            <Title level={2} className="cta-title">
              Ready to Transform Your Mobile Workspace?
            </Title>
            <Paragraph className="cta-subtitle">
              Let's discuss how our innovative solutions can enhance your productivity and efficiency
            </Paragraph>
            <Space size="large" className="cta-buttons">
              <Button 
                type="primary" 
                size="large"
                className="cta-button-primary"
                icon={<PhoneOutlined />}
              >
                <Link to="/contact">Get Started Today</Link>
              </Button>
              <Button 
                size="large"
                className="cta-button-secondary"
                icon={<MailOutlined />}
              >
                <Link to="/contact">Request Quote</Link>
              </Button>
            </Space>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <FloatButton.BackTop 
        className="back-to-top"
        icon={<UpOutlined />}
      />
    </>
  );
}

