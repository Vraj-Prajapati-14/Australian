# StatisticsSection Component

A reusable, full-width statistics component that displays company metrics in an attractive, responsive layout. This component can be used across all pages of your application and automatically fetches data from your database.

## Features

- ✅ **Full-width responsive design** - No fixed card sizes, adapts to screen size
- ✅ **Dynamic data integration** - Fetches data from database automatically
- ✅ **Multiple variants** - Default, compact, and minimal styles
- ✅ **Awards section** - Displays company awards from database
- ✅ **Tagline support** - Shows company tagline
- ✅ **Loading states** - Skeleton animation while data loads
- ✅ **Hover effects** - Interactive animations
- ✅ **Mobile responsive** - Works perfectly on all devices
- ✅ **Reusable** - Use across all pages with different configurations

## Usage

### Basic Usage
```jsx
import StatisticsSection from '../components/StatisticsSection';

<StatisticsSection />
```

### With Custom Stats
```jsx
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

<StatisticsSection 
  variant="default"
  showAwards={true}
  showTagline={true}
  customStats={customStats}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `string` | `"default"` | Style variant: "default", "compact", "minimal" |
| `showAwards` | `boolean` | `true` | Whether to show awards section |
| `showTagline` | `boolean` | `true` | Whether to show company tagline |
| `className` | `string` | `""` | Additional CSS classes |
| `customStats` | `array` | `null` | Custom statistics array (overrides default) |

## Variants

### Default
- Full features with tagline and awards
- Purple gradient background
- Large cards with icons
- Best for main pages like About

### Compact
- Smaller padding and font sizes
- No tagline or awards
- Good for secondary pages
- Same purple gradient background

### Minimal
- White background with purple cards
- Clean, minimal design
- Good for content-heavy pages
- No tagline or awards

## Data Structure

The component automatically fetches data from:
- `/api/settings` - Site settings (company info, awards, tagline)
- `/api/analytics/stats` - Analytics statistics

### Custom Stats Format
```jsx
{
  number: 32,           // Number or string
  label: 'YEARS EXPERIENCE',  // Uppercase label
  suffix: '',           // Suffix like '+', '%', etc.
  icon: '🏆'            // Emoji or icon
}
```

## Database Integration

The component integrates with your existing database models:

### SiteSettings Model
- `general.founded` - Company founding year
- `general.employees` - Number of employees
- `general.siteTagline` - Company tagline
- `business.awards` - Array of company awards

### Analytics Stats
- `projectsCompleted` - Number of completed projects
- `happyClients` - Number of satisfied clients
- `yearsExperience` - Calculated from founding year

## Examples

### About Page
```jsx
<StatisticsSection 
  variant="default"
  showAwards={true}
  showTagline={true}
/>
```

### Home Page
```jsx
<StatisticsSection 
  variant="compact"
  showAwards={false}
  showTagline={false}
  customStats={[
    {
      number: general?.founded || '2020',
      label: 'YEARS ESTABLISHED',
      suffix: '',
      icon: '🏢'
    },
    // ... more stats
  ]}
/>
```

### Case Studies Page
```jsx
<StatisticsSection 
  variant="minimal"
  showAwards={false}
  showTagline={false}
  customStats={[
    {
      number: caseStudies.length,
      label: 'CASE STUDIES',
      suffix: '',
      icon: '🏆'
    },
    // ... more stats
  ]}
/>
```

## Styling

The component uses CSS modules with the following classes:
- `.statistics-section` - Main container
- `.statistics-grid` - Grid layout for cards
- `.stat-card` - Individual stat cards
- `.stat-number` - Large number display
- `.stat-label` - Label text
- `.stat-icon` - Icon display
- `.awards-section` - Awards display section

## Responsive Design

- **Desktop**: 4 cards in a row
- **Tablet**: 2-4 cards depending on screen size
- **Mobile**: Single column layout
- **Small mobile**: Compact padding and font sizes

## Animation

- Fade-in animation on load
- Staggered card animations
- Hover effects with transform and shadow
- Loading skeleton animation

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers
- IE11+ (with polyfills)

## Performance

- Optimized with React Query for caching
- Lazy loading of data
- Efficient re-renders
- Minimal bundle size impact

## Future Enhancements

- [ ] Custom gradient support
- [ ] Animated counters
- [ ] More icon options
- [ ] Custom animations
- [ ] Dark mode support
- [ ] Accessibility improvements
