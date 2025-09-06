import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { MenuOutlined, CloseOutlined, LogoutOutlined } from '@ant-design/icons';
import { Button, Drawer, Spin, Avatar, Dropdown } from 'antd';
import AdminSidebar from '../components/AdminSidebar';
import { getToken, removeToken } from '../lib/auth';

// Custom hook to detect mobile screen size
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    removeToken();
    window.location.href = '/admin/login';
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Spin size="large" style={{ color: '#ffffff' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <Avatar size="small" style={{ backgroundColor: '#1677ff' }}>A</Avatar>
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout
    }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Desktop Sidebar - Always visible on desktop */}
      <div className="admin-sidebar-desktop">
        <AdminSidebar />
      </div>

      {/* Mobile Header - Only render on mobile */}
      {isMobile && (
        <div className="admin-mobile-header">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setIsSidebarOpen(true)}
            className="mobile-menu-button"
          />
          <h1 className="mobile-title">HIDRIVE Admin</h1>
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Avatar 
              size={32} 
              style={{ backgroundColor: '#1677ff', cursor: 'pointer' }}
            >
              A
            </Avatar>
          </Dropdown>
        </div>
      )}

      {/* Mobile Sidebar Drawer - Only render on mobile */}
      {isMobile && (
        <Drawer
          title={
            <div className="drawer-title">
              HIDRIVE Admin
            </div>
          }
          placement="left"
          onClose={() => setIsSidebarOpen(false)}
          open={isSidebarOpen}
          width={280}
          className="admin-drawer"
          closeIcon={<CloseOutlined className="drawer-close-icon" />}
        >
          <AdminSidebar isMobile={true} onClose={() => setIsSidebarOpen(false)} />
        </Drawer>
      )}

      {/* Main Content */}
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

