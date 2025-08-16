const Page = require('../models/Page');

async function list(req, res) {
  const pages = await Page.find({}).sort({ createdAt: -1 });
  res.json(pages);
}

async function getBySlug(req, res) {
  const page = await Page.findOne({ slug: req.params.slug });
  if (!page) return res.status(404).json({ message: 'Not found' });
  res.json(page);
}

async function create(req, res) {
  const page = await Page.create(req.body);
  res.status(201).json(page);
}

async function update(req, res) {
  const page = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!page) return res.status(404).json({ message: 'Not found' });
  res.json(page);
}

async function remove(req, res) {
  await Page.findByIdAndDelete(req.params.id);
  res.json({ success: true });
}

module.exports = { list, getBySlug, create, update, remove };

