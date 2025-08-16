const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({ url: String, publicId: String, alt: String });

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: String,
    content: String,
    coverImage: imageSchema,
    tags: [String],
    published: { type: Boolean, default: false },
    publishedAt: Date,
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;

