import { Typography, Form, Input, Button } from 'antd';

export default function ContactPage() {
  const onFinish = (values) => {
    // Placeholder: wire up email API later
    alert('Submitted: ' + JSON.stringify(values, null, 2))
  }
  return (
    <div>
      <Typography.Title>Contact Us</Typography.Title>
      <Form layout="vertical" onFinish={onFinish} style={{ maxWidth: 600 }}>
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Phone" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="Message" name="message" rules={[{ required: true }] }>
          <Input.TextArea rows={5} />
        </Form.Item>
        <Button type="primary" htmlType="submit">Send</Button>
      </Form>
    </div>
  )
}

