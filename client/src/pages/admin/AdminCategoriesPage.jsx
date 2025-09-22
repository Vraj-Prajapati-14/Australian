import { useState } from 'react';
import '../../styles/admin-forms.css';
import { 
  Button, 
  Modal, 
  Input, 
  Card, 
  Table, 
  Tag, 
  Select
} from '../../components/ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

// Helper components for icons
const PlusIcon = () => <span>+</span>;
const EditIcon = () => <span>✏️</span>;
const DeleteIcon = () => <span>🗑️</span>;
const LinkIcon = () => <span>🔗</span>;

export default function AdminCategoriesPage() {
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [serviceCategoryModalVisible, setServiceCategoryModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({});
  const [serviceCategoryData, setServiceCategoryData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const queryClient = useQueryClient();
  
  // Simple message system
  const showMessage = (type, content) => {
    console.log(`${type}: ${content}`);
    alert(`${type}: ${content}`);
  };

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
      showMessage('success', 'Category created successfully');
      setCategoryModalVisible(false);
      setFormData({});
      setFormErrors({});
    },
    onError: (error) => {
      console.error('Create category error:', error);
      showMessage('error', 'Error creating category. Please try again.');
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/service-categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['service-categories']);
      showMessage('success', 'Category updated successfully');
      setCategoryModalVisible(false);
      setEditingCategory(null);
      setFormData({});
      setFormErrors({});
    },
    onError: (error) => {
      console.error('Update category error:', error);
      showMessage('error', 'Error updating category. Please try again.');
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => api.delete(`/service-categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['service-categories']);
      showMessage('success', 'Category deleted successfully');
    },
    onError: (error) => {
      console.error('Delete category error:', error);
      showMessage('error', 'Error deleting category. Please try again.');
    }
  });

  const updateServiceCategoriesMutation = useMutation({
    mutationFn: ({ serviceId, categories }) => api.put(`/services/${serviceId}`, { categories }),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminMainServices']);
      showMessage('success', 'Service categories updated successfully');
      setServiceCategoryModalVisible(false);
      setSelectedService(null);
      setServiceCategoryData({});
    },
    onError: (error) => {
      console.error('Update service categories error:', error);
      showMessage('error', 'Error updating service categories. Please try again.');
    }
  });

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({});
    setFormErrors({});
    setCategoryModalVisible(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      order: category.order || 0
    });
    setFormErrors({});
    setCategoryModalVisible(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Delete this category? This action cannot be undone.')) {
    try {
      await deleteCategoryMutation.mutateAsync(categoryId);
    } catch (error) {
      console.error('Error deleting category:', error);
      }
    }
  };

  const handleAssignCategories = (service) => {
    setSelectedService(service);
    setServiceCategoryData({
      categories: service.categories?.map(cat => cat._id) || []
    });
    setServiceCategoryModalVisible(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategoryMutation.mutateAsync({ id: editingCategory._id, data: formData });
      } else {
        await createCategoryMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleServiceCategoriesSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateServiceCategoriesMutation.mutateAsync({ 
        serviceId: selectedService._id, 
        categories: serviceCategoryData.categories 
      });
    } catch (error) {
      console.error('Error updating service categories:', error);
    }
  };

  const handleCancel = () => {
    setCategoryModalVisible(false);
    setEditingCategory(null);
    setFormData({});
    setFormErrors({});
  };

  const handleServiceCategoryCancel = () => {
    setServiceCategoryModalVisible(false);
    setSelectedService(null);
    setServiceCategoryData({});
  };

  const categoryColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <span style={{ fontWeight: '600', color: '#1f2937' }}>{text}</span>
      )
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (text) => (
        <span style={{ 
          fontFamily: 'monospace', 
          background: '#f3f4f6', 
          padding: '2px 6px', 
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {text}
        </span>
      )
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
        <div className="action-buttons">
          <button 
            className="action-btn edit"
            onClick={() => handleEditCategory(record)}
            title="Edit Category"
          >
            <EditIcon />
          </button>
          <button 
            className="action-btn delete"
            onClick={() => handleDeleteCategory(record._id)}
            title="Delete Category"
          >
            <DeleteIcon />
          </button>
        </div>
      )
    }
  ];

  const serviceColumns = [
    {
      title: 'Service',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {record.shortDescription}
          </div>
        </div>
      )
    },
    {
      title: 'Categories',
      key: 'categories',
      render: (_, record) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {record.categories?.map(cat => (
            <Tag key={cat._id} color="blue">
              {cat.name}
            </Tag>
          )) || <span style={{ color: '#9ca3af' }}>No categories</span>}
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="action-buttons">
          <button 
            className="action-btn edit"
          onClick={() => handleAssignCategories(record)}
            title="Assign Categories"
        >
            <LinkIcon />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2 className="page-title">Categories Management</h2>
        <p className="page-description">Manage service categories and assign them to services</p>
      </div>

      {/* Categories Section */}
      <Card className="services-card">
        <div className="card-header">
          <div className="card-title">
            <h4>Service Categories ({categories.length})</h4>
            <p className="card-subtitle">Create and manage service categories</p>
          </div>
              <Button 
            variant="primary" 
                onClick={handleAddCategory}
            className="add-service-btn"
              >
            <PlusIcon /> Add Category
              </Button>
            </div>
        
            <Table
          className="services-table"
              columns={categoryColumns}
          dataSource={Array.isArray(categories) ? categories : []}
              rowKey="_id"
              loading={categoriesLoading}
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
              }}
            />
          </Card>

      {/* Services Section */}
      <Card className="services-card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <div className="card-title">
            <h4>Main Services ({mainServices.length})</h4>
            <p className="card-subtitle">Assign categories to main services</p>
          </div>
        </div>
        
            <Table
          className="services-table"
              columns={serviceColumns}
          dataSource={Array.isArray(mainServices) ? mainServices : []}
              rowKey="_id"
              loading={servicesLoading}
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
              }}
            />
          </Card>

      {/* Category Modal */}
      <Modal
        isOpen={categoryModalVisible}
        onClose={handleCancel}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        size="md"
      >
        <form onSubmit={handleCategorySubmit}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
              Category Information
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Category Name *
              </label>
              <Input 
                placeholder="e.g., Automotive Accessories"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                error={formErrors.name}
                required
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Slug *
              </label>
              <Input 
                placeholder="e.g., automotive-accessories"
                value={formData.slug || ''}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                error={formErrors.slug}
                required
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Description
              </label>
              <Input.Textarea 
                rows={3}
                placeholder="Brief description of the category"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                error={formErrors.description}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Display Order
              </label>
              <Input 
                type="number"
                placeholder="0"
                value={formData.order || 0}
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                error={formErrors.order}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button"
              className="btn btn-outline"
              onClick={handleCancel}
            >
                Cancel
            </button>
            <button 
              type="submit"
              className="btn btn-primary"
              disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
            >
              {createCategoryMutation.isPending || updateCategoryMutation.isPending ? 'Saving...' : (editingCategory ? 'Update Category' : 'Add Category')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Service Categories Modal */}
      <Modal
        isOpen={serviceCategoryModalVisible}
        onClose={handleServiceCategoryCancel}
        title={`Assign Categories to ${selectedService?.title}`}
        size="md"
      >
        <form onSubmit={handleServiceCategoriesSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
              Select Categories
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Categories
              </label>
            <Select
              mode="multiple"
                placeholder="Select categories"
                value={serviceCategoryData.categories || []}
                onChange={(value) => setServiceCategoryData({...serviceCategoryData, categories: value})}
                options={categories.map(cat => ({
                  value: cat._id,
                  label: cat.name
                }))}
              style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button"
              className="btn btn-outline"
              onClick={handleServiceCategoryCancel}
            >
                Cancel
            </button>
            <button 
              type="submit"
              className="btn btn-primary"
              disabled={updateServiceCategoriesMutation.isPending}
            >
              {updateServiceCategoriesMutation.isPending ? 'Updating...' : 'Update Categories'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}