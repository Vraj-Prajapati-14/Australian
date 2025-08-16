const SiteSettings = require('../models/SiteSettings');

async function get(req, res) {
  const settings = await SiteSettings.findOne({});
  res.json(settings || {});
}

async function upsert(req, res) {
  const updated = await SiteSettings.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });
  res.json(updated);
}

module.exports = { get, upsert };

