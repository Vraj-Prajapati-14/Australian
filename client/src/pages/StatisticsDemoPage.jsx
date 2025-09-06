import React from 'react';
import StatisticsSection from '../components/StatisticsSection';

const StatisticsDemoPage = () => {
  // Custom stats for demonstration
  const customStats = [
    {
      number: 32,
      label: 'YEARS EXPERIENCE',
      suffix: '',
      icon: '🏆'
    },
    {
      number: '290',
      label: 'STAFF NATIONWIDE',
      suffix: '+',
      icon: '👥'
    },
    {
      number: '190',
      label: 'ACCESSORIES AVAILABLE',
      suffix: '+',
      icon: '🔧'
    },
    {
      number: '24,000',
      label: 'UNIQUE BUILDS',
      suffix: '+',
      icon: '🚗'
    }
  ];

  const projectStats = [
    {
      number: 150,
      label: 'PROJECTS COMPLETED',
      suffix: '+',
      icon: '✅'
    },
    {
      number: 500,
      label: 'HAPPY CLIENTS',
      suffix: '+',
      icon: '😊'
    },
    {
      number: 25,
      label: 'TEAM MEMBERS',
      suffix: '',
      icon: '👥'
    },
    {
      number: 98,
      label: 'SATISFACTION RATE',
      suffix: '%',
      icon: '⭐'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ 
          textAlign: 'center', 
          fontSize: '2.5rem', 
          marginBottom: '60px',
          color: '#333'
        }}>
          Statistics Section Component Demo
        </h1>

        {/* Default Variant */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2rem', 
            marginBottom: '40px',
            color: '#333'
          }}>
            Default Variant (Full Features)
          </h2>
          <StatisticsSection 
            variant="default"
            showAwards={true}
            showTagline={true}
            customStats={customStats}
          />
        </div>

        {/* Compact Variant */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2rem', 
            marginBottom: '40px',
            color: '#333'
          }}>
            Compact Variant
          </h2>
          <StatisticsSection 
            variant="compact"
            showAwards={false}
            showTagline={false}
            customStats={projectStats}
          />
        </div>

        {/* Minimal Variant */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2rem', 
            marginBottom: '40px',
            color: '#333'
          }}>
            Minimal Variant
          </h2>
          <StatisticsSection 
            variant="minimal"
            showAwards={false}
            showTagline={false}
            customStats={customStats}
          />
        </div>

        {/* With Custom Styling */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2rem', 
            marginBottom: '40px',
            color: '#333'
          }}>
            With Custom Styling
          </h2>
          <StatisticsSection 
            variant="default"
            showAwards={true}
            showTagline={true}
            customStats={projectStats}
            className="custom-stats"
          />
        </div>

        {/* Usage Instructions */}
        <div style={{ 
          background: 'white', 
          padding: '40px', 
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '30px',
            color: '#333'
          }}>
            How to Use
          </h2>
          
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#555' }}>
              Basic Usage:
            </h3>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '20px', 
              borderRadius: '10px',
              overflow: 'auto',
              fontSize: '14px'
            }}>
{`import StatisticsSection from '../components/StatisticsSection';

<StatisticsSection />`}
            </pre>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#555' }}>
              With Custom Stats:
            </h3>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '20px', 
              borderRadius: '10px',
              overflow: 'auto',
              fontSize: '14px'
            }}>
{`const customStats = [
  {
    number: 32,
    label: 'YEARS EXPERIENCE',
    suffix: '',
    icon: '🏆'
  },
  // ... more stats
];

<StatisticsSection 
  variant="default"
  showAwards={true}
  showTagline={true}
  customStats={customStats}
/>`}
            </pre>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#555' }}>
              Available Props:
            </h3>
            <ul style={{ fontSize: '16px', lineHeight: '1.6', color: '#666' }}>
              <li><strong>variant:</strong> "default" | "compact" | "minimal"</li>
              <li><strong>showAwards:</strong> boolean (default: true)</li>
              <li><strong>showTagline:</strong> boolean (default: true)</li>
              <li><strong>className:</strong> string for additional CSS classes</li>
              <li><strong>customStats:</strong> array of stat objects with number, label, suffix, and icon</li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#555' }}>
              Features:
            </h3>
            <ul style={{ fontSize: '16px', lineHeight: '1.6', color: '#666' }}>
              <li>✅ Full-width responsive design</li>
              <li>✅ Dynamic data from database</li>
              <li>✅ Multiple variants (default, compact, minimal)</li>
              <li>✅ Awards section with database integration</li>
              <li>✅ Tagline display</li>
              <li>✅ Loading states with skeleton animation</li>
              <li>✅ Hover effects and animations</li>
              <li>✅ Mobile responsive</li>
              <li>✅ Reusable across all pages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDemoPage;
