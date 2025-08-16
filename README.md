# HIDRIVE-Style Service Body Website

A professional, responsive website for service body and canopy business, inspired by the Hidrive website design. Features dynamic nested services, admin management, and modern responsive design.

## 🚀 Features

### Frontend Features
- **Responsive Design**: Works perfectly on all devices (desktop, tablet, mobile)
- **Dynamic Navigation**: Dropdown menus with nested services
- **Professional Hero Section**: Similar to Hidrive with stats and CTAs
- **Service Showcase**: Vehicle type cards with hover effects
- **Why Choose Section**: Highlighting key benefits
- **Stats Section**: Company statistics with animations
- **Featured Services**: Dynamic service cards
- **Case Studies**: Success stories section
- **Process Section**: Step-by-step process visualization

### Admin Features
- **Nested Services Management**: Create main services and sub-services
- **Dynamic Navigation**: Admin can add/edit services and they automatically appear in navigation
- **Service Categories**: Organize services by vehicle type
- **Rich Service Data**: Images, descriptions, features, specifications, pricing
- **Status Management**: Active/inactive/draft status for services
- **Featured Services**: Mark services as featured for homepage display
- **Order Management**: Control display order of services

### Technical Features
- **Modern Stack**: React + Ant Design + Node.js + MongoDB
- **Real-time Updates**: Services update immediately in navigation
- **Image Management**: Cloudinary integration for image storage
- **SEO Optimized**: Meta tags, structured data, clean URLs
- **Performance**: Optimized loading and caching
- **Accessibility**: WCAG compliant design

## 🏗️ Architecture

### Frontend Structure
```
client/src/
├── components/          # Reusable components
│   ├── Header.jsx      # Dynamic navigation with dropdowns
│   ├── Hero.jsx        # Professional hero section
│   ├── Section.jsx     # Content sections
│   └── ...
├── pages/              # Page components
│   ├── HomePage.jsx    # Main homepage
│   ├── admin/          # Admin pages
│   └── ...
└── layouts/            # Layout components
```

### Backend Structure
```
server/src/
├── models/             # Database models
│   ├── Service.js      # Enhanced service model with nested support
│   └── ...
├── controllers/        # API controllers
│   ├── serviceController.js  # Nested service management
│   └── ...
├── routes/             # API routes
└── seed/               # Database seeding
    ├── services.js     # Initial service data
    └── admin.js        # Admin seeding
```

## 🎨 Design Features

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: 480px, 768px, 1200px
- **Flexible Layout**: Grid system that adapts to screen size
- **Touch Friendly**: Large buttons and touch targets

### Professional Styling
- **Modern Typography**: Inter font family
- **Color Scheme**: Professional blue theme (#1677ff)
- **Hover Effects**: Smooth animations and transitions
- **Card Design**: Clean, modern card layouts
- **Button Styling**: Professional CTA buttons

### Navigation
- **Dynamic Dropdowns**: Services expand to show sub-services
- **Mobile Drawer**: Slide-out menu for mobile devices
- **Active States**: Clear indication of current page
- **Smooth Transitions**: Animated menu interactions

## 📱 Responsive Features

### Desktop (1200px+)
- Full navigation with dropdowns
- Multi-column layouts
- Hover effects and animations
- Large hero section

### Tablet (768px - 1199px)
- Condensed navigation
- Responsive grid layouts
- Touch-optimized interactions
- Medium hero section

### Mobile (480px - 767px)
- Drawer navigation
- Single column layouts
- Touch-friendly buttons
- Compact hero section

### Small Mobile (< 480px)
- Minimal navigation
- Stacked layouts
- Large touch targets
- Optimized typography

## 🔧 Installation

### Prerequisites
- Node.js 16+
- MongoDB
- Cloudinary account (for images)

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
3. Set up environment variables:
   ```bash
   # .env
   MONGO_URI=your_mongodb_uri
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=secure_password
   ```
4. Start the development servers:
   ```bash
   # Terminal 1
   cd server && npm run dev
   
   # Terminal 2
   cd client && npm run dev
   ```

## 🗄️ Database Schema

### Service Model
```javascript
{
  title: String,           // Service title
  slug: String,           // URL slug
  shortDescription: String, // Brief description
  summary: String,        // Full description
  isMainService: Boolean, // Main service or sub-service
  parentService: ObjectId, // Parent service (for sub-services)
  subServices: [ObjectId], // Child services (for main services)
  category: ObjectId,     // Service category
  heroImage: {            // Hero image
    url: String,
    publicId: String,
    alt: String
  },
  features: [String],     // Feature list
  specifications: {       // Technical specs
    material: String,
    weight: String,
    installation: String,
    warranty: String
  },
  pricing: {              // Pricing information
    base: Number,
    currency: String,
    includes: [String]
  },
  isFeatured: Boolean,    // Featured on homepage
  status: String,         // active/inactive/draft
  order: Number          // Display order
}
```

## 🎯 Usage

### Adding Services
1. Login to admin panel
2. Go to Services Management
3. Click "Add Main Service" or "Add Sub-Service"
4. Fill in service details
5. Save - service appears in navigation automatically

### Managing Navigation
- Services automatically appear in navigation based on status
- Main services show dropdown with sub-services
- Order can be controlled via admin panel
- Featured services appear on homepage

### Responsive Testing
- Test on different screen sizes
- Check mobile navigation
- Verify touch interactions
- Test loading performance

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy dist folder
```

### Backend (Railway/Render)
```bash
cd server
npm start
# Deploy with environment variables
```

## 📈 Performance

### Optimizations
- Image optimization with Cloudinary
- Lazy loading for images
- Code splitting
- Caching strategies
- Database indexing

### Monitoring
- Page load times
- API response times
- Database query performance
- User interaction metrics

## 🔒 Security

### Features
- Admin authentication
- API route protection
- Input validation
- XSS protection
- CSRF protection

### Best Practices
- Environment variables for secrets
- Input sanitization
- Rate limiting
- Secure headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by the Hidrive website design
- Built with modern web technologies
- Responsive design best practices
- Accessibility guidelines compliance 