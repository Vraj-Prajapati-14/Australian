import React, { useState } from 'react';
import {
  Typography,
  Card,
  Form,
  Input,
  Rate,
  Upload,
  Button,
  message,
  Row,
  Col,
  Alert,
  Spin
} from 'antd';
import {
  UserOutlined,
  UploadOutlined,
  StarOutlined,
  SendOutlined
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Helmet } from 'react-helmet-async';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function TestimonialSubmitPage() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const submitMutation = useMutation({
    mutationFn: async (values) => {
      const formData = new FormData();
      
      // Add form fields
      Object.keys(values).forEach(key => {
        if (values[key] !== undefined && values[key] !== null) {
          if (key === 'avatar' && values[key]?.fileList?.[0]) {
            formData.append('avatar', values[key].fileList[0].originFileObj);
          } else if (key !== 'avatar') {
            formData.append(key, values[key]);
          }
        }
      });

      const response = await api.post('/testimonials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    },
    onSuccess: () => {
      message.success('Thank you! Your testimonial has been submitted successfully. It will be reviewed before being published.');
      form.resetFields();
      setFileList([]);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to submit testimonial. Please try again.');
    }
  });

  const handleSubmit = async (values) => {
    try {
      await submitMutation.mutateAsync(values);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const uploadProps = {
    name: 'avatar',
    fileList,
    beforeUpload: () => false,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    accept: 'image/*',
    maxCount: 1
  };

  return (
    <>
      <Helmet>
        <title>Submit Your Testimonial - HIDRIVE</title>
        <meta name="description" content="Share your experience with HIDRIVE. Submit your testimonial and help others discover our quality mobile workspace solutions." />
      </Helmet>

      <div className="testimonial-submit-page">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Title level={1}>Share Your Experience</Title>
            <Paragraph style={{ fontSize: '18px', color: '#666' }}>
              We'd love to hear about your experience with HIDRIVE. Your feedback helps us improve and helps others discover our services.
            </Paragraph>
          </div>

          <Row justify="center">
            <Col xs={24} md={16} lg={12}>
              <Card className="testimonial-form-card">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  initialValues={{
                    rating: 5
                  }}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please enter your full name' }]}
                      >
                        <Input 
                          placeholder="Your full name" 
                          prefix={<UserOutlined />}
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="position"
                        label="Job Position"
                        rules={[{ required: true, message: 'Please enter your job position' }]}
                      >
                        <Input 
                          placeholder="e.g., Fleet Manager, CEO" 
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="company"
                        label="Company"
                        rules={[{ required: true, message: 'Please enter your company name' }]}
                      >
                        <Input 
                          placeholder="Your company name" 
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[
                          { required: true, message: 'Please enter your email address' },
                          { type: 'email', message: 'Please enter a valid email address' }
                        ]}
                      >
                        <Input 
                          placeholder="your.email@company.com" 
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="phone"
                    label="Phone Number (Optional)"
                  >
                    <Input 
                      placeholder="Your phone number" 
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="rating"
                    label="Overall Rating"
                    rules={[{ required: true, message: 'Please provide a rating' }]}
                  >
                    <Rate 
                      style={{ fontSize: '24px' }}
                      tooltips={['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']}
                    />
                  </Form.Item>

                  <Form.Item
                    name="content"
                    label="Your Testimonial"
                    rules={[
                      { required: true, message: 'Please share your experience' },
                      { min: 20, message: 'Please provide at least 20 characters' },
                      { max: 500, message: 'Testimonial cannot exceed 500 characters' }
                    ]}
                  >
                    <TextArea
                      rows={6}
                      placeholder="Tell us about your experience with HIDRIVE. What services did you use? How did we help you? What would you say to others considering our services?"
                      maxLength={500}
                      showCount
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="avatar"
                    label="Profile Photo (Optional)"
                  >
                    <Upload {...uploadProps} listType="picture-card">
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Upload Photo</div>
                      </div>
                    </Upload>
                  </Form.Item>

                  <Alert
                    message="Privacy Notice"
                    description="Your testimonial will be reviewed before publication. We may contact you to verify your submission. Your email address will not be published publicly."
                    type="info"
                    showIcon
                    style={{ marginBottom: 24 }}
                  />

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      icon={<SendOutlined />}
                      loading={submitMutation.isPending}
                      style={{ width: '100%', height: '48px' }}
                    >
                      Submit Testimonial
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
} 