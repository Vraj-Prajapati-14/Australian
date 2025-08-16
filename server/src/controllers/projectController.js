const Project = require('../models/Project');

async function list(req, res) {
  const projects = await Project.find({}).populate('servicesInvolved').sort({ createdAt: -1 });
  res.json(projects);
}

async function getBySlug(req, res) {
  const { slug } = req.params;
  const project = await Project.findOne({ slug }).populate('servicesInvolved');
  if (!project) return res.status(404).json({ message: 'Not found' });
  res.json(project);
}

async function create(req, res) {
  const project = await Project.create(req.body);
  res.status(201).json(project);
}

async function update(req, res) {
  const { id } = req.params;
  const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
  if (!project) return res.status(404).json({ message: 'Not found' });
  res.json(project);
}

async function remove(req, res) {
  const { id } = req.params;
  await Project.findByIdAndDelete(id);
  res.json({ success: true });
}

module.exports = { list, getBySlug, create, update, remove };

