import { Typography } from 'antd';

export default function Section({ title, subtitle, children, style }) {
  return (
    <section style={{ marginTop: 32, ...style }}>
      <Typography.Title level={2} style={{ marginBottom: 8 }}>{title}</Typography.Title>
      {subtitle && (
        <Typography.Paragraph style={{ color: '#5f6b7a', maxWidth: 900 }}>{subtitle}</Typography.Paragraph>
      )}
      <div style={{ marginTop: 16 }}>{children}</div>
    </section>
  )
}

