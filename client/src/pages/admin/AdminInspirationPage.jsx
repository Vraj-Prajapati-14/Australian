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
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, PictureOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function AdminInspirationPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  const [inspirationItems, setInspirationItems] = useState([
    {
      id: 1,
      title: "Modinex Ute with HIDRIVE Canopy",
      category: "ute",
      description: "Premium ute canopy with integrated storage solutions for sales team operations.",
      image: "/modinex-ute.jpg",
      tags: ["Ute", "Canopy", "Sales", "Premium"],
      status: "published",
      isFeatured: true
    },
    {
      id: 2,
      title: "EMS Field Mechanic Fleet",
      category: "fleet",
      description: "Complete fleet of ute and truck service bodies for mechanical services.",
      image: "/ems-fleet.jpg",
      tags: ["Fleet", "Mechanical", "Ute", "Truck"],
      status: "published",
      isFeatured: true
    },
    {
      id: 3,
      title: "Gecko Cleantech Spills Trailer",
      category: "trailer",
      description: "Specialized spills cleanup trailer for airport runway safety.",
      image: "/gecko-trailer.jpg",
      tags: ["Trailer", "Specialized", "Airport", "Safety"],
      status: "published",
      isFeatured: false
    }
  ]);

  const showModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      form.setFieldsValue(item);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (editingItem) {
        // Update existing item
        setInspirationItems(prev => 
          prev.map(i => 
            i.id === editingItem.id 
              ? { ...i, ...values }
              : i
          )
        );
        message.success('Inspiration item updated successfully');
      } else {
        // Create new item
        const newItem = {
          id: Date.now(),
          ...values,
          status: 'draft'
        };
        setInspirationItems(prev => [...prev, newItem]);
        message.success('Inspiration item created successfully');
      }
      handleCancel();
    } catch (error) {
      message.error('An error occurred');
    }
  };

  const handleDelete = (id) => {
    setInspirationItems(prev => prev.filter(i => i.id !== id));
    message.success('Inspiration item deleted successfully');
  };

  const handleStatusChange = (id, status) => {
    setInspirationItems(prev => 
      prev.map(i => 
        i.id === id 
          ? { ...i, status }
          : i
      )
    );
    message.success(`Inspiration item ${status}`);
  };

  const categories = [
    { value: 'ute', label: 'Ute' },
    { value: 'trailer', label: 'Trailer' },
    { value: 'truck', label: 'Truck' },
    { value: 'fleet', label: 'Fleet' },
    { value: 'government', label: 'Government' },
    { value: 'emergency', label: 'Emergency' }
  ];

  const columns = [
    {
      title: 'Preview',
      dataIndex: 'image',
      key: 'image',
      render: (image, record) => (
        <div style={{ 
          width: 80, 
          height: 60, 
          background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 24
        }}>
          {record.category === 'ute' && '🚗'}
          {record.category === 'trailer' && '🚛'}
          {record.category === 'truck' && '🚚'}
          {record.category === 'fleet' && '🏢'}
          {record.category === 'government' && '🏛️'}
          {record.category === 'emergency' && '🚨'}
        </div>
      )
    },
    {
      title: 'Title & Category',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>
            Category: {record.category.charAt(0).toUpperCase() + record.category.slice(1)}
          </div>
        </div>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <div style={{ maxWidth: 300 }}>
          <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0 }}>
            {text}
          </Paragraph>
        </div>
      )
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => (
        <div>
          {tags.slice(0, 3).map((tag, index) => (
            <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
              {tag}
            </Tag>
          ))}
          {tags.length > 3 && <Tag>+{tags.length - 3}</Tag>}
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
            setInspirationItems(prev => 
              prev.map(i => 
                i.id === record.id 
                  ? { ...i, isFeatured: value }
                  : i
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
            title="Are you sure you want to delete this inspiration item?"
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
            <Title level={2}>Inspiration Gallery Management</Title>
            <Paragraph>Manage inspiration gallery items and showcase your best work</Paragraph>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={() => showModal()}
          >
            Add Inspiration Item
          </Button>
        </div>

        <Table 
          columns={columns} 
          dataSource={inspirationItems}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} inspiration items`
          }}
        />
      </Card>

      <Modal
        title={editingItem ? 'Edit Inspiration Item' : 'Add New Inspiration Item'}
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
            rules={[{ required: true, message: 'Please enter the title' }]}
          >
            <Input placeholder="Enter inspiration item title" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select placeholder="Select category">
              {categories.map(cat => (
                <Option key={cat.value} value={cat.value}>{cat.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter the description' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Enter description of the inspiration item"
            />
          </Form.Item>

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
            rules={[{ required: true, message: 'Please enter the image URL' }]}
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
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 