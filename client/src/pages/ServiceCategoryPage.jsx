import { Typography, Row, Col } from 'antd';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import ServiceCard from '../components/ServiceCard';

export default function ServiceCategoryPage() {
  const { slug } = useParams()
  const { data: category } = useQuery({ queryKey: ['service-category', slug], queryFn: async () => (await api.get(`/service-categories/${slug}`)).data })
  const { data: services } = useQuery({ queryKey: ['services'], queryFn: async () => (await api.get('/services')).data })

  const filtered = (services || []).filter(s => s?.category?._id === category?._id)

  return (
    <div>
      <Typography.Title>{category?.name || 'Services'}</Typography.Title>
      {category?.description && (<Typography.Paragraph>{category.description}</Typography.Paragraph>)}
      <Row gutter={[16, 16]}>
        {filtered.map(s => (
          <Col key={s._id} xs={24} sm={12} md={8}>
            <Link to={`/services/${s.slug}`}>
              <ServiceCard service={s} />
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  )
}

