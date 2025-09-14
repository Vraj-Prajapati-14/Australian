import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import { useThemeSettings } from '../hooks/useThemeSettings';
import StatisticsSection from '../components/StatisticsSection';
import Hero from '../components/Hero';
import { Container, Section, Button, Card, Badge } from '../components/ui';
import '../styles/about-page.css';

const AboutPage = () => {
  const [visibleSteps, setVisibleSteps] = useState(new Set());
  const timelineRef = useRef(null);
  const settings = useThemeSettings();
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Intersection Observer for timeline steps
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = entry.target.dataset.stepIndex;
            setVisibleSteps(prev => new Set([...prev, stepIndex]));
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
    );

    const stepElements = document.querySelectorAll('.about-timeline-step');
    stepElements.forEach((el) => observer.observe(el));

    return () => {
      stepElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const { data: teamData, isLoading: teamLoading } = useQuery({ 
    queryKey: ['team'], 
    queryFn: async () => (await api.get('/team')).data 
  });

  const { data: leadershipData, isLoading: leadershipLoading } = useQuery({ 
    queryKey: ['team-leadership'], 
    queryFn: async () => (await api.get('/team/leadership')).data 
  });

  // Fetch departments for filtering
  const { data: departmentsData, isLoading: departmentsLoading } = useQuery({ 
    queryKey: ['departments'], 
    queryFn: async () => (await api.get('/departments')).data 
  });

  // Accept both raw array and { data } shape
  const teamMembers = Array.isArray(teamData) ? teamData : (teamData?.data || []);
  const leadershipTeam = Array.isArray(leadershipData) ? leadershipData : (leadershipData?.data || []);
  const departments = Array.isArray(departmentsData) ? departmentsData : (departmentsData?.data || []);

  // Debug logging to see what data we're getting
  console.log('Team Data from API:', teamData);
  console.log('Processed Team Members:', teamMembers);
  console.log('Departments Data:', departmentsData);
  console.log('Processed Departments:', departments);
  
  // Check if specialties and qualifications exist in the data
  if (teamMembers.length > 0) {
    console.log('Sample team member data structure:', teamMembers[0]);
    console.log('Sample specialties:', teamMembers[0]?.specialties);
    console.log('Sample qualifications:', teamMembers[0]?.qualifications);
  }

  // Sample team data for demonstration (replace with actual API data)
  const sampleTeamData = [
    {
      _id: '1',
      name: 'Emma Rodriguez',
      role: 'Project Engineer',
      department: 'engineering',
      experience: '8+',
      image: null, // Will show placeholder
      bio: 'Rising star in process engineering with a passion for delivering exceptional client outcomes and maintaining quality standards.',
      skills: ['Process Engineering', 'Quality Assurance', 'Client Relations', 'Project Management'],
      certifications: ['Process Engineering Diploma', 'ISO 9001 Lead Auditor', 'Six Sigma Green Belt']
    },
    {
      _id: '2',
      name: 'James Wilson',
      role: 'Field Services Supervisor',
      department: 'field-services',
      experience: '25+',
      image: null,
      bio: 'Hands-on leader with extensive field experience ensuring all projects meet safety and quality requirements.',
      skills: ['Field Operations', 'Maintenance', 'Emergency Response', 'Team Leadership'],
      certifications: ['Trade Qualified Mechanic', 'Safety Officer Certification', 'First Aid Trainer']
    },
    {
      _id: '3',
      name: 'Dr. Lisa Park',
      role: 'Innovation & Research Director',
      department: 'innovation',
      experience: '12+',
      image: null,
      bio: 'Driving innovation in mechanical services through research and implementation of cutting-edge technologies.',
      skills: ['R&D', 'New Technologies', 'Industry 4.0', 'Strategic Planning'],
      certifications: ['PhD Mechanical Engineering', 'Research Leadership Certified', 'Patent Holder']
    }
  ];

  // Use sample data if no real data available
  const displayTeamMembers = teamMembers.length > 0 ? teamMembers : sampleTeamData;

  // Journey Map Data with professional icons
  const journeySteps = [
    {
      year: '1993',
      title: 'Company Founded',
      description: 'Started with a vision to revolutionize the automotive industry with innovative service body solutions',
      icon: 'foundation',
      milestone: 'Foundation'
    },
    {
      year: '2000',
      title: 'First Major Project',
      description: 'Successfully completed our first large-scale installation project and established national presence',
      icon: 'growth',
      milestone: 'Growth'
    },
    {
      year: '2005',
      title: 'ISO Certification',
      description: 'Achieved ISO 9001 (Quality), ISO 14001 (Environment) and ISO 45001 (Safety) compliance',
      icon: 'certification',
      milestone: 'Certification'
    },
    {
      year: '2010',
      title: 'Innovation Hub',
      description: 'Launched our innovation and research division with 190+ modular accessories',
      icon: 'innovation',
      milestone: 'Innovation'
    },
    {
      year: '2015',
      title: 'Digital Transformation',
      description: 'Implemented cutting-edge digital solutions and processes for enhanced customer experience',
      icon: 'digital',
      milestone: 'Digital'
    },
    {
      year: '2023',
      title: 'Industry Leader',
      description: 'Recognized as Australia\'s only manufacturer with company-owned national installation network',
      icon: 'leadership',
      milestone: 'Leadership'
    }
  ];


  if (teamLoading || leadershipLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  const general = settings?.general || {};
  const business = settings?.business || {};

  // Calculate years of experience dynamically
  const currentYear = new Date().getFullYear();
  const foundedYear = general.founded ? parseInt(general.founded) : 1993;
  const yearsExperience = currentYear - foundedYear;

  // Fit for Purpose Checklist with professional icons
  const fitForPurposeChecklist = [
    {
      question: 'Is it aluminium?',
      answer: 'for durability, the lowest weight and maximum payload?',
      icon: 'material',
      iconName: 'Aluminium Material'
    },
    {
      question: 'Can you work out of it?',
      answer: 'Gullwing doors that shelter from rain and sun?',
      icon: 'weather',
      iconName: 'Weather Protection'
    },
    {
      question: 'Will your gear move around?',
      answer: 'How will you fit, organise and tie-down tools and stock?',
      icon: 'organization',
      iconName: 'Tool Organization'
    },
    {
      question: 'Is it secure?',
      answer: 'e.g. central locking.',
      icon: 'security',
      iconName: 'Security Features'
    },
    {
      question: 'Is your seal on the door?',
      answer: 'Seals around the entrance are easily damaged when loading or unloading, letting in dust/water thereafter.',
      icon: 'seal',
      iconName: 'Door Seals'
    },
    {
      question: 'Is it durable?',
      answer: `A ${general.siteName || general.companyName || 'Australian Engineering Solutions'} will not develop structural cracks or rust.`,
      icon: 'durability',
      iconName: 'Durability'
    },
    {
      question: 'Has it got integrated roof, ceiling, wall and underfloor fixing tracks?',
      answer: 'Consider how you\'ll add or move accessories without drilling.',
      icon: 'mounting',
      iconName: 'Mounting System'
    },
    {
      question: 'Do your utes look, function and perform consistently?',
      answer: 'Ensure your team has a consistent fleet, nationally.',
      icon: 'consistency',
      iconName: 'Fleet Consistency'
    },
    {
      question: 'Have you reviewed our 120 accessory groups?',
      answer: 'Ensure your mobile teams are productive.',
      icon: 'accessories',
      iconName: 'Accessories'
    },
    {
      question: 'Do you have national safety compliance?',
      answer: 'Be ready for any mining, construction, airport or roadside job.',
      icon: 'compliance',
      iconName: 'Safety Compliance'
    }
  ];

  // Stats data with fallbacks
  const statsData = [
    {
      number: yearsExperience,
      label: 'Years Experience',
      suffix: ''
    },
    {
      number: general.employees || '290',
      label: 'Staff Nationwide',
      suffix: '+'
    },
    {
      number: '190',
      label: 'Accessories Available',
      suffix: '+'
    },
    {
      number: '24,000',
      label: 'Unique Builds',
      suffix: '+'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - {general.siteName || general.companyName || 'Australian Engineering Solutions'}</title>
        <meta name="description" content={`Learn about ${general.siteName || general.companyName || 'Australian Engineering Solutions'}'s journey, team, and commitment to excellence in automotive service body solutions.`} />
      </Helmet>

      {/* Hero Section - Clean Design */}
      <section className="about-hero">
        <div className="hero-content">
          <div className="australian-tag">
            <span className="au-icon"></span>
            Proudly Australian Owned & Operated
          </div>
          <h1 className="hero-title">
            About <span className="company-name">{general.siteName || general.companyName || 'Australian Engineering Solutions'}</span>
          </h1>
          <p className="hero-subtitle">
            Three decades of mechanical excellence, serving Australia's most demanding industries with innovative solutions and unwavering commitment to quality.
          </p>
        </div>
      </section>

      {/* Stats Section using existing StatisticsSection component */}
      {/* <StatisticsSection 
        variant="default"
        showAwards={true}
        showTagline={true}
        customStats={statsData}
      /> */}

      {/* Our Story & Values Section */}
      <section className="our-story-values">
        <Container size="6xl">
          <div className="story-values-grid">
            {/* Our Story Column */}
            <div className="our-story-column">
              <h2 className="our-story-title">Our Story</h2>
              <p className="our-story-text">
                Founded in {foundedYear}, {general.siteName || general.companyName || 'Australian Engineering Solutions'} began as a vision to provide exceptional mechanical services to Australian industries. What started as a small team of passionate engineers has grown into the nation's most trusted mechanical services provider.
              </p>
              <p className="our-story-text">
                Today, we combine traditional craftsmanship with cutting-edge technology, delivering solutions that keep Australia's industries running efficiently and safely. Our commitment to excellence has earned us the trust of leading companies across mining, manufacturing, and infrastructure sectors.
              </p>
              <Link to="/projects" className="our-story-button">
                View Our Projects
                <span className="arrow-icon"></span>
              </Link>
            </div>

            {/* Our Values Column */}
            <div className="our-values-column">
              <h3 className="our-values-title">Our Values</h3>
              <ul className="values-list">
                <li className="value-item">
                  <div className="value-icon"></div>
                  <div className="value-content">
                    <h4 className="value-title">Excellence</h4>
                    <p className="value-description">We deliver exceptional quality in every project, exceeding industry standards.</p>
                  </div>
                </li>
                <li className="value-item">
                  <div className="value-icon"></div>
                  <div className="value-content">
                    <h4 className="value-title">Innovation</h4>
                    <p className="value-description">Cutting-edge technology and modern solutions for complex mechanical challenges.</p>
                  </div>
                </li>
                <li className="value-item">
                  <div className="value-icon"></div>
                  <div className="value-content">
                    <h4 className="value-title">Reliability</h4>
                    <p className="value-description">24/7 support and maintenance services you can depend on.</p>
                  </div>
                </li>
                <li className="value-item">
                  <div className="value-icon"></div>
                  <div className="value-content">
                    <h4 className="value-title">Safety</h4>
                    <p className="value-description">Zero-compromise approach to workplace safety and compliance.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Australian Manufacturing Excellence Section */}
      <section className="manufacturing-excellence">
        <Container size="6xl">
          <div className="section-header">
            <h2 className="section-title">Australian Manufacturing Excellence</h2>
            <p className="section-subtitle">Industry leadership through innovation, quality, and customer focus</p>
          </div>
          
          <div className="manufacturing-grid">
            <div className="manufacturing-card">
              <h3 className="card-title">
                <span className="icon">🏭</span>
                Industry Leadership
              </h3>
              <p className="card-text">
                {general.siteName || general.companyName || 'Australian Engineering Solutions'} is Australia's only manufacturer of service bodies for utes, trailers and trucks with a company-owned national installation network. We build fit-for-purpose aluminium canopies for trades and industry, and we are ISO 9001 (Quality), ISO 14001 (Environment) and ISO 45001 (Safety) compliant.
              </p>
              <p className="card-text">
                {general.siteName || general.companyName || 'Australian Engineering Solutions'} is vertically integrated, offering over 190 modular and electrical accessories to turn your service body into a truly mobile workspace. These range from shelving, benches, roof storage and drawers, to towbars, inverters, lighting and much more.
              </p>
              <p className="card-text">
                Built like an aircraft fuselage, our light and strong aluminium canopies are engineered to maximise payload and stability, improve fuel efficiency, and be resistant to corrosion, UV damage and vibration.
              </p>
            </div>
            
            <div className="manufacturing-card">
              <h3 className="card-title">
                <span className="icon">✨</span>
                Why Choose Us?
              </h3>
              <div className="feature-card">
                <h4 className="feature-title">
                  <span className="icon">🏆</span>
                  Industry Leadership
                </h4>
                <p className="feature-description">
                  Australia's leading service body manufacturer with a company-owned national installation network.
                </p>
              </div>
              
              <div className="feature-card">
                <h4 className="feature-title">
                  <span className="icon">🛡️</span>
                  Triple ISO Certification
                </h4>
                <p className="feature-description">
                  ISO 9001 (Quality), ISO 14001 (Environment) and ISO 45001 (Safety) compliant.
                </p>
              </div>
              
              <div className="feature-card">
                <h4 className="feature-title">
                  <span className="icon">🔧</span>
                  190+ Accessories
                </h4>
                <p className="feature-description">
                  Comprehensive range of modular and electrical accessories for complete mobile workspace solutions.
                </p>
              </div>
              
              <div className="feature-card">
                <h4 className="feature-title">
                  <span className="icon">⭐</span>
                  {yearsExperience} Years of Excellence
                </h4>
                <p className="feature-description">
                  Our service bodies have been bulletproof in the field since {foundedYear}, evolving through continuous improvement.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Company Roadmap Section */}
      <section className="roadmap-section">
        <Container size="6xl">
          <div className="section-header">
            <h2 className="section-title">Company Roadmap</h2>
            <p className="section-subtitle">Three decades of growth, innovation, and excellence in Australian mechanical services</p>
          </div>
          
          <div className="roadmap-timeline">
            {journeySteps.map((step, index) => (
              <div key={index} className={`roadmap-step roadmap-step-${index + 1}`} data-step-index={index}>
                <div className="roadmap-content">
                  <div className="roadmap-milestone">
                    <span className="milestone-badge">{step.milestone}</span>
                  </div>
                  <div className="roadmap-year">
                    <span className="calendar-icon"></span>
                    {step.year}
                  </div>
                  <h3 className="roadmap-title">{step.title}</h3>
                  <p className="roadmap-description">{step.description}</p>
                </div>
                <div className="roadmap-node">
                  <div className={`node-icon node-icon-${step.icon}`}>
                    <svg className="icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {step.icon === 'foundation' && (
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      )}
                      {step.icon === 'growth' && (
                        <path d="M3 3v18h18V3H3zM9 9h6v6H9V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      )}
                      {step.icon === 'certification' && (
                        <>
                          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 21c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </>
                      )}
                      {step.icon === 'innovation' && (
                        <>
                          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </>
                      )}
                      {step.icon === 'digital' && (
                        <>
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3.27 6.96L12 12.01l8.73-5.05" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </>
                      )}
                      {step.icon === 'leadership' && (
                        <>
                          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M19 15L19.74 12.26L23 12L19.74 11.74L19 9L18.26 11.74L15 12L18.26 12.26L19 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5 15L5.74 12.26L9 12L5.74 11.74L5 9L4.26 11.74L1 12L4.26 12.26L5 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </>
                      )}
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Fit for Purpose Checklist */}
      <section className="checklist-section">
        <Container size="6xl">
          <div className="section-header">
            <h2 className="section-title">Fit for Purpose Checklist</h2>
            <p className="section-subtitle">Essential questions to ensure your service body meets your needs</p>
          </div>
          
          <div className="checklist-grid">
            {fitForPurposeChecklist.map((item, index) => (
              <div key={index} className="checklist-item">
                <div className={`checklist-icon checklist-icon-${item.icon}`}>
                  <svg className="icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {item.icon === 'material' && (
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    )}
                    {item.icon === 'weather' && (
                      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    )}
                    {item.icon === 'organization' && (
                      <>
                        <path d="M3 7V5a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M17 3h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 17v2a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 21H5a2 2 0 0 1-2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="7" y="7" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2"/>
                      </>
                    )}
                    {item.icon === 'security' && (
                      <>
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </>
                    )}
                    {item.icon === 'seal' && (
                      <>
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3.27 6.96L12 12.01l8.73-5.05" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </>
                    )}
                    {item.icon === 'durability' && (
                      <>
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </>
                    )}
                    {item.icon === 'mounting' && (
                      <>
                        <path d="M3 3h18v18H3zM9 9h6v6H9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 3v6M15 3v6M9 15v6M15 15v6M3 9h6M15 9h6M3 15h6M15 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </>
                    )}
                    {item.icon === 'consistency' && (
                      <>
                        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 21c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </>
                    )}
                    {item.icon === 'accessories' && (
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    )}
                    {item.icon === 'compliance' && (
                      <>
                        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 21c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </>
                    )}
                  </svg>
                </div>
                <div className="checklist-content">
                  <h4 className="checklist-question">{item.question}</h4>
                  <p className="checklist-answer">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why Choose Section */}
      <section className="why-choose-section">
        <Container size="6xl">
          <div className="section-header">
            <h2 className="section-title">Why Choose {general.siteName || general.companyName || 'Australian Engineering Solutions'}?</h2>
            <p className="section-subtitle">Industry-leading expertise, cutting-edge technology, and unwavering commitment to excellence</p>
          </div>
          
          <div className="why-choose-grid">
            <div className="why-choose-item">
              <div className="why-choose-icon"></div>
              <div className="why-choose-text">30+ years of proven industry experience</div>
            </div>
            <div className="why-choose-item">
              <div className="why-choose-icon"></div>
              <div className="why-choose-text">50+ certified engineers and technicians</div>
            </div>
            <div className="why-choose-item">
              <div className="why-choose-icon"></div>
              <div className="why-choose-text">24/7 emergency response capability</div>
            </div>
            <div className="why-choose-item">
              <div className="why-choose-icon"></div>
              <div className="why-choose-text">Licensed and fully insured operations</div>
            </div>
            <div className="why-choose-item">
              <div className="why-choose-icon"></div>
              <div className="why-choose-text">Advanced predictive maintenance technology</div>
            </div>
            <div className="why-choose-item">
              <div className="why-choose-icon"></div>
              <div className="why-choose-text">Comprehensive warranty on all services</div>
            </div>
            <div className="why-choose-item">
              <div className="why-choose-icon"></div>
              <div className="why-choose-text">Professional Engineers Australia member</div>
            </div>
            <div className="why-choose-item">
              <div className="why-choose-icon"></div>
              <div className="why-choose-text">ISO 9001 certified quality management</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Team Section with Department Filtering */}
      <Section background="light" padding="4xl" className="team-section">
        <Container size="6xl">
          <div className="section-header">
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-subtitle">Our dedicated team of professionals is committed to delivering exceptional service and innovative solutions.</p>
          </div>

          {/* Department Filter */}
          <div className="department-filter mb-12">
            {departmentsLoading ? (
              <div className="flex justify-center">
                <div className="spinner"></div>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setSelectedDepartment('all')}
                  className={`department-tab ${selectedDepartment === 'all' ? 'active' : ''}`}
                >
                  All Departments
                </button>
                {departments.map(dept => (
                  <button
                    key={dept._id}
                    onClick={() => setSelectedDepartment(dept.name.toLowerCase())}
                    className={`department-tab ${selectedDepartment === dept.name.toLowerCase() ? 'active' : ''}`}
                  >
                    {dept.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Team Members Grid */}
          {teamLoading ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : Array.isArray(displayTeamMembers) && displayTeamMembers.length > 0 ? (
            <div className="team-grid">
              {displayTeamMembers
                .filter(member => {
                  if (selectedDepartment === 'all') return true;
                  
                  // Debug logging
                  console.log('Filtering member:', member.name, 'Department:', member.department, 'Selected:', selectedDepartment);
                  
                  // Handle different department data structures
                  if (member.department) {
                    if (typeof member.department === 'string') {
                      return member.department.toLowerCase() === selectedDepartment;
                    } else if (member.department.name) {
                      return member.department.name.toLowerCase() === selectedDepartment;
                    } else if (member.department._id) {
                      // If department is an object with _id, find the department name
                      const dept = departments.find(d => d._id === member.department._id);
                      return dept && dept.name.toLowerCase() === selectedDepartment;
                    }
                  }
                  return false;
                })
                .map((member) => (
                  <div key={member._id} className="team-member-card">
                    {/* Member Image */}
                    <div className="member-image">
                      {member.avatar?.url ? (
                        <img 
                          src={member.avatar.url} 
                          alt={member.name} 
                          className="member-avatar"
                          />
                        ) : (
                        <div className="member-avatar-placeholder">
                          <span className="text-2xl">👤</span>
                        </div>
                        )}
                      </div>

                    {/* Experience Badge */}
                    <div className="experience-badge">
                      {member.experience ? `${member.experience}+ years` : '5+ years'}
                    </div>

                    {/* Member Info */}
                    <div className="member-info">
                      <h3 className="member-name">{member.name}</h3>
                      <p className="member-role">{member.role}</p>
                      <p className="member-description">
                        {member.bio || 'Dedicated professional committed to excellence and innovation.'}
                      </p>
                    </div>

                                          {/* Specialties/Skills */}
                      {member.specialties && Array.isArray(member.specialties) && member.specialties.length > 0 && (
                        <div className="member-specialties">
                          <h4 className="specialties-title">Skills & Expertise</h4>
                          <div className="specialties-badges">
                            {member.specialties.map((specialty, index) => (
                              <Badge key={index} variant="secondary" className="specialty-badge">
                                {specialty}
                              </Badge>
                ))}
              </div>
            </div>
          )}

                      {/* Qualifications */}
                      {member.qualifications && Array.isArray(member.qualifications) && member.qualifications.length > 0 && (
                        <div className="member-certifications">
                          <h4 className="certifications-title">Certifications</h4>
                          <ul className="certifications-list">
                            {member.qualifications.map((qual, index) => (
                              <li key={index} className="certification-item">
                                {qual}
                              </li>
                            ))}
                          </ul>
            </div>
          )}

                    {/* Department Info */}
                    <div className="member-department">
                      <span className="department-tag">
                        {member.department?.name || member.department || 'No Department'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <Card variant="elevated" className="text-center py-12">
              <Card.Body>
                <div className="text-6xl mb-4">👥</div>
                <Card.Title className="text-xl text-gray-600 mb-4">
                  No team members found
                </Card.Title>
                <Card.Text className="text-gray-500">
                  {selectedDepartment === 'all' 
                    ? 'No team members have been added yet. Check back soon!' 
                    : `No team members found in the ${selectedDepartment} department.`}
                </Card.Text>
              </Card.Body>
            </Card>
          )}
        </Container>
      </Section>

      {/* CTA Section - Using exact same structure as HomePage */}
      <section className="cta-section">
        <Container>
          <div className="cta-content">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-subtitle">
              Contact us today for a free consultation and quote
            </p>
            <div className="cta-buttons">
              <Link to="/contact">
                <Button variant="primary" size="lg" className="cta-button-primary">
                  Contact Us
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg" className="cta-button-secondary">
                  View Services
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default AboutPage; 