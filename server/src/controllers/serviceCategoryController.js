const ServiceCategory = require('../models/ServiceCategory');

async function tree(req, res) {
  const categories = await ServiceCategory.find({}).sort({ order: 1, name: 1 }).lean();
  const idToNode = new Map(categories.map((c) => [String(c._id), { ...c, children: [] }]));
  const roots = [];
  for (const cat of idToNode.values()) {
    if (cat.parent) {
      const parent = idToNode.get(String(cat.parent));
      if (parent) parent.children.push(cat);
      else roots.push(cat);
    } else roots.push(cat);
  }
  res.json(roots);
}

async function list(req, res) {
  const categories = await ServiceCategory.find({}).sort({ order: 1, name: 1 });
  res.json(categories);
}

async function getBySlug(req, res) {
  const cat = await ServiceCategory.findOne({ slug: req.params.slug });
  if (!cat) return res.status(404).json({ message: 'Not found' });
  res.json(cat);
}

async function create(req, res) {
  const cat = await ServiceCategory.create(req.body);
  res.status(201).json(cat);
}

async function update(req, res) {
  const cat = await ServiceCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!cat) return res.status(404).json({ message: 'Not found' });
  res.json(cat);
}

async function remove(req, res) {
  await ServiceCategory.findByIdAndDelete(req.params.id);
  res.json({ success: true });
}

module.exports = { tree, list, getBySlug, create, update, remove };

