const Service = require('../models/Service');

async function list(req, res) {
  try {
    const { type, category, featured } = req.query;
    let query = { status: 'active' };

    if (type === 'main') {
      query.isMainService = true;
    } else if (type === 'sub') {
      query.isMainService = false;
      query.parentService = { $exists: true, $ne: null };
    }

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    const services = await Service.find(query)
      .populate('category')
      .populate('parentService', 'title slug')
      .populate('subServices', 'title slug shortDescription heroImage')
      .sort({ order: 1, createdAt: -1 });

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
}

async function getMainServices(req, res) {
  try {
    const services = await Service.find({ 
      isMainService: true, 
      status: 'active' 
    })
    .populate('subServices', 'title slug shortDescription heroImage status')
    .sort({ order: 1 });

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching main services', error: error.message });
  }
}

async function getSubServices(req, res) {
  try {
    const { parentId } = req.params;
    const subServices = await Service.find({ 
      parentService: parentId, 
      status: 'active' 
    })
    .populate('parentService', 'title slug')
    .sort({ order: 1 });

    res.json(subServices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sub services', error: error.message });
  }
}

async function getBySlug(req, res) {
  try {
    const { slug } = req.params;
    const service = await Service.findOne({ slug, status: 'active' })
      .populate('category')
      .populate('parentService', 'title slug')
      .populate('subServices', 'title slug shortDescription heroImage status');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
}

async function create(req, res) {
  try {
    const service = await Service.create(req.body);
    
    // If this is a sub-service, update the parent service's subServices array
    if (service.parentService) {
      await Service.findByIdAndUpdate(
        service.parentService,
        { $push: { subServices: service._id } }
      );
    }

    const populatedService = await Service.findById(service._id)
      .populate('category')
      .populate('parentService', 'title slug')
      .populate('subServices', 'title slug shortDescription heroImage');

    res.status(201).json(populatedService);
  } catch (error) {
    res.status(500).json({ message: 'Error creating service', error: error.message });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const oldService = await Service.findById(id);
    
    if (!oldService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const service = await Service.findByIdAndUpdate(id, req.body, { new: true })
      .populate('category')
      .populate('parentService', 'title slug')
      .populate('subServices', 'title slug shortDescription heroImage');

    // Handle parent service changes
    if (oldService.parentService && oldService.parentService.toString() !== req.body.parentService) {
      // Remove from old parent
      await Service.findByIdAndUpdate(
        oldService.parentService,
        { $pull: { subServices: service._id } }
      );
    }

    if (req.body.parentService && (!oldService.parentService || oldService.parentService.toString() !== req.body.parentService)) {
      // Add to new parent
      await Service.findByIdAndUpdate(
        req.body.parentService,
        { $push: { subServices: service._id } }
      );
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error updating service', error: error.message });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Remove from parent service if it's a sub-service
    if (service.parentService) {
      await Service.findByIdAndUpdate(
        service.parentService,
        { $pull: { subServices: service._id } }
      );
    }

    // Delete all sub-services if it's a main service
    if (service.isMainService) {
      await Service.deleteMany({ parentService: service._id });
    }

    await Service.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
}

async function getFeatured(req, res) {
  try {
    const services = await Service.find({ 
      isFeatured: true, 
      status: 'active' 
    })
    .populate('category')
    .populate('parentService', 'title slug')
    .sort({ order: 1 })
    .limit(6);

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured services', error: error.message });
  }
}

module.exports = { 
  list, 
  getMainServices, 
  getSubServices, 
  getBySlug, 
  create, 
  update, 
  remove, 
  getFeatured 
};

