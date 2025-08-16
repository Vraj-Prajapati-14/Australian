import { Typography, Row, Col } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import ProjectCard from '../components/ProjectCard';

export default function ProjectsPage() {
  const { data: projects, isLoading } = useQuery({ queryKey: ['projects'], queryFn: async () => (await api.get('/projects')).data })
  if (isLoading) return <div>Loading...</div>
  return (
    <div>
      <Typography.Title>Projects</Typography.Title>
      <Row gutter={[16, 16]}>
        {(projects || []).map((p) => (
          <Col key={p._id} xs={24} sm={12} md={8}>
            <Link to={`/projects/${p.slug}`}>
              <ProjectCard project={p} />
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  )
}

