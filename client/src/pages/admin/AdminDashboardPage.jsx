import { useState, useEffect } from 'react';
import { Card, Table, Tag, Button } from '../../components/ui';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

// Helper components for icons
const CarIcon = () => <span>🚗</span>;
const ContainerIcon = () => <span>📦</span>;
const FileIcon = () => <span>📄</span>;
const PictureIcon = () => <span>🖼️</span>;
const PlusIcon = () => <span>+</span>;
const EyeIcon = () => <span>👁️</span>;

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  // Fetch data for dashboard
  const { data: services = [], isLoading: servicesLoading, error: servicesError } = useQuery({ 
    queryKey: ['services'], 
    queryFn: async () => {
      try {
        const response = await api.get('/services');
        return response.data || [];
      } catch (error) {
        return [];
      }
    }
  });

  const { data: projects = [], isLoading: projectsLoading, error: projectsError } = useQuery({ 
    queryKey: ['projects'], 
    queryFn: async () => {
      try {
        const response = await api.get('/projects');
        return response.data?.data || [];
      } catch (error) {
        return [];
      }
    }
  });

  const { data: caseStudies = [], isLoading: caseStudiesLoading, error: caseStudiesError } = useQuery({ 
    queryKey: ['caseStudies'], 
    queryFn: async () => {
      try {
        const response = await api.get('/case-studies');
        return response.data?.data || [];
      } catch (error) {
        return [];
      }
    }
  });

  const { data: inspirationItems = [], isLoading: inspirationLoading, error: inspirationError } = useQuery({ 
    queryKey: ['inspirationItems'], 
    queryFn: async () => {
      try {
        const response = await api.get('/inspiration');
        return response.data?.data || [];
      } catch (error) {
        return [];
      }
    }
  });

  // Use API data with proper error handling and safety checks
  const allServices = Array.isArray(services) ? services : [];
  
  // Filter main services and sub-services properly
  const mainServices = allServices.filter(s => s.isMainService === true);
  const subServices = allServices.filter(s => s.isMainService === false);
  
  const activeServices = allServices.filter(s => s.status === 'active' || s.status === 'published' || !s.status);
  const activeProjects = Array.isArray(projects) ? projects.filter(p => p.status === 'active' || p.status === 'completed') : [];
  const publishedCaseStudies = Array.isArray(caseStudies) ? caseStudies.filter(c => c.status === 'active') : [];
  const publishedInspiration = Array.isArray(inspirationItems) ? inspirationItems.filter(i => i.status === 'published') : [];

  // Calculate totals correctly
  const totalMainServices = mainServices.length;
  const totalSubServices = subServices.length;

  // Check for any loading states
  const isLoading = servicesLoading || projectsLoading || caseStudiesLoading || inspirationLoading;
  
  // Check for any errors
  const hasError = servicesError || projectsError || caseStudiesError || inspirationError;

  // Statistics
  const stats = [
    {
      title: 'Main Services',
      value: totalMainServices,
      icon: <CarIcon />,
      color: '#1677ff'
    },
    {
      title: 'Sub-Services',
      value: totalSubServices,
      icon: <ContainerIcon />,
      color: '#52c41a'
    },
    {
      title: 'Case Studies',
      value: publishedCaseStudies.length,
      icon: <FileIcon />,
      color: '#fa8c16'
    },
    {
      title: 'Inspiration Items',
      value: publishedInspiration.length,
      icon: <PictureIcon />,
      color: '#722ed1'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'published':
      case 'completed':
        return 'green';
      case 'inactive':
      case 'draft':
        return 'red';
      default:
        return 'default';
    }
  };

  // Quick action handlers
  const handleQuickAction = (action) => {
    switch (action) {
      case 'add-service':
        navigate('/admin/services');
        break;
      case 'add-project':
        navigate('/admin/projects');
        break;
      case 'add-case-study':
        navigate('/admin/case-studies');
        break;
      case 'add-inspiration':
        navigate('/admin/inspiration');
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #1677ff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <div style={{ marginTop: '16px', color: '#666', fontSize: '16px' }}>Loading dashboard data...</div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ 
          background: '#fff2f0', 
          border: '1px solid #ffccc7', 
          borderRadius: '8px', 
          padding: '16px', 
          marginBottom: '16px' 
        }}>
          <h3 style={{ color: '#ff4d4f', margin: '0 0 8px 0' }}>Error Loading Dashboard</h3>
          <p style={{ color: '#666', margin: 0 }}>There was an error loading the dashboard data. Please try refreshing the page.</p>
        </div>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', background: '#ffffff', minHeight: '100vh' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: '#262626', marginBottom: '8px', fontWeight: '700', fontSize: '28px' }}>
          Dashboard Overview
        </h1>
        <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
          Welcome to the HIDRIVE Admin Panel
        </p>
      </div>
      
      {/* Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {stats.map((stat, index) => (
          <Card key={index} style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: `${stat.color}15`, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 16px',
              fontSize: '24px'
            }}>
              {stat.icon}
            </div>
            <div style={{ color: stat.color, fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
              {stat.value}
            </div>
            <div style={{ color: '#666', fontSize: '16px', fontWeight: '500' }}>
              {stat.title}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Quick Actions */}
        <Card>
          <div style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button 
                variant="primary" 
                fullWidth
                onClick={() => handleQuickAction('add-service')}
              >
                <PlusIcon /> Add New Service
              </Button>
              <Button 
                variant="outline" 
                fullWidth
                onClick={() => handleQuickAction('add-project')}
              >
                <ContainerIcon /> Add New Project
              </Button>
              <Button 
                variant="outline" 
                fullWidth
                onClick={() => handleQuickAction('add-case-study')}
              >
                <FileIcon /> Create Case Study
              </Button>
              <Button 
                variant="outline" 
                fullWidth
                onClick={() => handleQuickAction('add-inspiration')}
              >
                <PictureIcon /> Add Inspiration Item
              </Button>
            </div>
          </div>
        </Card>

        {/* Featured Items */}
        <Card>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Featured Items</h3>
              <Button variant="ghost" style={{ color: '#1677ff' }}>View All</Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <p style={{ fontWeight: 'bold', color: '#262626', margin: '0 0 8px 0' }}>Featured Services:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {mainServices.filter(s => s.isFeatured).slice(0, 3).map(service => (
                    <Tag key={service._id} color="blue">
                      {service.title}
                    </Tag>
                  ))}
                  {mainServices.filter(s => s.isFeatured).length === 0 && (
                    <span style={{ color: '#999', fontSize: '12px' }}>No featured services</span>
                  )}
                </div>
              </div>
              
              <div>
                <p style={{ fontWeight: 'bold', color: '#262626', margin: '0 0 8px 0' }}>Featured Projects:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {activeProjects.filter(p => p.isFeatured).slice(0, 3).map(project => (
                    <Tag key={project._id} color="green">
                      {project.title}
                    </Tag>
                  ))}
                  {activeProjects.filter(p => p.isFeatured).length === 0 && (
                    <span style={{ color: '#999', fontSize: '12px' }}>No featured projects</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Data Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
        {/* Services Table */}
        <Card>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Main Services Overview</h3>
              <Button variant="ghost" style={{ color: '#1677ff' }} onClick={() => navigate('/admin/services')}>View All</Button>
            </div>
            <Table
              dataSource={mainServices.slice(0, 5)}
              columns={[
                {
                  title: 'Main Service',
                  dataIndex: 'title',
                  key: 'title',
                  render: (text, record) => (
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#262626' }}>{text}</div>
                      {record.subServices && record.subServices.length > 0 && (
                        <div style={{ marginTop: '4px' }}>
                          <span style={{ color: '#666', fontSize: '11px' }}>
                            {record.subServices.length} sub-service{record.subServices.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status) => (
                    <Tag color={getStatusColor(status)}>
                      {status === 'active' ? 'Active' : status === 'published' ? 'Published' : 'Inactive'}
                    </Tag>
                  )
                },
                {
                  title: 'Featured',
                  dataIndex: 'isFeatured',
                  key: 'isFeatured',
                  render: (featured) => (
                    <Tag color={featured ? 'gold' : 'default'}>
                      {featured ? 'Yes' : 'No'}
                    </Tag>
                  )
                }
              ]}
              pagination={false}
              size="small"
            />
          </div>
        </Card>

        {/* Projects Table */}
        <Card>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Recent Projects</h3>
              <Button variant="ghost" style={{ color: '#1677ff' }} onClick={() => navigate('/admin/projects')}>View All</Button>
            </div>
            <Table
              dataSource={activeProjects.slice(0, 5)}
              columns={[
                {
                  title: 'Project',
                  dataIndex: 'title',
                  key: 'title',
                  render: (text, record) => (
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#262626' }}>{text}</div>
                      <span style={{ color: '#666', fontSize: '12px' }}>
                        {record.clientName || 'N/A'}
                      </span>
                    </div>
                  )
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status) => (
                    <Tag color={getStatusColor(status)}>
                      {status === 'completed' ? 'Completed' : status === 'in-progress' ? 'In Progress' : 'Planned'}
                    </Tag>
                  )
                },
                {
                  title: 'Featured',
                  dataIndex: 'isFeatured',
                  key: 'isFeatured',
                  render: (featured) => (
                    <Tag color={featured ? 'gold' : 'default'}>
                      {featured ? 'Yes' : 'No'}
                    </Tag>
                  )
                }
              ]}
              pagination={false}
              size="small"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}