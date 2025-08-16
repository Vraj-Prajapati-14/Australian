const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: String,
  publicId: String,
  alt: String,
});

const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'Australian Engineering Solutions' },
    logo: imageSchema,
    hero: {
      title: String,
      subtitle: String,
      background: imageSchema,
      ctaText: String,
      ctaLink: String,
    },
    contact: {
      email: String,
      phone: String,
      address: String,
      mapEmbedUrl: String,
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

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
module.exports = SiteSettings;

