const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: String,
  publicId: String,
  alt: String,
});

const pageSettingsSchema = new mongoose.Schema({
  title: String,
  description: String,
  keywords: String,
  ogImage: imageSchema,
  customCSS: String,
  customJS: String,
  isActive: { type: Boolean, default: true }
});

const siteSettingsSchema = new mongoose.Schema(
  {
    // General Site Information
    general: {
      siteName: { type: String, default: 'Australian Engineering Solutions' },
      siteTagline: { type: String, default: 'Professional Vehicle Solutions' },
      siteDescription: { type: String, default: 'Leading provider of vehicle modifications and engineering solutions' },
      companyName: { type: String, default: 'Australian Engineering Solutions' },
      founded: { type: String, default: '2010' },
      industry: { type: String, default: 'Automotive & Manufacturing' },
      employees: { type: String, default: '50+' },
      website: { type: String, default: 'https://australianengineering.com.au' },
      timezone: { type: String, default: 'Australia/Sydney' },
      currency: { type: String, default: 'AUD' },
      language: { type: String, default: 'en' },
      maintenanceMode: { type: Boolean, default: false },
      maintenanceMessage: { type: String, default: 'Site is under maintenance. Please check back soon.' }
    },

    // Contact Information
    contact: {
      address: { type: String, default: '123 Engineering Street, Sydney NSW 2000' },
      phone: { type: String, default: '+61 2 1234 5678' },
      mobile: { type: String, default: '+61 400 123 456' },
      email: { type: String, default: 'info@australianengineering.com.au' },
      supportEmail: { type: String, default: 'support@australianengineering.com.au' },
      salesEmail: { type: String, default: 'sales@australianengineering.com.au' },
      businessHours: { type: String, default: 'Monday - Friday: 8:00 AM - 6:00 PM' },
      emergencyContact: { type: String, default: '+61 400 999 888' },
      mapEmbedUrl: { type: String, default: '' },
      latitude: { type: Number, default: -33.8688 },
      longitude: { type: Number, default: 151.2093 }
    },

    // Social Media
    social: {
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      tiktok: { type: String, default: '' },
      pinterest: { type: String, default: '' },
      snapchat: { type: String, default: '' }
    },

    // SEO & Analytics
    seo: {
      metaTitle: { type: String, default: 'Australian Engineering Solutions - Professional Vehicle Solutions' },
      metaDescription: { type: String, default: 'Leading provider of vehicle modifications, engineering solutions, and professional services across Australia.' },
      metaKeywords: { type: String, default: 'vehicle modifications, engineering solutions, automotive, manufacturing, Australia' },
      googleAnalytics: { type: String, default: '' },
      googleTagManager: { type: String, default: '' },
      facebookPixel: { type: String, default: '' },
      structuredData: { type: Boolean, default: true },
      sitemapEnabled: { type: Boolean, default: true },
      robotsTxt: { type: String, default: 'User-agent: *\nAllow: /' },
      canonicalUrl: { type: String, default: '' }
    },

    // Appearance & Branding
    appearance: {
      primaryColor: { type: String, default: '#1677ff' },
      secondaryColor: { type: String, default: '#52c41a' },
      accentColor: { type: String, default: '#fa8c16' },
      textColor: { type: String, default: '#1a1a1a' },
      backgroundColor: { type: String, default: '#ffffff' },
      logo: imageSchema,
      favicon: imageSchema,
      heroImage: imageSchema,
      headerStyle: { type: String, default: 'modern', enum: ['modern', 'classic', 'minimal'] },
      footerStyle: { type: String, default: 'comprehensive', enum: ['comprehensive', 'simple', 'minimal'] },
      fontFamily: { type: String, default: 'Inter, sans-serif' },
      fontSize: { type: String, default: '14px' },
      borderRadius: { type: String, default: '8px' },
      boxShadow: { type: String, default: '0 2px 8px rgba(0,0,0,0.1)' }
    },

    // Page-specific Settings
    pages: {
      home: pageSettingsSchema,
      about: pageSettingsSchema,
      services: pageSettingsSchema,
      projects: pageSettingsSchema,
      caseStudies: pageSettingsSchema,
      team: pageSettingsSchema,
      contact: pageSettingsSchema,
      inspiration: pageSettingsSchema,
      blog: pageSettingsSchema,
      privacy: pageSettingsSchema,
      terms: pageSettingsSchema
    },

    // Business Information
    business: {
      abn: { type: String, default: '' },
      acn: { type: String, default: '' },
      gstNumber: { type: String, default: '' },
      insuranceProvider: { type: String, default: '' },
      insurancePolicy: { type: String, default: '' },
      certifications: [{ type: String }],
      awards: [{ type: String }],
      partnerships: [{ type: String }],
      serviceAreas: [{ type: String }],
      specialties: [{ type: String }]
    },

    // Content Settings
    content: {
      blogEnabled: { type: Boolean, default: true },
      testimonialsEnabled: { type: Boolean, default: true },
      galleryEnabled: { type: Boolean, default: true },
      newsletterEnabled: { type: Boolean, default: true },
      chatEnabled: { type: Boolean, default: true },
      chatWidget: { type: String, default: '' },
      defaultLanguage: { type: String, default: 'en' },
      supportedLanguages: [{ type: String, default: ['en'] }]
    },

    // Integration Settings
    integrations: {
      googleMapsApiKey: { type: String, default: '' },
      recaptchaSiteKey: { type: String, default: '' },
      recaptchaSecretKey: { type: String, default: '' },
      mailchimpApiKey: { type: String, default: '' },
      mailchimpListId: { type: String, default: '' },
      stripePublicKey: { type: String, default: '' },
      stripeSecretKey: { type: String, default: '' },
      paypalClientId: { type: String, default: '' },
      paypalSecret: { type: String, default: '' }
    },

    // Security Settings
    security: {
      enableSSL: { type: Boolean, default: true },
      enableHSTS: { type: Boolean, default: true },
      enableCSP: { type: Boolean, default: true },
      enableXSSProtection: { type: Boolean, default: true },
      enableCSRFProtection: { type: Boolean, default: true },
      sessionTimeout: { type: Number, default: 3600 },
      maxLoginAttempts: { type: Number, default: 5 },
      passwordMinLength: { type: Number, default: 8 }
    },

    // Performance Settings
    performance: {
      enableCaching: { type: Boolean, default: true },
      enableCompression: { type: Boolean, default: true },
      enableMinification: { type: Boolean, default: true },
      enableCDN: { type: Boolean, default: false },
      cdnUrl: { type: String, default: '' },
      imageOptimization: { type: Boolean, default: true },
      lazyLoading: { type: Boolean, default: true }
    },

    // Notification Settings
    notifications: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      pushNotifications: { type: Boolean, default: false },
      contactFormEmail: { type: String, default: 'info@australianengineering.com.au' },
      newOrderEmail: { type: String, default: 'orders@australianengineering.com.au' },
      supportEmail: { type: String, default: 'support@australianengineering.com.au' }
    },

    // Legacy fields for backward compatibility
    siteName: { type: String, default: 'Australian Engineering Solutions' },
    logo: imageSchema,
    hero: {
      title: String,
      subtitle: String,
      background: imageSchema,
      ctaText: String,
      ctaLink: String,
    },
    featuredServices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    featuredProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    seoDefaults: {
      title: String,
      description: String,
    },
  },
  { timestamps: true }
);

// Add indexes for better performance
siteSettingsSchema.index({ 'general.siteName': 1 });
siteSettingsSchema.index({ 'contact.email': 1 });
siteSettingsSchema.index({ 'seo.metaTitle': 1 });

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
module.exports = SiteSettings;

