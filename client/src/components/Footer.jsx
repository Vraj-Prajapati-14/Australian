import { Row, Col, Typography, Space, Divider, Button, Image } from 'antd';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined,
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
  TwitterOutlined,
  StarOutlined,
  SafetyCertificateOutlined,
  EnvironmentOutlined as EnvIcon
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function Footer() {
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
  const social = settings.social || {};
  const business = settings.business || {};
  const appearance = settings.appearance || {};

  const serviceLinks = [
    { name: 'Ute', path: '/ute' },
    { name: 'Trailer', path: '/trailer' },
    { name: 'Truck', path: '/truck' },
    { name: 'Accessories', path: '/accessories' },
    { name: 'Build Your Mobile Workspace', path: '/build' },
    { name: 'Inspiration Gallery', path: '/inspiration' }
  ];

  const discoverLinks = [
    { name: 'About', path: '/about' },
    { name: 'Brochures', path: '/brochures' },
    { name: 'Case Studies', path: '/case-studies' },
    { name: 'Fleet', path: '/fleet' },
    { name: 'Service', path: '/service' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const supportLinks = [
    { name: 'Customer Care & Technical Support', path: '/support' },
    { name: 'Fleet Management', path: '/fleet-management' },
    { name: 'Servicing', path: '/servicing' },
    { name: 'Serial Numbers', path: '/serial-numbers' },
    { name: 'National Support Network', path: '/support-network' },
    { name: 'Warranty', path: '/warranty' },
    { name: 'Operator Manuals', path: '/manuals' }
  ];

  const locations = contact?.locations || [
    { city: 'Sydney', address: 'Sydney Installation Centre' },
    { city: 'Melbourne', address: 'Melbourne Installation Centre' },
    { city: 'Brisbane', address: 'Brisbane Installation Centre' },
    { city: 'Adelaide', address: 'Adelaide Installation Centre' },
    { city: 'Perth', address: 'Perth Installation Centre' },
    { city: 'Goulburn', address: 'Goulburn Manufacturing Centre' }
  ];

  // Dynamic styling based on settings
  const footerStyle = {
    background: appearance.backgroundColor || 'linear-gradient(135deg, #0b1a27 0%, #0e2436 50%, #163a57 100%)',
    color: 'white',
    position: 'relative',
    overflow: 'hidden'
  };

  const primaryColor = appearance.primaryColor || '#1677ff';
  const textColor = appearance.textColor || '#cde3f9';

  return (
    <footer style={footerStyle}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.5
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Main Footer Content */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px 40px' }}>
          <Row gutter={[48, 48]}>
            {/* Company Info */}
            <Col xs={24} md={8}>
              <div style={{ marginBottom: 32 }}>
                {appearance.logo?.url ? (
                  <Image
                    src={appearance.logo.url}
                    alt={appearance.logo.alt || general.siteName || 'Logo'}
                    width={150}
                    height={50}
                    style={{ objectFit: 'contain', marginBottom: 16 }}
                    preview={false}
                  />
                ) : (
                  <Title level={3} style={{ color: primaryColor, marginBottom: 16, fontSize: '2rem' }}>
                    {general.siteName || 'HIDRIVE'}
                  </Title>
                )}
                <Paragraph style={{ color: textColor, fontSize: '16px', lineHeight: 1.6, marginBottom: 24 }}>
                  {general.siteDescription || 'Service bodies & canopies for utes, trailers & trucks. Fit-for-purpose. On time. Nationally.'}
                </Paragraph>
                
                {/* Contact Info */}
                <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: 24 }}>
                  {contact.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <PhoneOutlined style={{ color: primaryColor, fontSize: '18px' }} />
                      <Text style={{ color: textColor, fontSize: '16px', fontWeight: 600 }}>
                        {contact.phone}
                      </Text>
                    </div>
                  )}
                  {contact.mobile && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <PhoneOutlined style={{ color: primaryColor, fontSize: '18px' }} />
                      <Text style={{ color: textColor, fontSize: '16px' }}>
                        {contact.mobile}
                      </Text>
                    </div>
                  )}
                  {contact.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <MailOutlined style={{ color: primaryColor, fontSize: '18px' }} />
                      <Text style={{ color: textColor, fontSize: '16px' }}>
                        {contact.email}
                      </Text>
                    </div>
                  )}
                  {contact.address && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <EnvironmentOutlined style={{ color: primaryColor, fontSize: '18px' }} />
                      <Text style={{ color: textColor, fontSize: '16px' }}>
                        {contact.address}
                      </Text>
                    </div>
                  )}
                  {contact.businessHours && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <StarOutlined style={{ color: primaryColor, fontSize: '18px' }} />
                      <Text style={{ color: textColor, fontSize: '16px' }}>
                        {contact.businessHours}
                      </Text>
                    </div>
                  )}
                </Space>

                {/* Social Links */}
                <Space size="large">
                  {social.facebook && (
                    <a href={social.facebook} target="_blank" rel="noopener noreferrer" style={{ color: textColor }}>
                      <FacebookOutlined style={{ fontSize: '24px' }} />
                    </a>
                  )}
                  {social.twitter && (
                    <a href={social.twitter} target="_blank" rel="noopener noreferrer" style={{ color: textColor }}>
                      <TwitterOutlined style={{ fontSize: '24px' }} />
                    </a>
                  )}
                  {social.instagram && (
                    <a href={social.instagram} target="_blank" rel="noopener noreferrer" style={{ color: textColor }}>
                      <InstagramOutlined style={{ fontSize: '24px' }} />
                    </a>
                  )}
                  {social.linkedin && (
                    <a href={social.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: textColor }}>
                      <LinkedinOutlined style={{ fontSize: '24px' }} />
                    </a>
                  )}
                  {social.youtube && (
                    <a href={social.youtube} target="_blank" rel="noopener noreferrer" style={{ color: textColor }}>
                      <YoutubeOutlined style={{ fontSize: '24px' }} />
                    </a>
                  )}
                  {social.tiktok && (
                    <a href={social.tiktok} target="_blank" rel="noopener noreferrer" style={{ color: textColor }}>
                      {/* <TiktokOutlined style={{ fontSize: '24px' }} /> */}
                    </a>
                  )}
                  {social.pinterest && (
                    <a href={social.pinterest} target="_blank" rel="noopener noreferrer" style={{ color: textColor }}>
                      <PinterestOutlined style={{ fontSize: '24px' }} />
                    </a>
                  )}
                  {social.snapchat && (
                    <a href={social.snapchat} target="_blank" rel="noopener noreferrer" style={{ color: textColor }}>
                      {/* <SnapchatOutlined style={{ fontSize: '24px' }} /> */}
                    </a>
                  )}
                </Space>
              </div>

              {/* Certifications */}
              {business.certifications && business.certifications.length > 0 && (
                <div style={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  padding: '20px', 
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <Title level={5} style={{ color: primaryColor, marginBottom: 16 }}>
                    Certifications
                  </Title>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    {business.certifications.map((cert, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <SafetyCertificateOutlined style={{ color: '#52c41a' }} />
                        <Text style={{ color: textColor, fontSize: '14px' }}>{cert}</Text>
                      </div>
                    ))}
                  </Space>
                </div>
              )}
            </Col>

            {/* Service Bodies */}
            <Col xs={24} md={4}>
              <Title level={4} style={{ color: primaryColor, marginBottom: 24 }}>
                Service Bodies
              </Title>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {serviceLinks.map((link, index) => (
                  <Link 
                    key={index}
                    to={link.path}
                    style={{ 
                      color: textColor, 
                      textDecoration: 'none',
                      fontSize: '14px',
                      display: 'block',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = primaryColor}
                    onMouseLeave={(e) => e.target.style.color = textColor}
                  >
                    {link.name}
                  </Link>
                ))}
              </Space>
            </Col>

            {/* Discover */}
            <Col xs={24} md={4}>
              <Title level={4} style={{ color: primaryColor, marginBottom: 24 }}>
                Discover
              </Title>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {discoverLinks.map((link, index) => (
                  <Link 
                    key={index}
                    to={link.path}
                    style={{ 
                      color: textColor, 
                      textDecoration: 'none',
                      fontSize: '14px',
                      display: 'block',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = primaryColor}
                    onMouseLeave={(e) => e.target.style.color = textColor}
                  >
                    {link.name}
                  </Link>
                ))}
              </Space>
            </Col>

            {/* Service & Support */}
            <Col xs={24} md={4}>
              <Title level={4} style={{ color: primaryColor, marginBottom: 24 }}>
                Service & Support
              </Title>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {supportLinks.map((link, index) => (
                  <Link 
                    key={index}
                    to={link.path}
                    style={{ 
                      color: textColor, 
                      textDecoration: 'none',
                      fontSize: '14px',
                      display: 'block',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = primaryColor}
                    onMouseLeave={(e) => e.target.style.color = textColor}
                  >
                    {link.name}
                  </Link>
                ))}
              </Space>
            </Col>

            {/* Locations */}
            <Col xs={24} md={4}>
              <Title level={4} style={{ color: primaryColor, marginBottom: 24 }}>
                Locations
              </Title>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {locations.map((location, index) => (
                  <div key={index}>
                    <Text style={{ 
                      color: primaryColor, 
                      fontSize: '14px',
                      fontWeight: 600,
                      display: 'block'
                    }}>
                      {location.city}
                    </Text>
                    <Text style={{ 
                      color: textColor, 
                      fontSize: '12px',
                      display: 'block'
                    }}>
                      {location.address}
                    </Text>
                  </div>
                ))}
              </Space>
            </Col>
          </Row>
        </div>

        {/* Newsletter Section */}
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderTop: '1px solid rgba(255,255,255,0.1)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
            <Row gutter={[48, 24]} align="middle">
              <Col xs={24} md={12}>
                <Title level={4} style={{ color: primaryColor, marginBottom: 8 }}>
                  Keep up to date!
                </Title>
                <Paragraph style={{ color: textColor, margin: 0 }}>
                  Join our mailing list for helpful industry insights, product updates, and news from {general.siteName || 'HIDRIVE'} — no spam, just useful info.
                </Paragraph>
              </Col>
              <Col xs={24} md={12}>
                <Space.Compact style={{ width: '100%' }}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '8px 0 0 8px',
                      background: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                  <Button 
                    type="primary"
                    style={{
                      borderRadius: '0 8px 8px 0',
                      background: primaryColor,
                      border: 'none',
                      height: 'auto',
                      padding: '12px 24px'
                    }}
                  >
                    Subscribe
                  </Button>
                </Space.Compact>
              </Col>
            </Row>
          </div>
        </div>

        {/* Bottom Footer */}
        <div style={{ padding: '24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} md={12}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <Text style={{ color: textColor, fontSize: '14px' }}>
                    © {new Date().getFullYear()} {general.companyName || general.siteName || 'HIDRIVE'}. All Rights Reserved
                  </Text>
                  <Divider type="vertical" style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
                  <Link to="/safety-policy" style={{ color: textColor, fontSize: '14px', textDecoration: 'none' }}>
                    Safety Policy
                  </Link>
                  <Link to="/environmental-policy" style={{ color: textColor, fontSize: '14px', textDecoration: 'none' }}>
                    Environmental Policy
                  </Link>
                  <Link to="/quality-policy" style={{ color: textColor, fontSize: '14px', textDecoration: 'none' }}>
                    Quality Policy
                  </Link>
                  <Link to="/terms-of-trade" style={{ color: textColor, fontSize: '14px', textDecoration: 'none' }}>
                    Terms of Trade
                  </Link>
                  <Link to="/privacy-policy" style={{ color: textColor, fontSize: '14px', textDecoration: 'none' }}>
                    Privacy Policy
                  </Link>
                </div>
              </Col>
              
              <Col xs={24} md={12}>
                <div style={{ textAlign: 'right' }}>
                  <Space>
                    <Text style={{ color: textColor, fontSize: '14px' }}>
                      Your feedback matters!
                    </Text>
                    <Button 
                      type="primary"
                      size="small"
                      style={{
                        background: primaryColor,
                        border: 'none',
                        borderRadius: '6px'
                      }}
                    >
                      Please leave us a google review
                    </Button>
                  </Space>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </footer>
  );
}

