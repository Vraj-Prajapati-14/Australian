# Australian Automotive Services - Design System

A comprehensive, reusable component system built with modern CSS and React components for consistent, professional web applications.

## 🎨 Design System Overview

This project implements a complete design system with:

- **CSS Custom Properties** - Consistent design tokens
- **Utility Classes** - Rapid development with utility-first approach
- **Component Library** - Reusable React components
- **Responsive Design** - Mobile-first responsive layouts
- **Accessibility** - WCAG compliant components
- **Performance** - Optimized CSS and component architecture

## 📁 File Structure

```
client/src/
├── styles/
│   ├── design-system.css    # Foundation styles and utilities
│   ├── components.css       # Component-specific styles
│   └── animations.css       # Animation library
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   ├── Alert.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Container.jsx
│   │   ├── Section.jsx
│   │   └── index.js
│   ├── Header.jsx          # Main navigation
│   └── Footer.jsx          # Site footer
└── layouts/
    └── PublicLayout.jsx    # Main layout wrapper
```

## 🎯 Core Components

### Button Component
```jsx
import { Button } from './components/ui';

<Button variant="primary" size="lg" loading={false}>
  Click Me
</Button>
```

**Variants:** `primary`, `secondary`, `accent`, `outline`, `ghost`
**Sizes:** `sm`, `md`, `lg`, `xl`

### Card Component
```jsx
import { Card } from './components/ui';

<Card variant="elevated">
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
  </Card.Header>
  <Card.Body>
    <Card.Text>Card content goes here</Card.Text>
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

**Variants:** `default`, `elevated`, `bordered`, `flat`

### Input Component
```jsx
import { Input } from './components/ui';

<Input
  label="Email"
  type="email"
  error="Invalid email"
  required
/>

<Input.Textarea
  label="Message"
  rows={4}
  required
/>

<Input.Select
  label="Country"
  options={[
    { value: 'au', label: 'Australia' },
    { value: 'us', label: 'United States' }
  ]}
/>
```

### Modal Component
```jsx
import { Modal } from './components/ui';

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Modal Title"
  size="lg"
>
  <p>Modal content</p>
  <Modal.Footer>
    <Button onClick={() => setIsModalOpen(false)}>Close</Button>
  </Modal.Footer>
</Modal>
```

### Section Component
```jsx
import { Section } from './components/ui';

<Section background="primary" padding="4xl">
  <Section.Header
    title="Section Title"
    subtitle="Section description"
    align="center"
  />
  <Section.Content>
    <p>Section content</p>
  </Section.Content>
</Section>
```

## 🎨 Design Tokens

### Colors
```css
/* Primary Colors */
--primary-50: #eff6ff;
--primary-500: #3b82f6;
--primary-600: #2563eb;
--primary-700: #1d4ed8;

/* Secondary Colors */
--secondary-50: #f8fafc;
--secondary-500: #64748b;
--secondary-600: #475569;

/* Accent Colors */
--accent-50: #ecfdf5;
--accent-500: #10b981;
--accent-600: #059669;
```

### Spacing
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Typography
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

## 🎭 Animations

### Fade Animations
```css
.animate-fadeIn
.animate-fadeOut
.animate-fadeInUp
.animate-fadeInDown
.animate-fadeInLeft
.animate-fadeInRight
```

### Slide Animations
```css
.animate-slideInUp
.animate-slideInDown
.animate-slideInLeft
.animate-slideInRight
```

### Scale Animations
```css
.animate-scaleIn
.animate-scaleOut
.animate-scaleInUp
.animate-scaleInDown
```

### Utility Classes
```css
.animate-duration-300
.animate-delay-200
.animate-ease-out
.animate-infinite
```

## 📱 Responsive Design

### Breakpoints
```css
/* Small devices */
@media (min-width: 640px) { /* sm: */ }

/* Medium devices */
@media (min-width: 768px) { /* md: */ }

/* Large devices */
@media (min-width: 1024px) { /* lg: */ }

/* Extra large devices */
@media (min-width: 1280px) { /* xl: */ }
```

### Responsive Utilities
```css
.sm:hidden
.md:flex
.lg:grid
.xl:text-2xl
```

## 🚀 Usage Examples

### Basic Page Structure
```jsx
import { Container, Section, Button, Card } from './components/ui';

const MyPage = () => {
  return (
    <>
      {/* Hero Section */}
      <Section background="primary" padding="4xl">
        <Container>
          <h1 className="text-4xl font-bold text-white">
            Welcome to Our Site
          </h1>
          <Button variant="secondary" size="lg">
            Get Started
          </Button>
        </Container>
      </Section>

      {/* Content Section */}
      <Section padding="4xl">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <Card.Body>
                <Card.Title>Feature 1</Card.Title>
                <Card.Text>Description here</Card.Text>
              </Card.Body>
            </Card>
            {/* More cards... */}
          </div>
        </Container>
      </Section>
    </>
  );
};
```

### Form Example
```jsx
import { Input, Button, Alert } from './components/ui';

const ContactForm = () => {
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState(null);

  return (
    <form onSubmit={handleSubmit}>
      {status === 'success' && (
        <Alert variant="success">
          Form submitted successfully!
        </Alert>
      )}
      
      <Input
        label="Name"
        name="name"
        required
      />
      
      <Input.Textarea
        label="Message"
        name="message"
        rows={4}
        required
      />
      
      <Button type="submit" variant="primary" fullWidth>
        Send Message
      </Button>
    </form>
  );
};
```

## 🎨 Customization

### Theme Colors
To customize the theme colors, modify the CSS custom properties in `design-system.css`:

```css
:root {
  --primary-500: #your-color;
  --secondary-500: #your-color;
  --accent-500: #your-color;
}
```

### Component Variants
Add new variants to components by extending the variant classes:

```css
.btn-custom {
  background: linear-gradient(135deg, #your-color 0%, #your-color-dark 100%);
  color: white;
}
```

## 🔧 Development

### Adding New Components
1. Create component file in `components/ui/`
2. Add PropTypes for type checking
3. Use design system classes
4. Export from `components/ui/index.js`
5. Add documentation here

### CSS Guidelines
- Use CSS custom properties for values
- Follow BEM methodology for component classes
- Use utility classes for common patterns
- Keep components modular and reusable

## 📚 Best Practices

1. **Consistency** - Always use design system components and tokens
2. **Accessibility** - Include proper ARIA labels and keyboard navigation
3. **Performance** - Use CSS custom properties for dynamic theming
4. **Responsive** - Design mobile-first with progressive enhancement
5. **Maintainability** - Keep components simple and composable

## 🎯 Benefits

- **Consistency** - Unified design language across the application
- **Efficiency** - Rapid development with reusable components
- **Maintainability** - Centralized design system easy to update
- **Accessibility** - Built-in accessibility features
- **Performance** - Optimized CSS and component architecture
- **Scalability** - Easy to extend and customize

This design system provides a solid foundation for building professional, consistent, and maintainable web applications.
