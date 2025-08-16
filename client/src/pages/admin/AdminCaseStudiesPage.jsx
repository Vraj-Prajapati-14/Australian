import { useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Card, 
  Typography,
  Tag,
  Popconfirm,
  Image,
  Row,
  Col
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function AdminCaseStudiesPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCaseStudy, setEditingCaseStudy] = useState(null);
  const [form] = Form.useForm();

  const [caseStudies, setCaseStudies] = useState([
    {
      id: 1,
      title: "EMS Field Mechanic Fleet",
      company: "Elphinstone Mechanical Services",
      description: "EMS collaborated with HIDRIVE to design and manufacture our fleet of fit-for-purpose ute and truck service bodies, making life easier and more productive for our mechanical services team every day.",
      testimonial: "One of the reasons why mechanics join and stay at EMS is the gear we get to use, especially the vehicles. We couldn't be any happier with the HIDRIVE service bodies on our trucks and utes, they're so much easier and safer to work with.",
      author: "Alex",
      role: "Mechanic",
      image: "/ems-case-study.jpg",
      tags: ["Fleet", "Mechanical", "Ute", "Truck"],
      isFeatured: true,
      status: "published"
    },
    {
      id: 2,
      title: "Modinex Ute Fleet",
      company: "Modinex",
      description: "Modinex trusted HIDRIVE to design and manufacture a fleet of premium, fit-for-purpose ute service bodies for the sales team.",
      testimonial: "We chose HIDRIVE because we're a premium Australian-made brand in our market – just like HIDRIVE. People see our utes before they see our samples and our staff, so our fleet has to look the part, inside and out.",
      author: "Leroy Parker",
      role: "Sales Director",
      image: "/modinex-case-study.jpg",
      tags: ["Fleet", "Sales", "Ute", "Premium"],
      isFeatured: true,
      status: "published"
    }
  ]);

  const showModal = (caseStudy = null) => {
    setEditingCaseStudy(caseStudy);
    if (caseStudy) {
      form.setFieldsValue(caseStudy);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCaseStudy(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (editingCaseStudy) {
        // Update existing case study
        setCaseStudies(prev => 
          prev.map(cs => 
            cs.id === editingCaseStudy.id 
              ? { ...cs, ...values }
              : cs
          )
        );
        message.success('Case study updated successfully');
      } else {
        // Create new case study
        const newCaseStudy = {
          id: Date.now(),
          ...values,
          status: 'draft'
        };
        setCaseStudies(prev => [...prev, newCaseStudy]);
        message.success('Case study created successfully');
      }
      handleCancel();
    } catch (error) {
      message.error('An error occurred');
    }
  };

  const handleDelete = (id) => {
    setCaseStudies(prev => prev.filter(cs => cs.id !== id));
    message.success('Case study deleted successfully');
  };

  const handleStatusChange = (id, status) => {
    setCaseStudies(prev => 
      prev.map(cs => 
        cs.id === id 
          ? { ...cs, status }
          : cs
      )
    );
    message.success(`Case study ${status}`);
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.company}</div>
        </div>
      )
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.role}</div>
        </div>
      )
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => (
        <div>
          {tags.map((tag, index) => (
            <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
              {tag}
            </Tag>
          ))}
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record.id, value)}
          style={{ width: 120 }}
        >
          <Option value="draft">Draft</Option>
          <Option value="published">Published</Option>
          <Option value="archived">Archived</Option>
        </Select>
      )
    },
    {
      title: 'Featured',
      dataIndex: 'isFeatured',
      key: 'isFeatured',
      render: (isFeatured, record) => (
        <Select
          value={isFeatured}
          onChange={(value) => {
            setCaseStudies(prev => 
              prev.map(cs => 
                cs.id === record.id 
                  ? { ...cs, isFeatured: value }
                  : cs
              )
            );
          }}
          style={{ width: 100 }}
        >
          <Option value={true}>Yes</Option>
          <Option value={false}>No</Option>
        </Select>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => showModal(record)}
            title="View"
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => showModal(record)}
            title="Edit"
          />
          <Popconfirm
            title="Are you sure you want to delete this case study?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="text" 
              icon={<DeleteOutlined />} 
              danger
              title="Delete"
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <Title level={2}>Case Studies Management</Title>
            <Paragraph>Manage customer success stories and case studies</Paragraph>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={() => showModal()}
          >
            Add Case Study
          </Button>
        </div>

        <Table 
          columns={columns} 
          dataSource={caseStudies}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} case studies`
          }}
        />
      </Card>

      <Modal
        title={editingCaseStudy ? 'Edit Case Study' : 'Add New Case Study'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isFeatured: false,
            status: 'draft'
          }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter the case study title' }]}
          >
            <Input placeholder="Enter case study title" />
          </Form.Item>

          <Form.Item
            name="company"
            label="Company"
            rules={[{ required: true, message: 'Please enter the company name' }]}
          >
            <Input placeholder="Enter company name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter the case study description' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Enter case study description"
            />
          </Form.Item>

          <Form.Item
            name="testimonial"
            label="Customer Testimonial"
            rules={[{ required: true, message: 'Please enter the customer testimonial' }]}
          >
            <TextArea 
              rows={3} 
              placeholder="Enter customer testimonial"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="author"
                label="Author Name"
                rules={[{ required: true, message: 'Please enter the author name' }]}
              >
                <Input placeholder="Enter author name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Author Role"
                rules={[{ required: true, message: 'Please enter the author role' }]}
              >
                <Input placeholder="Enter author role" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="tags"
            label="Tags"
            rules={[{ required: true, message: 'Please enter at least one tag' }]}
          >
            <Select
              mode="tags"
              placeholder="Enter tags"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="image"
            label="Image URL"
          >
            <Input placeholder="Enter image URL" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="isFeatured"
                label="Featured"
                valuePropName="checked"
              >
                <Select>
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
              >
                <Select>
                  <Option value="draft">Draft</Option>
                  <Option value="published">Published</Option>
                  <Option value="archived">Archived</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingCaseStudy ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 