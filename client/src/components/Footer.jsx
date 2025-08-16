import { Layout } from 'antd';

export default function FooterBar() {
  return (
    <Layout.Footer style={{ textAlign: 'center', background: '#0b1a27', color: '#b9c6d4' }}>
      <div className="container" style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div>© {new Date().getFullYear()} {import.meta.env.VITE_SITE_NAME}</div>
        <div style={{ opacity: 0.8 }}>Quality • Safety • Reliability</div>
      </div>
    </Layout.Footer>
  )
}

