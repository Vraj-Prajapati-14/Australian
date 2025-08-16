const TeamMember = require('../models/TeamMember');

async function list(req, res) {
  const members = await TeamMember.find({}).sort({ order: 1, createdAt: -1 });
  res.json(members);
}

async function create(req, res) {
  const member = await TeamMember.create(req.body);
  res.status(201).json(member);
}

async function update(req, res) {
  const { id } = req.params;
  const member = await TeamMember.findByIdAndUpdate(id, req.body, { new: true });
  if (!member) return res.status(404).json({ message: 'Not found' });
  res.json(member);
}

async function remove(req, res) {
  const { id } = req.params;
  await TeamMember.findByIdAndDelete(id);
  res.json({ success: true });
}

module.exports = { list, create, update, remove };

