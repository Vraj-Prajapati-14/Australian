import { useState, useEffect } from 'react';
import { Layout, Menu, Button, Dropdown, Space, Typography, Drawer, Image } from 'antd';
import { PhoneOutlined, MenuOutlined, DownOutlined, CloseOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  // Fetch settings data
  const { data: settings = {} } = useQuery({ 
    queryKey: ['settings'], 
    queryFn: async () => {
      const response = await api.get('/settings');
      return response.data || {};
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Extract settings data
  const general = settings.general || {};
  const contact = settings.contact || {};
  const appearance = settings.appearance || {};

  // Fetch main services with their sub-services
  const { data: mainServices = [] } = useQuery({ 
    queryKey: ['mainServices'], 
    queryFn: async () => (await api.get('/services/main')).data || []
  });

  // Create service menu with nested dropdowns
  const createServiceMenu = (service) => {
    const subServices = service.subServices || [];
    
    if (subServices.length === 0) {
      return {
        key: service.slug,
        label: <Link to={`/services/${service.slug}`}>{service.title}</Link>
      };
    }

    return {
      key: service.slug,
      label: service.title,
      children: [
        {
          key: `${service.slug}-overview`,
          label: <Link to={`/services/${service.slug}`}>Overview</Link>
        },
        ...subServices
          .filter(sub => sub.status === 'active')
          .map(sub => ({
            key: sub.slug,
            label: <Link to={`/services/${service.slug}/${sub.slug}`}>{sub.title}</Link>
          }))
      ]
    };
  };

  // Main navigation items - using dynamic data
  const menuItems = [
    {
      key: 'home',
      label: <Link to="/">HOME</Link>
    },
    {
      key: 'about',
      label: <Link to="/about">ABOUT</Link>
    },
    {
      key: 'case-studies',
      label: <Link to="/case-studies">CASE STUDIES</Link>
    },
    {
      key: 'inspiration-gallery',
      label: <Link to="/inspiration-gallery">INSPIRATION GALLERY</Link>
    },
    {
      key: 'services',
      label: (
        <span>
          SERVICES <DownOutlined style={{ fontSize: '12px', marginLeft: '4px' }} />
        </span>
      ),
      children: mainServices.map(createServiceMenu)
    },
    {
      key: 'contact',
      label: <Link to="/contact">CONTACT</Link>
    }
  ];

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Professional navbar styling
  const headerStyle = {
    background: '#ffffff', 
    padding: '0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    height: 'auto',
    minHeight: 70,
    width: '100%',
    borderBottom: '1px solid #e0e0e0'
  };

  const logoStyle = {
    display: 'flex', 
    alignItems: 'center',
    fontSize: '26px',
    fontWeight: 'bold',
    color: '#1677ff',
    letterSpacing: '1px'
  };

  const contactButtonStyle = {
    borderRadius: '6px',
    height: '40px',
    padding: '0 20px',
    fontWeight: '600',
    fontSize: '14px',
    background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
    border: 'none',
    color: '#ffffff',
    boxShadow: '0 2px 8px rgba(22, 119, 255, 0.3)',
    transition: 'all 0.3s ease'
  };

  return (
    <>
      <AntHeader style={headerStyle}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          width: '100%',
          margin: '0 auto',
          padding: '0 24px',
          height: 70
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            {appearance.logo?.url ? (
              <Image
                className="logo-image"
                src={appearance.logo.url}
                alt={appearance.logo.alt || general.siteName || 'Logo'}
                width={120}
                height={35}
                style={{ objectFit: 'contain' }}
                preview={false}
              />
            ) : (
              <div className="logo-container" style={logoStyle}>
                {general.siteName || 'HIDRIVE'}
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="desktop-navigation" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            flex: 1,
            justifyContent: 'center',
            margin: '0 40px'
          }}>
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={menuItems}
              style={{ 
                border: 'none', 
                background: 'transparent',
                fontSize: '14px',
                fontWeight: '600',
                flex: 1,
                justifyContent: 'center',
                display: 'flex',
                color: '#2c2c2c',
                height: 70,
                lineHeight: '70px'
              }}
              onMouseEnter={(e) => {
                if (e.key === 'services') {
                  setActiveDropdown('services');
                }
              }}
              onMouseLeave={() => setActiveDropdown(null)}
            />
          </div>
          
          {/* Contact Button */}
          <div style={{ flexShrink: 0, marginLeft: 'auto' }}>
            <Button 
              type="primary" 
              icon={<PhoneOutlined />}
              style={contactButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(22, 119, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(22, 119, 255, 0.3)';
              }}
            >
              {contact.phone || '1300 368 161'}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="mobile-menu-button" style={{ display: 'none', flexShrink: 0 }}>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuOpen(true)}
              style={{ 
                fontSize: '20px', 
                height: '44px', 
                width: '44px',
                color: '#2c2c2c'
              }}
            />
          </div>
        </div>

        {/* Services Dropdown Overlay for Desktop */}
        {activeDropdown === 'services' && (
          <div 
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#ffffff',
              borderTop: '1px solid #e0e0e0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 999
            }}
            onMouseEnter={() => setActiveDropdown('services')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div style={{ 
              width: '100%', 
              margin: '0 auto', 
              padding: '32px 24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '32px'
            }}>
              {mainServices.map(service => (
                <div key={service._id} style={{ minWidth: 0 }}>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    marginBottom: '12px',
                    color: '#2c2c2c'
                  }}>
                    {service.title}
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#666', 
                    marginBottom: '16px',
                    lineHeight: '1.5'
                  }}>
                    {service.shortDescription}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Link 
                      to={`/services/${service.slug}`}
                      style={{ 
                        color: '#333', 
                        textDecoration: 'none',
                        padding: '6px 0',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'color 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#1677ff'}
                      onMouseLeave={(e) => e.target.style.color = '#333'}
                    >
                      Overview
                    </Link>
                    {(service.subServices || [])
                      .filter(sub => sub.status === 'active')
                      .map(sub => (
                        <Link 
                          key={sub._id}
                          to={`/services/${service.slug}/${sub.slug}`}
                          style={{ 
                            color: '#666', 
                            textDecoration: 'none',
                            padding: '4px 0',
                            fontSize: '14px',
                            transition: 'color 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.color = '#1677ff'}
                          onMouseLeave={(e) => e.target.style.color = '#666'}
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
            {appearance.logo?.url ? (
              <Image
                src={appearance.logo.url}
                alt={appearance.logo.alt || general.siteName || 'Logo'}
                width={100}
                height={30}
                style={{ objectFit: 'contain' }}
                preview={false}
              />
            ) : (
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2c2c2c' }}>
                {general.siteName || 'HIDRIVE'}
              </span>
            )}
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
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ padding: '16px' }}>
          <Menu
            mode="vertical"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{ border: 'none' }}
            onClick={handleMobileMenuClose}
            expandIcon={<DownOutlined />}
          />
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Button 
              type="primary" 
              icon={<PhoneOutlined />}
              block
              size="large"
              style={{ 
                borderRadius: '6px', 
                height: '48px',
                fontSize: '16px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
                border: 'none',
                boxShadow: '0 2px 8px rgba(22, 119, 255, 0.3)'
              }}
            >
              {contact.phone || '1300 368 161'}
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
}

