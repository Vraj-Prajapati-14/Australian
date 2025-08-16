import { useState } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { api, setAuthToken } from '../../lib/api';
import { saveToken } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', values);
      saveToken(data.token);
      setAuthToken(data.token);
      message.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      message.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', placeContent: 'center', minHeight: '70vh' }}>
      <Card title="Admin Login" style={{ width: 360 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="admin email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Login
          </Button>
          <Typography.Paragraph type="secondary" style={{ marginTop: 12 }}>
            Use the credentials from your backend env.
          </Typography.Paragraph>
        </Form>
      </Card>
    </div>
  );
}

