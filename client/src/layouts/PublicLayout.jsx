import { Layout, Menu } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import HeaderBar from '../components/Header';
import FooterBar from '../components/Footer';
import AnalyticsTracker from '../components/AnalyticsTracker';

const items = [
  { key: '/', label: <Link to="/">Home</Link> },
  { key: '/services', label: <Link to="/services">Services</Link> },
  { key: '/projects', label: <Link to="/projects">Projects</Link> },
  { key: '/team', label: <Link to="/team">Team</Link> },
  { key: '/contact', label: <Link to="/contact">Contact</Link> },
]

export default function PublicLayout() {
  const location = useLocation()
  const activeKey = items.find((i) => location.pathname === '/' ? i.key === '/' : location.pathname.startsWith(i.key))?.key || '/'
  const isHomePage = location.pathname === '/'

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Analytics Tracker - Track all public visitors */}
      <AnalyticsTracker 
        page={location.pathname}
        customData={{ 
          userType: 'public',
          pageType: 'public_page'
        }}
      />
      
      <HeaderBar />
      <Layout.Content style={{ background: '#f5f7fb', width: '100%' }}>
        {isHomePage ? (
          <Outlet />
        ) : (
          <div className="container" style={{ padding: '32px 16px' }}>
            <Outlet />
          </div>
        )}
      </Layout.Content>
      <FooterBar />
    </Layout>
  )
}

