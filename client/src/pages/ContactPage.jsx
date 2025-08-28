import { useState } from 'react';
import { 
  Typography, 
  Form, 
  Input, 
  Button, 
  Select, 
  Row, 
  Col, 
  Card, 
  Space, 
  Divider,
  message,
  Spin,
  Alert
} from 'antd';
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MessageOutlined,
  CarOutlined,
  ToolOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import './ContactPage.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function ContactPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Fetch dynamic data from backend
  const { data: mainServices = [], isLoading: servicesLoading } = useQuery({ 
    queryKey: ['mainServices'], 
    queryFn: async () => (await api.get('/services/main')).data || []
  });

  const { data: departments = [], isLoading: departmentsLoading } = useQuery({ 
    queryKey: ['departments'], 
    queryFn: async () => (await api.get('/departments/active')).data || []
  });

  const { data: allServices = [], isLoading: allServicesLoading } = useQuery({ 
    queryKey: ['allServices'], 
    queryFn: async () => (await api.get('/services')).data || []
  });

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Submit to actual contact API
      const response = await api.post('/contacts/submit', values);
      
      if (response.data.success) {
        message.success(response.data.message || 'Thank you for your enquiry! We will get back to you within 24 hours.');
        form.resetFields();
      } else {
        message.error('There was an error submitting your enquiry. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      const errorMessage = error.response?.data?.message || 'There was an error submitting your enquiry. Please try again.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const enquiryTypes = [
    { value: 'general', label: 'General/Sales Enquiry' },
    { value: 'service', label: 'Service/After Sales Enquiry' },
    { value: 'quote', label: 'Quote Request' },
    { value: 'support', label: 'Technical Support' },
    { value: 'warranty', label: 'Warranty Claim' },
    { value: 'installation', label: 'Installation Enquiry' },
    { value: 'parts', label: 'Parts & Accessories' },
    { value: 'fleet', label: 'Fleet Management' }
  ];

  const vehicleTypes = [
    { value: 'ute', label: 'Ute' },
    { value: 'trailer', label: 'Trailer' },
    { value: 'truck', label: 'Truck' },
    { value: 'van', label: 'Van' },
    { value: 'other', label: 'Other' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low - Planning Stage' },
    { value: 'medium', label: 'Medium - Within 1-2 months' },
    { value: 'high', label: 'High - Urgent requirement' },
    { value: 'emergency', label: 'Emergency - Immediate need' }
  ];

  if (servicesLoading || departmentsLoading || allServicesLoading) {
    return (
      <div className="contact-page">
        <div className="contact-loading">
          <Spin size="large" />
          <div style={{ marginTop: 20 }}>Loading contact form...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      {/* Header Section */}
      <div className="contact-header">
        <Title level={1}>Contact Us</Title>
        <Paragraph>
          Get in touch with our team of mobile workspace specialists
        </Paragraph>
      </div>

      {/* Contact Info Cards */}
      <div className="contact-info-cards">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={8}>
            <div className="contact-info-card">
              <PhoneOutlined />
              <Title level={4}>1300 368 161</Title>
              <Text type="secondary">Customer Care Team: 8AM-6.30PM AEST</Text>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className="contact-info-card">
              <ClockCircleOutlined />
              <Title level={4}>Showroom Visits</Title>
              <Text type="secondary">By appointment only</Text>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className="contact-info-card">
              <EnvironmentOutlined />
              <Title level={4}>Nationwide Service</Title>
              <Text type="secondary">Multiple locations across Australia</Text>
            </div>
          </Col>
        </Row>
      </div>

      <Row gutter={[40, 40]}>
        {/* Contact Form */}
        <Col xs={24} lg={16}>
          <div className="contact-form-container">
            <div className="contact-form-card">
              <Card title="Get In Touch" style={{ border: 'none', background: 'transparent' }}>
                <Alert
                  message="Please choose your enquiry type"
                  description="This helps us route your enquiry to the right specialist"
                  type="info"
                  showIcon
                  style={{ marginBottom: 24 }}
                />
                
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  size="large"
                  className="contact-form"
                >
                  {/* Enquiry Type */}
                  <Form.Item
                    label="Enquiry Type"
                    name="enquiryType"
                    rules={[{ required: true, message: 'Please select an enquiry type' }]}
                  >
                    <Select placeholder="— Select enquiry type —">
                      {enquiryTypes.map(type => (
                        <Option key={type.value} value={type.value}>
                          {type.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* Service Category */}
                  <Form.Item
                    label="Service Category"
                    name="serviceCategory"
                    rules={[{ required: true, message: 'Please select a service category' }]}
                  >
                    <Select placeholder="— Select service category —">
                      {mainServices.map(service => (
                        <Option key={service._id} value={service._id}>
                          {service.title}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* Specific Service */}
                  <Form.Item
                    label="Specific Service"
                    name="specificService"
                  >
                    <Select 
                      placeholder="— Select specific service (optional) —"
                      allowClear
                      showSearch
                      optionFilterProp="children"
                    >
                      {allServices
                        .filter(service => !service.isMainService)
                        .map(service => (
                          <Option key={service._id} value={service._id}>
                            {service.title}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>

                  {/* Department */}
                  <Form.Item
                    label="Department"
                    name="department"
                  >
                    <Select placeholder="— Select department (optional) —" allowClear>
                      {departments.map(dept => (
                        <Option key={dept._id} value={dept._id}>
                          {dept.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[{ required: true, message: 'Please enter your first name' }]}
                      >
                        <Input prefix={<UserOutlined />} placeholder="Your first name" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[{ required: true, message: 'Please enter your last name' }]}
                      >
                        <Input prefix={<UserOutlined />} placeholder="Your last name" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          { required: true, message: 'Please enter your email' },
                          { type: 'email', message: 'Please enter a valid email' }
                        ]}
                      >
                        <Input prefix={<MailOutlined />} placeholder="your.email@example.com" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Please enter your phone number' }]}
                      >
                        <Input prefix={<PhoneOutlined />} placeholder="Your phone number" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Company"
                        name="company"
                      >
                        <Input placeholder="Your company name (optional)" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Job Title"
                        name="jobTitle"
                      >
                        <Input placeholder="Your job title (optional)" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Vehicle Type"
                        name="vehicleType"
                      >
                        <Select placeholder="— Select vehicle type —" allowClear>
                          {vehicleTypes.map(type => (
                            <Option key={type.value} value={type.value}>
                              {type.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Urgency Level"
                        name="urgency"
                      >
                        <Select placeholder="— Select urgency —" allowClear>
                          {urgencyLevels.map(level => (
                            <Option key={level.value} value={level.value}>
                              {level.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label="Vehicle Details"
                    name="vehicleDetails"
                  >
                    <Input.TextArea 
                      rows={3} 
                      placeholder="Make, model, year, and any specific requirements..."
                    />
                  </Form.Item>

                  <Form.Item
                    label="Message"
                    name="message"
                    rules={[{ required: true, message: 'Please enter your message' }]}
                  >
                    <Input.TextArea 
                      rows={6} 
                      placeholder="Please provide details about your enquiry, requirements, or any specific questions you have..."
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      size="large"
                      loading={loading}
                      icon={<MessageOutlined />}
                      style={{ width: '100%' }}
                    >
                      Send Enquiry
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </div>
          </div>
        </Col>

        {/* Contact Information */}
        <Col xs={24} lg={8}>
          <div className="contact-sidebar">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Quick Contact */}
              <Card title="Quick Contact" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Phone:</Text>
                    <br />
                    <Text>1300 368 161</Text>
                  </div>
                  <div>
                    <Text strong>Email:</Text>
                    <br />
                    <Text>info@hidrive.com.au</Text>
                  </div>
                  <div>
                    <Text strong>Hours:</Text>
                    <br />
                    <Text>Mon-Fri: 8AM-6.30PM AEST</Text>
                  </div>
                </Space>
              </Card>

              {/* Service Areas */}
              <Card title="Service Areas" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {mainServices.map(service => (
                    <div key={service._id}>
                      <Text strong>{service.title}</Text>
                      {service.subServices && service.subServices.length > 0 && (
                        <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                          {service.subServices.slice(0, 3).map(sub => (
                            <li key={sub._id}>
                              <Text type="secondary">{sub.title}</Text>
                            </li>
                          ))}
                          {service.subServices.length > 3 && (
                            <li>
                              <Text type="secondary">+{service.subServices.length - 3} more</Text>
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  ))}
                </Space>
              </Card>

              {/* Departments */}
              <Card title="Departments" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {departments.map(dept => (
                    <div key={dept._id}>
                      <Text strong>{dept.name}</Text>
                      {dept.description && (
                        <div>
                          <Text type="secondary">{dept.description}</Text>
                        </div>
                      )}
                    </div>
                  ))}
                </Space>
              </Card>
            </Space>
          </div>
        </Col>
      </Row>
    </div>
  );
}

