import { useState } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Space, 
  Card, 
  Typography, 
  Popconfirm,
  App,
  Select,
  Tag,
  Row,
  Col
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

const { Title, Text } = Typography;
const { Option } = Select;

export default function AdminCategoriesPage() {
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [serviceCategoryModalVisible, setServiceCategoryModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [form] = Form.useForm();
  const [serviceCategoryForm] = Form.useForm();
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({ 
    queryKey: ['service-categories'], 
    queryFn: async () => {
      const response = await api.get('/service-categories');
      return response.data || [];
    }
  });

  // Fetch main services
  const { data: mainServices = [], isLoading: servicesLoading } = useQuery({ 
    queryKey: ['adminMainServices'], 
    queryFn: async () => {
      const response = await api.get('/services?type=main');
      return response.data || [];
    }
  });

  // Mutations
  const createCategoryMutation = useMutation({
    mutationFn: (data) => api.post('/service-categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['service-categories']);
      message.success('Category created successfully');
    },
    onError: (error) => {
      console.error('Create category error:', error);
      message.error('Error creating category. Please try again.');
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/service-categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['service-categories']);
      message.success('Category updated successfully');
    },
    onError: (error) => {
      console.error('Update category error:', error);
      message.error('Error updating category. Please try again.');
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => api.delete(`/service-categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['service-categories']);
      message.success('Category deleted successfully');
    },
    onError: (error) => {
      console.error('Delete category error:', error);
      message.error('Error deleting category. Please try again.');
    }
  });

  const updateServiceCategoriesMutation = useMutation({
    mutationFn: ({ serviceId, categories }) => api.put(`/services/${serviceId}`, { categories }),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminMainServices']);
      message.success('Service categories updated successfully');
    },
    onError: (error) => {
      console.error('Update service categories error:', error);
      message.error('Error updating service categories. Please try again.');
    }
  });

  const handleAddCategory = () => {
    setEditingCategory(null);
    form.resetFields();
    setCategoryModalVisible(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setCategoryModalVisible(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategoryMutation.mutateAsync(categoryId);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleAssignCategories = (service) => {
    setSelectedService(service);
    serviceCategoryForm.setFieldsValue({
      categories: service.categories?.map(cat => cat._id) || []
    });
    setServiceCategoryModalVisible(true);
  };

  const handleCategorySubmit = async (values) => {
    try {
      if (editingCategory) {
        await updateCategoryMutation.mutateAsync({ id: editingCategory._id, data: values });
      } else {
        await createCategoryMutation.mutateAsync(values);
      }
      setCategoryModalVisible(false);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleServiceCategoriesSubmit = async (values) => {
    try {
      await updateServiceCategoriesMutation.mutateAsync({ 
        serviceId: selectedService._id, 
        categories: values.categories 
      });
      setServiceCategoryModalVisible(false);
    } catch (error) {
      console.error('Error updating service categories:', error);
    }
  };

  const categoryColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (text) => <Text code>{text}</Text>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => text || '-'
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      render: (text) => text || 0
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditCategory(record)}
          />
          <Popconfirm
            title="Delete this category?"
            description="This action cannot be undone."
            onConfirm={() => handleDeleteCategory(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const serviceColumns = [
    {
      title: 'Service',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Categories',
      key: 'categories',
      render: (_, record) => (
        <Space wrap>
          {record.categories?.map(category => (
            <Tag key={category._id} color="blue">
              {category.name}
            </Tag>
          )) || <Text type="secondary">No categories assigned</Text>}
        </Space>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<LinkOutlined />} 
          onClick={() => handleAssignCategories(record)}
        >
          Assign Categories
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '100%', overflowX: 'auto' }}>
      <Title level={2}>Service Categories Management</Title>
      
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card title="Categories">
            <div style={{ marginBottom: 16 }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAddCategory}
              >
                Add Category
              </Button>
            </div>
            <Table
              columns={categoryColumns}
              dataSource={categories}
              rowKey="_id"
              loading={categoriesLoading}
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </Card>
        </Col>
        
        <Col span={12}>
          <Card title="Service Category Assignment">
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">
                Assign categories to main services. Each service can have multiple categories.
              </Text>
            </div>
            <Table
              columns={serviceColumns}
              dataSource={mainServices}
              rowKey="_id"
              loading={servicesLoading}
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Category Modal */}
      <Modal
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        open={categoryModalVisible}
        onCancel={() => setCategoryModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCategorySubmit}
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input placeholder="e.g., Ute, Trailer, Truck" />
          </Form.Item>
          
          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: 'Please enter slug' }]}
          >
            <Input placeholder="e.g., ute, trailer, truck" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={3} placeholder="Category description" />
          </Form.Item>
          
          <Form.Item
            name="order"
            label="Display Order"
            initialValue={0}
          >
            <Input type="number" min={0} placeholder="0" />
          </Form.Item>
          
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={() => setCategoryModalVisible(false)}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={createCategoryMutation.isPending || updateCategoryMutation.isPending}
              >
                {editingCategory ? 'Update Category' : 'Add Category'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Service Categories Modal */}
      <Modal
        title={`Assign Categories to ${selectedService?.title}`}
        open={serviceCategoryModalVisible}
        onCancel={() => setServiceCategoryModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={serviceCategoryForm}
          layout="vertical"
          onFinish={handleServiceCategoriesSubmit}
        >
          <Form.Item
            name="categories"
            label="Select Categories"
          >
            <Select
              mode="multiple"
              placeholder="Select categories for this service"
              style={{ width: '100%' }}
              showSearch
              filterOption={(input, option) =>
                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {categories.map(category => (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={() => setServiceCategoryModalVisible(false)}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={updateServiceCategoriesMutation.isPending}
              >
                Update Categories
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

