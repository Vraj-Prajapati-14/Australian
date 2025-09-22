import { Typography, Row, Col } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import ProjectCard from '../components/ProjectCard';
import { Container, Button } from '../components/ui';

export default function ProjectsPage() {
  const { data: projects, isLoading } = useQuery({ queryKey: ['projects'], queryFn: async () => (await api.get('/projects')).data })
  if (isLoading) return <div>Loading...</div>
  return (
    <>
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

      {/* CTA Section - Using exact same structure as HomePage and AboutPage */}
      <section className="cta-section">
        <Container>
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Your Project?</h2>
            <p className="cta-subtitle">
              Contact us today for a free consultation and quote
            </p>
            <div className="cta-buttons">
              <Link to="/contact">
                <Button variant="primary" size="lg" className="cta-button-primary">
                  Contact Us
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg" className="cta-button-secondary">
                  View Services
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

