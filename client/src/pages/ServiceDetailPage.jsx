import { Typography } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';

export default function ServiceDetailPage() {
  const { slug } = useParams()
  const { data: service, isLoading } = useQuery({ queryKey: ['service', slug], queryFn: async () => (await api.get(`/services/${slug}`)).data })
  if (isLoading) return <div>Loading...</div>
  if (!service) return <div>Not found</div>
  return (
    <div>
      <Typography.Title>{service.title}</Typography.Title>
      <Typography.Paragraph>{service.summary}</Typography.Paragraph>
      {service.content && <div dangerouslySetInnerHTML={{ __html: service.content }} />}
    </div>
  )
}

