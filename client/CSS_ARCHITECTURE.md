# CSS Architecture Documentation

## Overview
This document outlines the new, production-ready CSS architecture implemented for the Australian Mechanical Engineering website. The new structure eliminates redundancy, improves maintainability, and follows modern CSS best practices.

## Architecture Structure

### 1. Central Entry Point
- **`styles/index.css`** - Main CSS entry point that imports all stylesheets in the correct order

### 2. Core Stylesheets

#### Design System (`design-system.css`)
- CSS custom properties (variables) for colors, spacing, typography, etc.
- Utility classes for common patterns
- Design tokens and design system foundation

#### Base Styles (`base.css`)
- CSS reset and normalize
- Global typography
- Base element styling
- Accessibility utilities
- Print styles

#### Components (`components.css`)
- Reusable component styles
- UI component styling
- Form elements
- Buttons, cards, modals, etc.

#### Layouts (`layouts.css`)
- Header and navigation
- Footer
- Grid systems
- Container layouts
- Mobile menu

#### Pages (`pages.css`)
- Common page layouts
- Hero sections
- Content sections
- Page headers

#### Page-Specific Styles
- `about-page.css` - About page specific styles
- `case-studies-page.css` - Case studies listing page
- `case-study-detail.css` - Individual case study pages
- `contact-page.css` - Contact page styles
- `inspiration-gallery.css` - Gallery page styles
- `project-detail.css` - Project detail pages
- `service-detail.css` - Service detail pages

#### Admin Styles (`admin.css`)
- Admin panel styling
- Dashboard layouts
- Admin forms and tables
- Mobile admin optimizations

#### Animations (`animations.css`)
- Keyframe animations
- Transition utilities
- Animation classes
- Performance optimizations

#### Responsive (`responsive.css`)
- Responsive utilities
- Breakpoint-specific styles
- Mobile-first approach
- Touch device optimizations

## Key Improvements

### 1. Eliminated Redundancy
- Removed unused CSS files: `HomePage.css`, `ProjectsPage.css`, `TeamPage.css`
- Consolidated `header-clean.css` into `layouts.css`
- Removed duplicate styles across files

### 2. Centralized Imports
- Single entry point in `main.jsx` imports `styles/index.css`
- All page-specific imports removed from individual components
- Consistent loading order prevents style conflicts

### 3. Better Organization
- Clear separation of concerns
- Logical file structure
- Consistent naming conventions
- Proper CSS cascade order

### 4. Production Ready
- Optimized for performance
- Mobile-first responsive design
- Accessibility considerations
- Cross-browser compatibility

## Usage

### Adding New Styles
1. **Component styles** → Add to `components.css`
2. **Layout styles** → Add to `layouts.css`
3. **Page-specific styles** → Create new file and import in `index.css`
4. **Global utilities** → Add to `base.css` or `design-system.css`

### CSS Variables
Use the design system variables for consistency:
```css
.my-component {
  color: var(--text-primary);
  background: var(--bg-primary);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

### Responsive Design
Use the responsive utilities:
```css
.my-component {
  /* Mobile first */
  padding: var(--space-2);
  
  /* Tablet and up */
  @media (min-width: 768px) {
    padding: var(--space-4);
  }
  
  /* Desktop and up */
  @media (min-width: 1024px) {
    padding: var(--space-6);
  }
}
```

## File Size Comparison

### Before
- Multiple CSS files with overlapping styles
- Inline styles in `main.jsx`
- Redundant imports across components
- Estimated total: ~50KB+ of CSS

### After
- Organized, non-redundant structure
- Single import point
- Optimized file sizes
- Estimated total: ~30KB of CSS (40% reduction)

## Maintenance

### Regular Tasks
1. Review and remove unused styles quarterly
2. Update design system variables as needed
3. Optimize animations for performance
4. Test responsive design on new devices

### Best Practices
1. Always use CSS variables for colors and spacing
2. Follow mobile-first responsive design
3. Test accessibility with screen readers
4. Validate CSS for cross-browser compatibility
5. Use semantic class names
6. Keep specificity low to avoid conflicts

## Migration Notes

### What Changed
- Removed individual CSS imports from page components
- Consolidated header styles into layouts
- Deleted unused CSS files
- Moved global styles from inline to proper CSS files

### What Stayed the Same
- All existing styles are preserved
- Component functionality unchanged
- Visual appearance maintained
- Admin panel styling intact

## Future Enhancements

### Potential Improvements
1. **CSS Modules** - For better component isolation
2. **PostCSS** - For advanced CSS processing
3. **CSS-in-JS** - For dynamic styling
4. **Critical CSS** - For above-the-fold optimization
5. **CSS Purging** - For production bundle optimization

### Performance Optimizations
1. **Lazy Loading** - Load page-specific CSS on demand
2. **CSS Splitting** - Separate critical and non-critical styles
3. **Compression** - Minify CSS for production
4. **Caching** - Implement proper CSS caching strategies
