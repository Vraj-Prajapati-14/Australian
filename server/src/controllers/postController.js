const Post = require('../models/Post');

async function list(req, res) {
  const posts = await Post.find({ published: true }).sort({ publishedAt: -1, createdAt: -1 });
  res.json(posts);
}

async function adminList(req, res) {
  const posts = await Post.find({}).sort({ createdAt: -1 });
  res.json(posts);
}

async function getBySlug(req, res) {
  const post = await Post.findOne({ slug: req.params.slug, published: true });
  if (!post) return res.status(404).json({ message: 'Not found' });
  res.json(post);
}

async function create(req, res) {
  const post = await Post.create(req.body);
  res.status(201).json(post);
}

async function update(req, res) {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!post) return res.status(404).json({ message: 'Not found' });
  res.json(post);
}

async function remove(req, res) {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ success: true });
}

module.exports = { list, adminList, getBySlug, create, update, remove };

