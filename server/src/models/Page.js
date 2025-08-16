const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({ url: String, publicId: String, alt: String });

const pageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: String,
    content: String, // HTML
    hero: {
      title: String,
      subtitle: String,
      background: imageSchema,
    },
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

const Page = mongoose.model('Page', pageSchema);
module.exports = Page;

