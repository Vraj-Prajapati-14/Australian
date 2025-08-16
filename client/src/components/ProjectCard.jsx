import { Card, Tag } from 'antd';

export default function ProjectCard({ project }) {
  const img = project?.coverImage?.url
  return (
    <Card
      hoverable
      title={project.title}
      cover={img ? <img src={img} alt={project.title} style={{ height: 160, objectFit: 'cover' }} /> : null}
    >
      <div style={{ minHeight: 48 }}>{project.description?.slice(0, 120)}</div>
      <div style={{ marginTop: 8 }}>{(project.tags || []).slice(0, 5).map((t) => <Tag key={t}>{t}</Tag>)}</div>
    </Card>
  )
}

