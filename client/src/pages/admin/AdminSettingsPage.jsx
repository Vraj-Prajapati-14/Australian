import { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Switch, 
  Space, 
  Typography, 
  Row, 
  Col, 
  Divider,
  Upload,
  Image,
  message,
  Tabs,
  Select,
  InputNumber,
  ColorPicker
} from 'antd';
import { 
  SaveOutlined, 
  UploadOutlined,
  PictureOutlined,
  SettingOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [generalForm] = Form.useForm();
  const [contactForm] = Form.useForm();
  const [socialForm] = Form.useForm();
  const [seoForm] = Form.useForm();
  const [appearanceForm] = Form.useForm();

  // Fetch settings data
  const { data: settings = {} } = useQuery({ 
    queryKey: ['settings'], 
    queryFn: async () => (await api.get('/settings')).data || {}
  });

  // Mock data for now - replace with actual API calls
  const mockSettings = {
    general: {
      siteName: 'HIDRIVE',
      siteTagline: 'Professional Vehicle Solutions',
      siteDescription: 'Leading provider of ute canopies, trailer service bodies, and truck solutions across Australia.',
      companyName: 'HIDRIVE Australia',
      founded: '2010',
      industry: 'Automotive & Manufacturing',
      employees: '50+',
      website: 'https://hidrive.com.au',
      timezone: 'Australia/Sydney',
      currency: 'AUD',
      language: 'en'
    },
    contact: {
      address: '123 Industrial Drive, Sydney NSW 2000, Australia',
      phone: '+61 2 1234 5678',
      mobile: '+61 400 123 456',
      email: 'info@hidrive.com.au',
      supportEmail: 'support@hidrive.com.au',
      salesEmail: 'sales@hidrive.com.au',
      businessHours: 'Monday - Friday: 8:00 AM - 6:00 PM',
      emergencyContact: '+61 400 999 888'
    },
    social: {
      facebook: 'https://facebook.com/hidrive',
      twitter: 'https://twitter.com/hidrive',
      linkedin: 'https://linkedin.com/company/hidrive',
      instagram: 'https://instagram.com/hidrive',
      youtube: 'https://youtube.com/hidrive',
      tiktok: ''
    },
    seo: {
      metaTitle: 'HIDRIVE - Professional Vehicle Solutions | Ute Canopies & Service Bodies',
      metaDescription: 'Australia\'s leading provider of ute canopies, trailer service bodies, and truck solutions. Professional, durable, and custom-fit vehicle modifications.',
      metaKeywords: 'ute canopies, trailer service bodies, truck modifications, vehicle solutions, Australia',
      googleAnalytics: 'GA-123456789',
      googleTagManager: 'GTM-ABCDEF',
      facebookPixel: '123456789',
      structuredData: true,
      sitemapEnabled: true,
      robotsTxt: 'User-agent: *\nAllow: /'
    },
    appearance: {
      primaryColor: '#1677ff',
      secondaryColor: '#52c41a',
      accentColor: '#fa8c16',
      textColor: '#262626',
      backgroundColor: '#ffffff',
      headerStyle: 'modern',
      footerStyle: 'comprehensive',
      logo: 'https://via.placeholder.com/200x80',
      favicon: 'https://via.placeholder.com/32x32',
      heroImage: 'https://via.placeholder.com/1200x600'
    }
  };

  useEffect(() => {
    // Set form values with mock data
    generalForm.setFieldsValue(mockSettings.general);
    contactForm.setFieldsValue(mockSettings.contact);
    socialForm.setFieldsValue(mockSettings.social);
    seoForm.setFieldsValue(mockSettings.seo);
    appearanceForm.setFieldsValue(mockSettings.appearance);
  }, []);

  const handleGeneralSave = async (values) => {
    try {
      setLoading(true);
      // Save general settings
      console.log('Saving general settings:', values);
      message.success('General settings saved successfully');
    } catch (error) {
      message.error('Error saving general settings');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSave = async (values) => {
    try {
      setLoading(true);
      // Save contact settings
      console.log('Saving contact settings:', values);
      message.success('Contact settings saved successfully');
    } catch (error) {
      message.error('Error saving contact settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSave = async (values) => {
    try {
      setLoading(true);
      // Save social media settings
      console.log('Saving social settings:', values);
      message.success('Social media settings saved successfully');
    } catch (error) {
      message.error('Error saving social settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSeoSave = async (values) => {
    try {
      setLoading(true);
      // Save SEO settings
      console.log('Saving SEO settings:', values);
      message.success('SEO settings saved successfully');
    } catch (error) {
      message.error('Error saving SEO settings');
    } finally {
      setLoading(false);
    }
  };

  const handleAppearanceSave = async (values) => {
    try {
      setLoading(true);
      // Save appearance settings
      console.log('Saving appearance settings:', values);
      message.success('Appearance settings saved successfully');
    } catch (error) {
      message.error('Error saving appearance settings');
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: 'general',
      label: (
        <span>
          <SettingOutlined />
          General
        </span>
      ),
      children: (
        <Card title="General Site Settings">
          <Form
            form={generalForm}
            layout="vertical"
            onFinish={handleGeneralSave}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="siteName"
                  label="Site Name"
                  rules={[{ required: true, message: 'Please enter site name' }]}
                >
                  <Input placeholder="HIDRIVE" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="siteTagline"
                  label="Site Tagline"
                >
                  <Input placeholder="Professional Vehicle Solutions" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="siteDescription"
              label="Site Description"
              rules={[{ required: true, message: 'Please enter site description' }]}
            >
              <TextArea rows={3} placeholder="Brief description of your business..." />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="companyName"
                  label="Company Name"
                  rules={[{ required: true, message: 'Please enter company name' }]}
                >
                  <Input placeholder="HIDRIVE Australia" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="founded"
                  label="Founded Year"
                >
                  <Input placeholder="2010" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="industry"
                  label="Industry"
                >
                  <Input placeholder="Automotive & Manufacturing" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="employees"
                  label="Number of Employees"
                >
                  <Input placeholder="50+" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="website"
                  label="Website URL"
                  rules={[{ required: true, message: 'Please enter website URL' }]}
                >
                  <Input placeholder="https://hidrive.com.au" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="timezone"
                  label="Timezone"
                >
                  <Select placeholder="Select timezone">
                    <Option value="Australia/Sydney">Australia/Sydney</Option>
                    <Option value="Australia/Melbourne">Australia/Melbourne</Option>
                    <Option value="Australia/Brisbane">Australia/Brisbane</Option>
                    <Option value="Australia/Perth">Australia/Perth</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="currency"
                  label="Currency"
                >
                  <Select placeholder="Select currency">
                    <Option value="AUD">AUD - Australian Dollar</Option>
                    <Option value="USD">USD - US Dollar</Option>
                    <Option value="EUR">EUR - Euro</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <div style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                Save General Settings
              </Button>
            </div>
          </Form>
        </Card>
      )
    },
    {
      key: 'contact',
      label: (
        <span>
          <PhoneOutlined />
          Contact
        </span>
      ),
      children: (
        <Card title="Contact Information">
          <Form
            form={contactForm}
            layout="vertical"
            onFinish={handleContactSave}
          >
            <Form.Item
              name="address"
              label="Business Address"
              rules={[{ required: true, message: 'Please enter business address' }]}
            >
              <TextArea rows={3} placeholder="Full business address..." />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="phone"
                  label="Main Phone"
                  rules={[{ required: true, message: 'Please enter main phone' }]}
                >
                  <Input placeholder="+61 2 1234 5678" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="mobile"
                  label="Mobile Phone"
                >
                  <Input placeholder="+61 400 123 456" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="email"
                  label="General Email"
                  rules={[
                    { required: true, message: 'Please enter general email' },
                    { type: 'email', message: 'Please enter valid email' }
                  ]}
                >
                  <Input placeholder="info@hidrive.com.au" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="supportEmail"
                  label="Support Email"
                  rules={[{ type: 'email', message: 'Please enter valid email' }]}
                >
                  <Input placeholder="support@hidrive.com.au" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="salesEmail"
                  label="Sales Email"
                  rules={[{ type: 'email', message: 'Please enter valid email' }]}
                >
                  <Input placeholder="sales@hidrive.com.au" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="businessHours"
                  label="Business Hours"
                >
                  <Input placeholder="Monday - Friday: 8:00 AM - 6:00 PM" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="emergencyContact"
                  label="Emergency Contact"
                >
                  <Input placeholder="+61 400 999 888" />
                </Form.Item>
              </Col>
            </Row>

            <div style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                Save Contact Settings
              </Button>
            </div>
          </Form>
        </Card>
      )
    },
    {
      key: 'social',
      label: (
        <span>
          <GlobalOutlined />
          Social Media
        </span>
      ),
      children: (
        <Card title="Social Media Links">
          <Form
            form={socialForm}
            layout="vertical"
            onFinish={handleSocialSave}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="facebook"
                  label="Facebook"
                >
                  <Input placeholder="https://facebook.com/hidrive" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="twitter"
                  label="Twitter"
                >
                  <Input placeholder="https://twitter.com/hidrive" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="linkedin"
                  label="LinkedIn"
                >
                  <Input placeholder="https://linkedin.com/company/hidrive" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="instagram"
                  label="Instagram"
                >
                  <Input placeholder="https://instagram.com/hidrive" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="youtube"
                  label="YouTube"
                >
                  <Input placeholder="https://youtube.com/hidrive" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="tiktok"
                  label="TikTok"
                >
                  <Input placeholder="https://tiktok.com/@hidrive" />
                </Form.Item>
              </Col>
            </Row>

            <div style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                Save Social Settings
              </Button>
            </div>
          </Form>
        </Card>
      )
    },
    {
      key: 'seo',
      label: (
        <span>
          <GlobalOutlined />
          SEO & Analytics
        </span>
      ),
      children: (
        <Card title="SEO & Analytics Settings">
          <Form
            form={seoForm}
            layout="vertical"
            onFinish={handleSeoSave}
          >
            <Form.Item
              name="metaTitle"
              label="Default Meta Title"
              rules={[{ required: true, message: 'Please enter meta title' }]}
            >
              <Input placeholder="HIDRIVE - Professional Vehicle Solutions" />
            </Form.Item>

            <Form.Item
              name="metaDescription"
              label="Default Meta Description"
              rules={[{ required: true, message: 'Please enter meta description' }]}
            >
              <TextArea rows={3} placeholder="Brief description for search engines..." />
            </Form.Item>

            <Form.Item
              name="metaKeywords"
              label="Meta Keywords"
            >
              <Input placeholder="ute canopies, trailer service bodies, truck modifications" />
            </Form.Item>

            <Divider>Analytics</Divider>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="googleAnalytics"
                  label="Google Analytics ID"
                >
                  <Input placeholder="GA-123456789" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="googleTagManager"
                  label="Google Tag Manager ID"
                >
                  <Input placeholder="GTM-ABCDEF" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="facebookPixel"
                  label="Facebook Pixel ID"
                >
                  <Input placeholder="123456789" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="structuredData"
                  label="Enable Structured Data"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="sitemapEnabled"
                  label="Enable Sitemap"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="robotsTxt"
              label="Robots.txt Content"
            >
              <TextArea rows={4} placeholder="User-agent: *\nAllow: /" />
            </Form.Item>

            <div style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                Save SEO Settings
              </Button>
            </div>
          </Form>
        </Card>
      )
    },
    {
      key: 'appearance',
      label: (
        <span>
          <PictureOutlined />
          Appearance
        </span>
      ),
      children: (
        <Card title="Appearance & Branding">
          <Form
            form={appearanceForm}
            layout="vertical"
            onFinish={handleAppearanceSave}
          >
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="primaryColor"
                  label="Primary Color"
                >
                  <ColorPicker />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="secondaryColor"
                  label="Secondary Color"
                >
                  <ColorPicker />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="accentColor"
                  label="Accent Color"
                >
                  <ColorPicker />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="textColor"
                  label="Text Color"
                >
                  <ColorPicker />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="backgroundColor"
                  label="Background Color"
                >
                  <ColorPicker />
                </Form.Item>
              </Col>
            </Row>

            <Divider>Branding</Divider>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="logo"
                  label="Logo URL"
                >
                  <Input placeholder="https://example.com/logo.png" />
                </Form.Item>
                {appearanceForm.getFieldValue('logo') && (
                  <Image
                    width={200}
                    src={appearanceForm.getFieldValue('logo')}
                    alt="Logo preview"
                    style={{ marginTop: 8 }}
                  />
                )}
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="favicon"
                  label="Favicon URL"
                >
                  <Input placeholder="https://example.com/favicon.ico" />
                </Form.Item>
                {appearanceForm.getFieldValue('favicon') && (
                  <Image
                    width={32}
                    src={appearanceForm.getFieldValue('favicon')}
                    alt="Favicon preview"
                    style={{ marginTop: 8 }}
                  />
                )}
              </Col>
            </Row>

            <Form.Item
              name="heroImage"
              label="Default Hero Image URL"
            >
              <Input placeholder="https://example.com/hero.jpg" />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="headerStyle"
                  label="Header Style"
                >
                  <Select placeholder="Select header style">
                    <Option value="modern">Modern</Option>
                    <Option value="classic">Classic</Option>
                    <Option value="minimal">Minimal</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="footerStyle"
                  label="Footer Style"
                >
                  <Select placeholder="Select footer style">
                    <Option value="comprehensive">Comprehensive</Option>
                    <Option value="simple">Simple</Option>
                    <Option value="minimal">Minimal</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <div style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                Save Appearance Settings
              </Button>
            </div>
          </Form>
        </Card>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Site Settings</Title>
      <Paragraph style={{ marginBottom: 32 }}>
        Manage your website settings, contact information, social media links, SEO settings, and appearance customization.
      </Paragraph>

      <Tabs
        defaultActiveKey="general"
        items={tabItems}
        style={{ background: 'white', padding: '24px', borderRadius: '8px' }}
      />
    </div>
  );
}

