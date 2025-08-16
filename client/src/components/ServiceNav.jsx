import { Menu } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import { serviceCategoriesApi } from '../lib/api';

function buildItems(nodes) {
  return (nodes || []).map((n) => ({
    key: `/services/category/${n.slug}`,
    label: <Link to={`/services/category/${n.slug}`}>{n.name}</Link>,
    children: buildItems(n.children),
  }))
}

export default function ServiceNav() {
  const { data: tree } = useQuery({ queryKey: ['service-categories', 'tree'], queryFn: serviceCategoriesApi.tree })
  const location = useLocation()
  return (
    <Menu
      mode="inline"
      items={buildItems(tree)}
      selectedKeys={[location.pathname]}
      style={{ background: 'transparent' }}
    />
  )
}

