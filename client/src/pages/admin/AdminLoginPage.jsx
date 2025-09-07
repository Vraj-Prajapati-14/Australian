import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Spin } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

const { Title, Text } = Typography;

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', values);
      const { token, admin } = response.data;
      
      if (token && admin) {
        localStorage.setItem('aes_admin_token', token);
        localStorage.setItem('aes_admin_user', JSON.stringify(admin));
        navigate('/admin');
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Modern CSS styles
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden'
  };

  const backgroundPatternStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '420px',
    background: '#ffffff',
    border: 'none',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
    position: 'relative',
    zIndex: 10,
    padding: '40px'
  };

  const logoStyle = {
    textAlign: 'center',
    marginBottom: '40px'
  };

  const titleStyle = {
    color: '#1a1a1a',
    marginBottom: '8px',
    fontWeight: '800',
    fontSize: '32px',
    letterSpacing: '-0.5px'
  };

  const subtitleStyle = {
    color: '#666',
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '1.5'
  };

  const formStyle = {
    marginTop: '32px'
  };

  const inputStyle = {
    height: '52px',
    borderRadius: '12px',
    border: '2px solid #f0f0f0',
    fontSize: '16px',
    padding: '0 16px',
    transition: 'all 0.3s ease'
  };

  const buttonStyle = {
    width: '100%',
    height: '52px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
    border: 'none',
    boxShadow: '0 4px 12px rgba(22, 119, 255, 0.3)',
    transition: 'all 0.3s ease'
  };

  const alertStyle = {
    marginBottom: '24px',
    borderRadius: '12px',
    border: 'none',
    background: '#fff2f0',
    borderLeft: '4px solid #ff4d4f'
  };

  const footerStyle = {
    textAlign: 'center',
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #f0f0f0'
  };

  const footerTextStyle = {
    color: '#999',
    fontSize: '14px',
    lineHeight: '1.5'
  };

  return (
    <div style={containerStyle}>
      {/* Background Pattern */}
      <div style={backgroundPatternStyle}></div>
      
      {/* Login Card */}
      <Card style={cardStyle}>
        {/* Logo/Header */}
        <div style={logoStyle}>
          <Title level={1} style={titleStyle}>
            HIDRIVE Admin
          </Title>
          <Text style={subtitleStyle}>
            Sign in to your admin account
          </Text>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={alertStyle}
          />
        )}

        {/* Login Form */}
        <Form
          name="admin-login"
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
          style={formStyle}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#bfbfbf', fontSize: '16px' }} />}
              placeholder="Email address"
              style={inputStyle}
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf', fontSize: '16px' }} />}
              placeholder="Password"
              style={inputStyle}
              autoComplete="current-password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={!loading && <LoginOutlined />}
              style={buttonStyle}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Form.Item>
        </Form>

        {/* Footer */}
        <div style={footerStyle}>
          <Text style={footerTextStyle}>
            Forgot your password? Contact your administrator.
          </Text>
        </div>
      </Card>
    </div>
  );
}

