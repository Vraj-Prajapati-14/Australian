import { Card, Tag } from 'antd';

export default function ServiceCard({ service }) {
  const img = service?.heroImage?.url
  return (
    <Card
      hoverable
      title={service.title}
      cover={img ? <img src={img} alt={service.title} style={{ height: 160, objectFit: 'cover' }} /> : null}
    >
      <div style={{ minHeight: 48 }}>{service.summary}</div>
      <div style={{ marginTop: 8 }}>{(service.tags || []).slice(0, 3).map((t) => <Tag key={t}>{t}</Tag>)}</div>
    </Card>
  )
}

