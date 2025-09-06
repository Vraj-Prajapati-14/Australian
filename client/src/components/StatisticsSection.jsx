import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { 
  TrophyOutlined, 
  TeamOutlined, 
  ToolOutlined, 
  CarOutlined,
  CheckCircleOutlined,
  UserOutlined,
  StarOutlined,
  BankOutlined
} from '@ant-design/icons';

const StatisticsSection = ({ 
  variant = 'default', 
  showAwards = true, 
  showTagline = true,
  className = '',
  customStats = null 
}) => {
  // Fetch site settings for dynamic data
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => api.get('/api/settings').then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch analytics stats
  const { data: analyticsStats, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analyticsStats'],
    queryFn: () => api.get('/api/analytics/stats').then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (settingsLoading || analyticsLoading) {
    return (
      <section className={`statistics-section loading ${className}`}>
        <div className="statistics-container">
          <div className="statistics-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="stat-card skeleton">
                <div className="stat-icon-skeleton"></div>
                <div className="stat-number-skeleton"></div>
                <div className="stat-label-skeleton"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Calculate years of experience dynamically
  const currentYear = new Date().getFullYear();
  const foundedYear = settings?.general?.founded ? parseInt(settings.general.founded) : 1993;
  const yearsExperience = currentYear - foundedYear;

  // Default stats with fallbacks
  const defaultStats = [
    {
      number: yearsExperience,
      label: 'YEARS EXPERIENCE',
      suffix: '',
      icon: <TrophyOutlined />
    },
    {
      number: settings?.general?.employees || '290',
      label: 'STAFF NATIONWIDE',
      suffix: '+',
      icon: <TeamOutlined />
    },
    {
      number: '190',
      label: 'ACCESSORIES AVAILABLE',
      suffix: '+',
      icon: <ToolOutlined />
    },
    {
      number: analyticsStats?.projectsCompleted || '24,000',
      label: 'UNIQUE BUILDS',
      suffix: '+',
      icon: <CarOutlined />
    }
  ];

  // Use custom stats if provided, otherwise use default
  const statsData = customStats || defaultStats;

  // Get awards and tagline from settings
  const awards = settings?.business?.awards || [];
  const tagline = settings?.general?.siteTagline || 'Professional Vehicle Solutions';

  return (
    <section className={`statistics-section ${variant} ${className}`}>
      <div className="statistics-container">
        {/* Tagline */}
        {showTagline && (
          <div className="statistics-tagline">
            <h2>{tagline}</h2>
          </div>
        )}

        {/* Statistics Grid */}
        <div className="statistics-grid">
          {statsData.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">
                {stat.icon}
              </div>
              <div className="stat-content">
                <span className="stat-number">
                  {typeof stat.number === 'number' ? stat.number.toLocaleString() : stat.number}
                  {stat.suffix}
                </span>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Awards Section */}
        {showAwards && awards.length > 0 && (
          <div className="awards-section">
            <h3>Awards & Recognition</h3>
            <div className="awards-grid">
              {awards.map((award, index) => (
                <div key={index} className="award-item">
                  <span className="award-icon">
                    <StarOutlined />
                  </span>
                  <span className="award-text">{award}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default StatisticsSection;
