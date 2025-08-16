import { Layout, Menu, Typography } from 'antd';
import { 
  DashboardOutlined,
  CarOutlined,
  ContainerOutlined,
  FileTextOutlined,
  PictureOutlined,
  TeamOutlined,
  SettingOutlined,
  BarChartOutlined,
  ProjectOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Sider } = Layout;
const { Title } = Typography;

export default function AdminSidebar() {
  const location = useLocation();

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Dashboard</Link>
    },
    {
      key: 'services',
      icon: <CarOutlined />,
      label: 'Services',
      children: [
        {
          key: '/admin/services',
          label: <Link to="/admin/services">Manage Services</Link>
        }
      ]
    },
    {
      key: 'content',
      icon: <FileTextOutlined />,
      label: 'Content',
      children: [
        {
          key: '/admin/projects',
          label: <Link to="/admin/projects">Projects</Link>
        },
        {
          key: '/admin/case-studies',
          label: <Link to="/admin/case-studies">Case Studies</Link>
        },
        {
          key: '/admin/inspiration',
          label: <Link to="/admin/inspiration">Inspiration Gallery</Link>
        }
      ]
    },
    {
      key: 'team',
      icon: <TeamOutlined />,
      label: <Link to="/admin/team">Team Management</Link>
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: <Link to="/admin/analytics">Analytics</Link>
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to="/admin/settings">Site Settings</Link>
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
    if (path.startsWith('/admin/analytics')) return '/admin/analytics';
    if (path.startsWith('/admin/settings')) return '/admin/settings';
    return '/admin';
  };

  return (
    <Sider
      width={250}
      style={{
        background: '#001529',
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000
      }}
      breakpoint="lg"
      collapsedWidth="0"
    >
      {/* Logo/Brand */}
      <div style={{ 
        padding: '24px 16px', 
        textAlign: 'center',
        borderBottom: '1px solid #1f1f1f'
      }}>
        <Title 
          level={4} 
          style={{ 
            color: 'white', 
            margin: 0,
            fontWeight: 'bold'
          }}
        >
          HIDRIVE Admin
        </Title>
      </div>

      {/* Navigation Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getActiveKey()]}
        defaultOpenKeys={['services', 'content']}
        items={menuItems}
        style={{
          borderRight: 0,
          marginTop: 16
        }}
      />
    </Sider>
  );
}