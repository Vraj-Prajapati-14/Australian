import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import { Container, Button } from '../components/ui';
import { useThemeSettings } from '../hooks/useThemeSettings';
import { 
  FiExternalLink,
  FiCalendar,
  FiCheckCircle,
} from 'react-icons/fi';
import '../styles/case-studies-page.css';

const CaseStudiesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const settings = useThemeSettings();

  // Fetch case studies from database
  const { data: caseStudiesData, isLoading: caseStudiesLoading } = useQuery({ 
    queryKey: ['case-studies'], 
    queryFn: async () => (await api.get('/case-studies')).data 
  });

  // Fetch departments for filtering
  const { data: departmentsData, isLoading: departmentsLoading } = useQuery({ 
    queryKey: ['departments'], 
    queryFn: async () => (await api.get('/departments')).data 
  });

  const caseStudies = caseStudiesData?.data || [];
  const departments = departmentsData?.data || [];
  const general = settings?.general || {};

  // Enhanced static case study data matching portfolio style
  const staticCaseStudies = [
    {
      _id: 'static-1',
      title: 'Mining Fleet Optimization Project',
      subtitle: 'Complete Fleet Transformation with Advanced Safety Systems',
      shortDescription: 'Complete transformation of a mining company\'s vehicle fleet with custom service bodies and advanced safety systems.',
      description: 'We helped a leading mining company optimize their fleet operations by implementing custom service bodies, advanced safety systems, and integrated tool management solutions. The project involved comprehensive analysis of existing operations, custom design of service bodies, and implementation of cutting-edge safety and tracking systems.',
      clientName: 'Western Mining Corporation',
      completionDate: '2023-08-15',
      status: 'completed',
      service: 'Fleet Management',
      department: 'Mining',
      tags: ['Mining', 'Fleet Management', 'Safety Systems', 'Custom Design'],
      heroImage: { url: '/api/placeholder/600/400' },
      slug: 'mining-fleet-optimization',
      results: {
        vehiclesUpgraded: 45,
        costSavings: 250,
        efficiencyImprovement: 35
      },
      testimonial: {
        text: 'The transformation of our fleet has been remarkable. Productivity increased by 35% and maintenance costs dropped significantly. The custom service bodies and safety systems have revolutionized how we operate in the field.',
        author: 'Michael Thompson',
        position: 'Fleet Operations Manager',
        company: 'Western Mining Corporation'
      },
      technologies: ['Custom Service Bodies', 'GPS Tracking', 'Safety Monitoring', 'Tool Management Systems', 'IoT Sensors', 'Predictive Analytics'],
      features: [
        'Custom service body design optimized for mining operations',
        'Advanced GPS tracking system with geofencing',
        'Real-time safety monitoring with automated alerts',
        'Integrated tool management with RFID tracking',
        'Automated maintenance scheduling based on usage data',
        'Predictive analytics for equipment failure prevention',
        'Mobile app for field technicians',
        'Cloud-based fleet management dashboard'
      ],
      challenge: 'The mining company needed to modernize their aging fleet while improving safety standards and operational efficiency. Their existing vehicles were outdated, lacked proper safety systems, and had no centralized tracking or management capabilities.',
      solution: 'We designed and implemented a comprehensive fleet optimization solution with custom service bodies, advanced tracking systems, and integrated safety monitoring. The solution included IoT sensors, predictive analytics, and a mobile app for field technicians.',
      keyResults: [
        '45 vehicles upgraded with new systems',
        '35% improvement in operational efficiency',
        '$250k in annual cost savings',
        'Zero safety incidents post-implementation',
        '50% reduction in maintenance downtime',
        'Real-time visibility into all fleet operations'
      ],
      process: [
        { phase: 'Discovery & Analysis', description: 'Analyzed existing fleet operations, identified pain points, and gathered requirements from field teams', duration: '2 weeks' },
        { phase: 'Design & Planning', description: 'Created custom service body designs and developed comprehensive implementation plan', duration: '3 weeks' },
        { phase: 'Development & Testing', description: 'Built custom service bodies, integrated tracking systems, and conducted extensive testing', duration: '8 weeks' },
        { phase: 'Deployment & Training', description: 'Rolled out new vehicles and provided comprehensive training to all staff', duration: '2 weeks' },
        { phase: 'Monitoring & Optimization', description: 'Monitored performance and made continuous improvements based on real-world usage', duration: 'Ongoing' }
      ],
      links: {
        live: 'https://mining-fleet-demo.com',
        caseStudy: '/case-studies/mining-fleet-optimization'
      },
      stats: {
        vehicles: '45+',
        efficiency: '35%+',
        savings: '$250K+'
      }
    },
    {
      _id: 'static-2',
      title: 'Emergency Services Vehicle Upgrade',
      subtitle: 'Advanced Emergency Response Fleet with Life-Saving Technology',
      shortDescription: 'Specialized emergency response vehicles equipped with cutting-edge technology and rapid deployment capabilities.',
      description: 'Designed and implemented specialized emergency response vehicles for a major city\'s emergency services department. The project focused on improving response times, enhancing medical capabilities, and ensuring reliable communication in critical situations.',
      clientName: 'Metropolitan Emergency Services',
      completionDate: '2023-06-20',
      status: 'completed',
      service: 'Emergency Vehicles',
      department: 'Emergency Services',
      tags: ['Emergency Services', 'Rapid Deployment', 'Specialized Equipment', 'Public Safety'],
      heroImage: { url: '/api/placeholder/600/400' },
      slug: 'emergency-services-upgrade',
      results: {
        vehiclesUpgraded: 12,
        costSavings: 180,
        efficiencyImprovement: 40
      },
      testimonial: {
        text: 'Response times improved by 40% and our emergency teams are now better equipped than ever before. The new vehicles have saved countless lives and improved our ability to serve the community.',
        author: 'Sarah Martinez',
        position: 'Emergency Services Director',
        company: 'Metropolitan Emergency Services'
      },
      technologies: ['Emergency Lighting', 'Communication Systems', 'Medical Equipment', 'Rapid Deployment', 'GPS Navigation', 'Patient Monitoring'],
      features: [
        'Advanced emergency lighting system with multiple modes',
        'Integrated communication system with dispatch coordination',
        'State-of-the-art medical equipment and supplies',
        'Rapid deployment mechanisms for quick response',
        'GPS navigation with traffic optimization',
        'Real-time patient monitoring systems',
        'Automated inventory tracking for medical supplies',
        'Weather-resistant design for all conditions'
      ],
      challenge: 'The emergency services department needed to upgrade their aging fleet to improve response times and enhance medical capabilities. The existing vehicles lacked modern technology and were not optimized for rapid deployment.',
      solution: 'We designed and built specialized emergency response vehicles with cutting-edge technology, advanced medical equipment, and rapid deployment capabilities. Each vehicle was customized for specific emergency scenarios.',
      keyResults: [
        '12 emergency vehicles upgraded with new technology',
        '40% improvement in response times',
        '$180k in operational cost savings',
        'Enhanced medical capabilities for critical situations',
        'Improved communication with dispatch centers',
        'Zero equipment failures during emergency responses'
      ],
      process: [
        { phase: 'Requirements Analysis', description: 'Analyzed emergency response protocols and identified critical requirements for vehicle upgrades', duration: '2 weeks' },
        { phase: 'Design & Engineering', description: 'Designed specialized vehicle layouts and integrated advanced technology systems', duration: '4 weeks' },
        { phase: 'Manufacturing & Integration', description: 'Built custom vehicles and integrated all emergency response systems', duration: '10 weeks' },
        { phase: 'Testing & Certification', description: 'Conducted comprehensive testing and obtained all necessary certifications', duration: '2 weeks' },
        { phase: 'Training & Deployment', description: 'Trained emergency personnel and deployed vehicles to service areas', duration: '2 weeks' }
      ],
      links: {
        live: 'https://emergency-fleet-demo.com',
        caseStudy: '/case-studies/emergency-services-upgrade'
      },
      stats: {
        vehicles: '12+',
        response: '40%+',
        savings: '$180K+'
      }
    },
    {
      _id: 'static-3',
      title: 'Construction Company Fleet Modernization',
      subtitle: 'Smart Construction Fleet with Integrated Management Systems',
      shortDescription: 'Complete fleet modernization for a major construction company with integrated tool management and safety systems.',
      description: 'Modernized the entire fleet of a major construction company with state-of-the-art service bodies and integrated management systems. The project focused on improving operational efficiency, tool tracking, and safety compliance across all construction sites.',
      clientName: 'Premier Construction Group',
      completionDate: '2023-04-10',
      status: 'completed',
      service: 'Construction Fleet',
      department: 'Construction',
      tags: ['Construction', 'Fleet Modernization', 'Tool Management', 'Safety Systems'],
      heroImage: { url: '/api/placeholder/600/400' },
      slug: 'construction-fleet-modernization',
      results: {
        vehiclesUpgraded: 28,
        costSavings: 320,
        efficiencyImprovement: 28
      },
      testimonial: {
        text: 'Our construction teams are now more efficient and organized. The integrated tool management system has been a game-changer, reducing tool loss by 90% and improving project completion times significantly.',
        author: 'David Chen',
        position: 'Operations Director',
        company: 'Premier Construction Group'
      },
      technologies: ['Tool Management Systems', 'GPS Tracking', 'Safety Monitoring', 'Fleet Analytics', 'RFID Technology', 'Mobile Apps'],
      features: [
        'Comprehensive tool management system with RFID tracking',
        'Real-time GPS tracking for all vehicles and equipment',
        'Advanced safety monitoring with automated compliance reporting',
        'Fleet analytics dashboard for performance optimization',
        'Mobile app for field workers and supervisors',
        'Automated inventory management for tools and materials',
        'Integration with project management software',
        'Weather-resistant design for construction environments'
      ],
      challenge: 'The construction company needed to modernize their fleet to improve tool tracking, reduce losses, and enhance safety compliance. Their existing vehicles lacked proper organization and had no systematic approach to tool management.',
      solution: 'We implemented a comprehensive fleet modernization solution with integrated tool management systems, GPS tracking, and safety monitoring. The solution included RFID technology and mobile apps for real-time visibility.',
      keyResults: [
        '28 construction vehicles modernized with new systems',
        '28% improvement in operational efficiency',
        '$320k in annual cost savings',
        '90% reduction in tool loss and theft',
        'Improved safety compliance across all sites',
        'Real-time visibility into fleet and tool status'
      ],
      process: [
        { phase: 'Site Analysis', description: 'Analyzed construction sites and current fleet operations to identify improvement opportunities', duration: '2 weeks' },
        { phase: 'System Design', description: 'Designed integrated tool management and tracking systems for construction environments', duration: '3 weeks' },
        { phase: 'Implementation', description: 'Installed new systems and trained staff on new procedures and technology', duration: '6 weeks' },
        { phase: 'Testing & Optimization', description: 'Tested systems in real construction environments and made necessary adjustments', duration: '2 weeks' },
        { phase: 'Full Deployment', description: 'Rolled out systems across all construction sites and provided ongoing support', duration: '1 week' }
      ],
      links: {
        live: 'https://construction-fleet-demo.com',
        caseStudy: '/case-studies/construction-fleet-modernization'
      },
      stats: {
        vehicles: '28+',
        efficiency: '28%+',
        savings: '$320K+'
      }
    },
    {
      _id: 'static-4',
      title: 'Telecommunications Infrastructure Support',
      shortDescription: 'Specialized vehicles for telecommunications infrastructure maintenance and installation across remote areas.',
      description: 'Developed specialized vehicles for telecommunications infrastructure maintenance and installation in remote and challenging environments.',
      clientName: 'National Telecom Services',
      completionDate: '2023-02-28',
      status: 'completed',
      service: 'Telecommunications',
      department: 'Telecommunications',
      tags: ['Telecommunications', 'Remote Access', 'Infrastructure', 'Specialized Equipment'],
      heroImage: { url: '/api/placeholder/600/400' },
      slug: 'telecom-infrastructure-support',
      results: {
        vehiclesUpgraded: 18,
        costSavings: 200,
        efficiencyImprovement: 32
      },
      testimonial: 'These specialized vehicles have enabled us to reach remote areas that were previously inaccessible.',
      technologies: ['Specialized Equipment', 'Remote Access Systems', 'Communication Tools', 'Safety Equipment']
    },
    {
      _id: 'static-5',
      title: 'Agricultural Equipment Service Fleet',
      shortDescription: 'Custom agricultural service vehicles designed for farm equipment maintenance and field operations.',
      description: 'Created custom agricultural service vehicles for a large farming operation, enabling efficient equipment maintenance and field operations.',
      clientName: 'Golden Plains Agriculture',
      completionDate: '2023-01-15',
      status: 'completed',
      service: 'Agricultural Services',
      department: 'Agriculture',
      tags: ['Agriculture', 'Farm Equipment', 'Field Operations', 'Custom Design'],
      heroImage: { url: '/api/placeholder/600/400' },
      slug: 'agricultural-service-fleet',
      results: {
        vehiclesUpgraded: 22,
        costSavings: 280,
        efficiencyImprovement: 25
      },
      testimonial: 'Our field operations are now more efficient and our equipment maintenance has never been better organized.',
      technologies: ['Agricultural Tools', 'Field Equipment', 'Maintenance Systems', 'Custom Storage']
    },
    {
      _id: 'static-6',
      title: 'Utilities Maintenance Fleet Enhancement',
      shortDescription: 'Enhanced utility maintenance vehicles with advanced safety systems and specialized equipment for power line maintenance.',
      description: 'Enhanced utility maintenance vehicles with advanced safety systems and specialized equipment for power line and infrastructure maintenance.',
      clientName: 'Regional Power Utilities',
      completionDate: '2022-11-30',
      status: 'completed',
      service: 'Utilities Maintenance',
      department: 'Utilities',
      tags: ['Utilities', 'Power Lines', 'Safety Systems', 'Infrastructure'],
      heroImage: { url: '/api/placeholder/600/400' },
      slug: 'utilities-maintenance-enhancement',
      results: {
        vehiclesUpgraded: 15,
        costSavings: 220,
        efficiencyImprovement: 30
      },
      testimonial: 'Safety improvements and efficiency gains have been outstanding. Our maintenance teams are now better protected and more productive.',
      technologies: ['Safety Systems', 'Specialized Tools', 'Power Equipment', 'Communication Systems']
    }
  ];

  // Combine database and static case studies
  const allCaseStudies = [...caseStudies, ...staticCaseStudies];

  // Filter case studies based on selected department and search query
  const filteredCaseStudies = allCaseStudies.filter(study => {
    // Safety check - ensure study exists and has required properties
    if (!study || typeof study !== 'object') {
      return false;
    }

    // Filter by category
    let categoryMatch = true;
    if (selectedCategory !== 'all') {
      if (study.department) {
        if (typeof study.department === 'object') {
          categoryMatch = study.department.name?.toLowerCase() === selectedCategory.toLowerCase();
        } else {
          categoryMatch = study.department.toLowerCase() === selectedCategory.toLowerCase();
        }
      } else {
        categoryMatch = false;
      }
    }

    // Filter by search query
    let searchMatch = true;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      try {
        searchMatch = 
          study.title?.toLowerCase().includes(query) ||
          study.description?.toLowerCase().includes(query) ||
          study.shortDescription?.toLowerCase().includes(query) ||
          study.clientName?.toLowerCase().includes(query) ||
          (Array.isArray(study.tags) && study.tags.some(tag => 
            typeof tag === 'string' && tag.toLowerCase().includes(query)
          )) ||
          (typeof study.service === 'string' ? study.service.toLowerCase().includes(query) : 
           study.service?.title?.toLowerCase().includes(query));
      } catch (error) {
        console.error('Error in search filter:', error, study);
        searchMatch = false;
      }
    }

    return categoryMatch && searchMatch;
  });

  // Get departments for filter buttons
  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'mining', name: 'Mining' },
    { id: 'emergency services', name: 'Emergency Services' },
    { id: 'construction', name: 'Construction' },
    { id: 'telecommunications', name: 'Telecommunications' },
    { id: 'agriculture', name: 'Agriculture' },
    { id: 'utilities', name: 'Utilities' },
    ...departments.map(dept => ({
      id: dept.name?.toLowerCase().replace(/\s+/g, '-') || dept.slug,
      name: dept.name || 'Department'
    }))
  ];

  if (caseStudiesLoading || departmentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Case Studies & Success Stories - {general.siteName || general.companyName || 'Australian Engineering Solutions'}</title>
        <meta name="description" content={`See how leading fleet managers & trade businesses make certain with ${general.siteName || general.companyName || 'Australian Engineering Solutions'}. Real success stories from real customers.`} />
      </Helmet>

        {/* Hero Section */}
      <section className="case-studies-hero">
        <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            className="case-studies-hero-content"
          >
            <h1 className="case-studies-hero-title">
              Case Studies & Success Stories
            </h1>
            <p className="case-studies-hero-subtitle">
              See how leading fleet managers & trade businesses make certain with {general.siteName || general.companyName || 'Australian Engineering Solutions'}
            </p>
            
            {/* Search Bar */}
            <div className="case-studies-search-container">
              <div className="case-studies-search-bar">
                <input
                  type="text"
                  placeholder="Search case studies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="case-studies-search-input"
                />
                <div className="case-studies-search-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
            </div>
            </motion.div>
        </Container>
        </section>

      {/* Filter Navigation */}
      <section className="case-studies-filters">
        <Container>
          <div className="filters-nav">
              {categories.map((category) => (
              <motion.button
                  key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`filter-button ${selectedCategory === category.id ? 'active' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </Container>
        </section>

        {/* Case Studies Grid */}
      <section className="case-studies-grid">
        <Container>
          {filteredCaseStudies.length > 0 ? (
            <div className="case-studies-list">
              {filteredCaseStudies.map((study, index) => (
                <motion.div
                  key={study._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="case-study-card"
                >
                  <div className="case-study-image">
                    <img 
                      src={study.heroImage?.url || '/placeholder-case-study.jpg'} 
                      alt={study.title}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white" style={{ display: 'none' }}>
                      <div className="text-center">
                        <h3 className="text-xl font-bold mb-2">{study.title}</h3>
                        <p className="text-sm opacity-90">{study.subtitle || study.shortDescription}</p>
                      </div>
                    </div>
                    <div className={`case-study-status ${study.status || 'completed'}`}>
                      {study.status === 'completed' ? 'Completed' : 
                       study.status === 'in-progress' ? 'In Progress' : 
                       study.status === 'draft' ? 'Draft' : 'Completed'}
                    </div>
                  </div>

                  <div className="case-study-content">
                    <div className="case-study-meta">
                      <span className="icon"></span>
                      <span>{study.clientName || 'Client Location'}</span>
                      <span>•</span>
                      <span className="calendar-icon"></span>
                      <span>{new Date(study.completionDate || study.createdAt).getFullYear()}</span>
                    </div>

                    <h3 className="case-study-title">
                      {study.title}
                    </h3>
                    
                    <p className="case-study-description">
                      {study.shortDescription || study.description || 'A comprehensive case study showcasing our expertise and successful project delivery.'}
                    </p>

                    {/* Key Results */}
                    {study.keyResults && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Key Results:</h4>
                      <ul className="space-y-1">
                          {study.keyResults.slice(0, 2).map((result, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>
                    )}

                    {/* Technologies */}
                    {study.technologies && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Technologies:</h4>
                      <div className="flex flex-wrap gap-1">
                          {study.technologies.slice(0, 3).map((tech, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {tech}
                          </span>
                        ))}
                          {study.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{study.technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    )}

                    {/* Stats */}
                    {study.results && (
                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                        {study.results.vehiclesUpgraded && (
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{study.results.vehiclesUpgraded}</div>
                            <div className="text-xs text-gray-500">Vehicles</div>
                          </div>
                        )}
                        {study.results.costSavings && (
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">${study.results.costSavings}k</div>
                            <div className="text-xs text-gray-500">Saved</div>
                          </div>
                        )}
                        {study.results.efficiencyImprovement && (
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{study.results.efficiencyImprovement}%</div>
                            <div className="text-xs text-gray-500">Efficiency</div>
                        </div>
                        )}
                    </div>
                    )}

                    <div className="case-study-links">
                      <Link to={`/case-studies/${study.slug}`} className="case-study-action">
                        View Case Study
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="case-studies-empty">
              <div className="case-studies-empty-icon">📋</div>
              <h3 className="case-studies-empty-title">No Case Studies Found</h3>
              <p className="case-studies-empty-text">
                No case studies match the selected category. Try selecting a different filter or check back later for new content.
              </p>
              </div>
            )}
        </Container>
        </section>

      {/* CTA Section - Using exact same structure as HomePage and AboutPage */}
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

export default CaseStudiesPage;