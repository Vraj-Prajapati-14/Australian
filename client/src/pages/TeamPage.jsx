import { Typography, Row, Col, Card, Avatar } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export default function TeamPage() {
  const { data: team, isLoading } = useQuery({ queryKey: ['team'], queryFn: async () => (await api.get('/team')).data })
  if (isLoading) return <div>Loading...</div>
  return (
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
  )
}

