import { Typography, Row, Col, Card, Avatar } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Container, Button } from '../components/ui';

export default function TeamPage() {
  const { data: team, isLoading } = useQuery({ queryKey: ['team'], queryFn: async () => (await api.get('/team')).data })
  if (isLoading) return <div>Loading...</div>
  return (
    <>
      <div>
        <Typography.Title>Team</Typography.Title>
        <Row gutter={[16, 16]}>
          {(team || []).map((m) => (
            <Col key={m._id} xs={24} sm={12} md={8}>
              <Card hoverable>
                <div style={{ display: 'flex', gap: 16 }}>
                  <Avatar size={64} src={m?.photo?.url}>
                    {m.name?.[0]}
                  </Avatar>
                  <div>
                    <Typography.Title level={4} style={{ margin: 0 }}>{m.name}</Typography.Title>
                    <Typography.Text type="secondary">{m.role}</Typography.Text>
                    <Typography.Paragraph style={{ marginTop: 8 }}>{m.bio}</Typography.Paragraph>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* CTA Section - Using exact same structure as HomePage and AboutPage */}
      <section className="cta-section">
        <Container>
          <div className="cta-content">
            <h2 className="cta-title">Ready to Work With Our Team?</h2>
            <p className="cta-subtitle">
              Contact us today for a free consultation and quote
            </p>
            <div className="cta-buttons">
              <Link to="/contact">
                <Button variant="primary" size="lg" className="cta-button-primary">
                  Contact Us
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="cta-button-secondary">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

