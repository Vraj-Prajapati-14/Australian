import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, InputNumber, Space, message, Card, Tag, Tooltip } from 'antd';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiGrid } from 'react-icons/fi';
import { api } from '../../lib/api';

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient()
  const { data: categories, isLoading } = useQuery({ 
    queryKey: ['service-categories'], 
    queryFn: async () => (await api.get('/service-categories')).data 
  })
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form] = Form.useForm()

  const onCreate = () => { 
    setEditing(null); 
    form.resetFields(); 
    setOpen(true) 
  }
  
  const onEdit = (record) => { 
    setEditing(record); 
    form.setFieldsValue({
      ...record,
      parent: record.parent?._id || record.parent
    }); 
    setOpen(true) 
  }
  
  const onDelete = async (record) => { 
    try {
      await api.delete(`/service-categories/${record._id}`)
      message.success('Category deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['service-categories'] })
    } catch (error) {
      message.error('Failed to delete category')
    }
  }
  
  const onSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editing) {
        await api.put(`/service-categories/${editing._id}`, values)
        message.success('Category updated successfully')
      } else {
        await api.post('/service-categories', values)
        message.success('Category created successfully')
      }
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: ['service-categories'] })
    } catch (error) {
      message.error('Failed to save category')
    }
  }

  const parentOptions = (categories || []).map(c => ({ 
    value: c._id, 
    label: c.name,
    disabled: editing && c._id === editing._id // Prevent self-reference
  }))

  const columns = [
    { 
      title: 'Name', 
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center space-x-2">
          <FiGrid className="w-4 h-4 text-blue-600" />
          <span className="font-medium">{text}</span>
          {record.isParent && <Tag color="blue">Parent</Tag>}
        </div>
      )
    },
    { 
      title: 'Slug', 
      dataIndex: 'slug',
      key: 'slug',
      render: (text) => <code className="bg-gray-100 px-2 py-1 rounded text-sm">{text}</code>
    },
    { 
      title: 'Order', 
      dataIndex: 'order',
      key: 'order',
      render: (text) => <Tag color="green">{text || 0}</Tag>
    },
    { 
      title: 'Parent', 
      dataIndex: 'parent',
      key: 'parent',
      render: (parent) => {
        if (!parent) return <Tag color="default">Root</Tag>
        const parentCategory = categories?.find(c => c._id === parent._id || c._id === parent)
        return parentCategory ? <Tag color="blue">{parentCategory.name}</Tag> : '-'
      }
    },
    { 
      title: 'Description', 
      dataIndex: 'description',
      key: 'description',
      render: (text) => text ? (
        <Tooltip title={text}>
          <span className="text-gray-600 truncate max-w-xs block">{text}</span>
        </Tooltip>
      ) : '-'
    },
    { 
      title: 'Actions', 
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<FiEdit />}
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
          <Button 
            danger 
            size="small" 
            icon={<FiTrash2 />}
            onClick={() => onDelete(record)}
          >
            Delete
          </Button>
        </Space>
      )
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Categories</h1>
          <p className="text-gray-600 mt-1">Manage your service categories and hierarchy</p>
        </div>
        <Button 
          type="primary" 
          size="large"
          icon={<FiPlus />}
          onClick={onCreate}
          className="mt-4 sm:mt-0"
        >
          New Category
        </Button>
      </div>

      {/* Categories Table */}
      <Card>
        <Table 
          rowKey="_id" 
          loading={isLoading} 
          dataSource={categories || []} 
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} categories`
          }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal 
        title={editing ? 'Edit Category' : 'New Category'} 
        open={open} 
        onOk={onSubmit} 
        onCancel={() => setOpen(false)}
        width={600}
        okText={editing ? 'Update' : 'Create'}
        cancelText="Cancel"
      >
        <Form layout="vertical" form={form} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item 
              label="Name" 
              name="name" 
              rules={[{ required: true, message: 'Please enter category name' }]}
            >
              <Input placeholder="Enter category name" />
            </Form.Item>
            
            <Form.Item 
              label="Slug" 
              name="slug" 
              rules={[{ required: true, message: 'Please enter category slug' }]}
            >
              <Input placeholder="category-slug" />
            </Form.Item>
          </div>
          
          <Form.Item 
            label="Parent Category" 
            name="parent"
            help="Leave empty for root category"
          >
            <Select 
              allowClear 
              placeholder="Select parent category"
              options={parentOptions}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item 
              label="Order" 
              name="order"
              help="Lower numbers appear first"
            >
              <InputNumber 
                style={{ width: '100%' }} 
                min={0}
                placeholder="0"
              />
            </Form.Item>
          </div>
          
          <Form.Item 
            label="Description" 
            name="description"
            help="Optional description for the category"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Describe this category..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

