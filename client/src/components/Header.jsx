import { useState, useEffect } from 'react';
import { Layout, Menu, Button, Dropdown, Space, Typography, Drawer } from 'antd';
import { PhoneOutlined, MenuOutlined, DownOutlined, CloseOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  // Fetch main services with their sub-services
  const { data: mainServices = [] } = useQuery({ 
    queryKey: ['mainServices'], 
    queryFn: async () => (await api.get('/services/main')).data || []
  });

  // Mock data for additional menu items
  const additionalMenuItems = [
    {
      key: 'service-support',
      label: 'Service & Support',
      children: [
        { key: 'customer-care', label: <Link to="/customer-care">Customer Care & Technical Support</Link> },
        { key: 'fleet-management', label: <Link to="/fleet-management">Fleet Management</Link> },
        { key: 'servicing', label: <Link to="/servicing">Servicing</Link> },
        { key: 'warranty', label: <Link to="/warranty">Warranty</Link> },
        { key: 'manuals', label: <Link to="/manuals">Operator Manuals</Link> }
      ]
    },
    {
      key: 'about',
      label: 'About',
      children: [
        { key: 'about-us', label: <Link to="/about">About Us</Link> },
        { key: 'case-studies', label: <Link to="/case-studies">Case Studies</Link> },
        { key: 'news', label: <Link to="/news">HIDRIVE News</Link> },
        { key: 'community', label: <Link to="/community">Community Support</Link> },
        { key: 'careers', label: <Link to="/careers">Careers</Link> },
        { key: 'blog', label: <Link to="/blog">Blog</Link> }
      ]
    },
    {
      key: 'brochures',
      label: <Link to="/brochures">Brochures</Link>
    },
    {
      key: 'contact',
      label: 'Contact',
      children: [
        { key: 'contact-us', label: <Link to="/contact">Contact Us</Link> },
        { key: 'adelaide', label: <Link to="/contact/adelaide">Adelaide</Link> },
        { key: 'brisbane', label: <Link to="/contact/brisbane">Brisbane</Link> },
        { key: 'goulburn', label: <Link to="/contact/goulburn">Goulburn</Link> },
        { key: 'melbourne', label: <Link to="/contact/melbourne">Melbourne</Link> },
        { key: 'perth', label: <Link to="/contact/perth">Perth</Link> },
        { key: 'sydney', label: <Link to="/contact/sydney">Sydney</Link> }
      ]
    }
  ];

  const createServiceMenu = (service) => {
    const subServices = service.subServices || [];
    
    if (subServices.length === 0) {
      return {
        key: service.slug,
        label: <Link to={`/${service.slug}`}>{service.title}</Link>
      };
    }

    return {
      key: service.slug,
      label: (
        <Space>
          {service.title}
          <DownOutlined />
        </Space>
      ),
      children: [
        {
          key: `${service.slug}-overview`,
          label: <Link to={`/${service.slug}`}>Overview</Link>
        },
        ...subServices
          .filter(sub => sub.status === 'active')
          .map(sub => ({
            key: sub.slug,
            label: <Link to={`/${service.slug}/${sub.slug}`}>{sub.title}</Link>
          }))
      ]
    };
  };

  const menuItems = [
    ...mainServices.map(createServiceMenu),
    ...additionalMenuItems
  ];

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AntHeader style={{ 
        background: 'white', 
        padding: '0',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        height: 'auto',
        minHeight: 80
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          height: 80
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1677ff',
              letterSpacing: '1px'
            }}>
              HIDRIVE
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={menuItems}
              style={{ 
                border: 'none', 
                background: 'transparent',
                minWidth: 700,
                fontSize: '15px',
                fontWeight: 500
              }}
              onMouseEnter={(e) => {
                if (e.key && mainServices.some(s => s.slug === e.key)) {
                  setActiveDropdown(e.key);
                }
              }}
              onMouseLeave={() => setActiveDropdown(null)}
            />
            
            {/* Phone Number Button */}
            <Button 
              type="primary" 
              icon={<PhoneOutlined />}
              style={{ 
                borderRadius: '24px',
                height: '44px',
                padding: '0 24px',
                fontWeight: 'bold',
                fontSize: '15px',
                background: '#1677ff',
                border: 'none'
              }}
            >
              1300 368 161
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div style={{ display: 'none' }}>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuOpen(true)}
              style={{ fontSize: '20px', height: '44px', width: '44px' }}
            />
          </div>
        </div>

        {/* Service Dropdown Overlay for Desktop */}
        {activeDropdown && (
          <div 
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'white',
              borderTop: '1px solid #f0f0f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 999
            }}
            onMouseEnter={() => setActiveDropdown(activeDropdown)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div style={{ 
              maxWidth: 1200, 
              margin: '0 auto', 
              padding: '32px 24px',
              display: 'flex',
              gap: '48px'
            }}>
              {mainServices
                .filter(service => service.slug === activeDropdown)
                .map(service => (
                  <div key={service._id} style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold', 
                      marginBottom: '16px',
                      color: '#1677ff'
                    }}>
                      {service.title}
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#666', 
                      marginBottom: '24px',
                      lineHeight: '1.5'
                    }}>
                      {service.shortDescription}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Link 
                        to={`/${service.slug}`}
                        style={{ 
                          color: '#333', 
                          textDecoration: 'none',
                          padding: '8px 0',
                          fontSize: '15px'
                        }}
                      >
                        Overview
                      </Link>
                      {(service.subServices || [])
                        .filter(sub => sub.status === 'active')
                        .map(sub => (
                          <Link 
                            key={sub._id}
                            to={`/${service.slug}/${sub.slug}`}
                            style={{ 
                              color: '#333', 
                              textDecoration: 'none',
                              padding: '8px 0',
                              fontSize: '15px'
                            }}
                          >
                            {sub.title}
                          </Link>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </AntHeader>

      {/* Mobile Menu Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1677ff' }}>HIDRIVE</span>
            <Button 
              type="text" 
              icon={<CloseOutlined />} 
              onClick={handleMobileMenuClose}
              style={{ border: 'none' }}
            />
          </div>
        }
        placement="right"
        onClose={handleMobileMenuClose}
        open={mobileMenuOpen}
        width={320}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ padding: '16px' }}>
          <Menu
            mode="vertical"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{ border: 'none' }}
            onClick={handleMobileMenuClose}
          />
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Button 
              type="primary" 
              icon={<PhoneOutlined />}
              block
              size="large"
              style={{ 
                borderRadius: '24px', 
                height: '48px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              1300 368 161
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
}

