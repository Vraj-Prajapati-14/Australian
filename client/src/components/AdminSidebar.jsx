import React from 'react';
import { Menu, Typography, Avatar, Divider } from 'antd';
import { 
  DashboardOutlined,
  CarOutlined,
  ProjectOutlined,
  FileTextOutlined,
  PictureOutlined,
  TeamOutlined,
  SettingOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  AppstoreOutlined,
  BookOutlined,
  TrophyOutlined,
  MessageOutlined,
  StarOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../lib/auth';

const { Title, Text } = Typography;

export default function AdminSidebar({ isMobile = false, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/admin/login');
    if (onClose) onClose();
  };

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined className="menu-icon" />,
      label: <Link to="/admin" onClick={isMobile ? onClose : undefined} className="menu-link">Dashboard</Link>
    },
    {
      type: 'divider',
      key: 'divider-1'
    },
    {
      key: 'services',
      icon: <CarOutlined className="menu-icon" />,
      label: 'Services',
      children: [
        {
          key: '/admin/services',
          label: <Link to="/admin/services" onClick={isMobile ? onClose : undefined} className="menu-link">Manage Services</Link>
        }
      ]
    },
    {
      key: 'content',
      icon: <AppstoreOutlined className="menu-icon" />,
      label: 'Content Management',
      children: [
        {
          key: '/admin/projects',
          icon: <ProjectOutlined className="submenu-icon" />,
          label: <Link to="/admin/projects" onClick={isMobile ? onClose : undefined} className="menu-link">Projects</Link>
        },
        {
          key: '/admin/case-studies',
          icon: <FileTextOutlined className="submenu-icon" />,
          label: <Link to="/admin/case-studies" onClick={isMobile ? onClose : undefined} className="menu-link">Case Studies</Link>
        },
        {
          key: '/admin/inspiration',
          icon: <PictureOutlined className="submenu-icon" />,
          label: <Link to="/admin/inspiration" onClick={isMobile ? onClose : undefined} className="menu-link">Inspiration Gallery</Link>
        }
      ]
    },
    {
      key: 'team',
      icon: <TeamOutlined className="menu-icon" />,
      label: <Link to="/admin/team" onClick={isMobile ? onClose : undefined} className="menu-link">Team Management</Link>
    },
    {
      key: '/admin/departments',
      icon: <HomeOutlined className="menu-icon" />,
      label: <Link to="/admin/departments" onClick={isMobile ? onClose : undefined} className="menu-link">Departments</Link>
    },
    {
      key: '/admin/contacts',
      icon: <MessageOutlined className="menu-icon" />,
      label: <Link to="/admin/contacts" onClick={isMobile ? onClose : undefined} className="menu-link">Contact Management</Link>
    },
    {
      key: '/admin/testimonials',
      icon: <StarOutlined className="menu-icon" />,
      label: <Link to="/admin/testimonials" onClick={isMobile ? onClose : undefined} className="menu-link">Testimonials</Link>
    },
    {
      type: 'divider',
      key: 'divider-2'
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined className="menu-icon" />,
      label: <Link to="/admin/analytics" onClick={isMobile ? onClose : undefined} className="menu-link">Analytics</Link>
    },
    {
      key: 'settings',
      icon: <SettingOutlined className="menu-icon" />,
      label: <Link to="/admin/settings" onClick={isMobile ? onClose : undefined} className="menu-link">Site Settings</Link>
    }
  ];

  // Get the current active key based on location
  const getActiveKey = () => {
    const path = location.pathname;
    
    if (path === '/admin') return '/admin';
    if (path.startsWith('/admin/services')) return '/admin/services';
    if (path.startsWith('/admin/projects')) return '/admin/projects';
    if (path.startsWith('/admin/case-studies')) return '/admin/case-studies';
    if (path.startsWith('/admin/inspiration')) return '/admin/inspiration';
    if (path.startsWith('/admin/team')) return '/admin/team';
    if (path.startsWith('/admin/departments')) return '/admin/departments';
    if (path.startsWith('/admin/contacts')) return '/admin/contacts';
    if (path.startsWith('/admin/testimonials')) return '/admin/testimonials';
    if (path.startsWith('/admin/analytics')) return '/admin/analytics';
    if (path.startsWith('/admin/settings')) return '/admin/settings';
    return '/admin';
  };

  const getOpenKeys = () => {
    const path = location.pathname;
    const openKeys = [];
    
    if (path.startsWith('/admin/services')) {
      openKeys.push('services');
    }
    if (path.startsWith('/admin/projects') || path.startsWith('/admin/case-studies') || path.startsWith('/admin/inspiration')) {
      openKeys.push('content');
    }
    
    return openKeys;
  };

  const sidebarContent = (
    <div className="admin-sidebar-container">
      {/* Logo/Brand Section */}
      <div className="sidebar-header">
        <div className="logo-section">
          <div className="logo-icon">
            <TrophyOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
          </div>
          <div className="logo-text">
            <Title level={4} className="brand-title">HIDRIVE</Title>
            <Text className="brand-subtitle">Admin Panel</Text>
          </div>
        </div>
      </div>

      <Divider className="sidebar-divider" />

      {/* User Profile Section */}
      <div className="user-profile-section">
        <Avatar 
          size={40} 
          style={{ backgroundColor: '#1677ff' }}
          className="user-avatar"
        >
          A
        </Avatar>
        <div className="user-info">
          <Text className="user-name">Admin User</Text>
          <Text className="user-role">Administrator</Text>
        </div>
      </div>

      <Divider className="sidebar-divider" />

      {/* Navigation Menu */}
      <div className="menu-container">
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[getActiveKey()]}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          className="admin-sidebar-menu"
        />
      </div>

      {/* Logout Section */}
      <div className="logout-section">
        <Divider className="sidebar-divider" />
        <button 
          onClick={handleLogout}
          className="logout-button"
        >
          <LogoutOutlined className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="admin-sidebar-mobile">
        {sidebarContent}
      </div>
    );
  }

  return (
    <div className="admin-sidebar">
      {sidebarContent}
    </div>
  );
}