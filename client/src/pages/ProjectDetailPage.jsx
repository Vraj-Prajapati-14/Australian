import { Typography, Tag } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const { data: project, isLoading } = useQuery({ queryKey: ['project', slug], queryFn: async () => (await api.get(`/projects/${slug}`)).data })
  if (isLoading) return <div>Loading...</div>
  if (!project) return <div>Not found</div>
  return (
    <div>
      <Typography.Title>{project.title}</Typography.Title>
      <Typography.Paragraph>{project.description}</Typography.Paragraph>
      <div>{(project.tags || []).map((t) => <Tag key={t}>{t}</Tag>)}</div>
    </div>
  )
}

