const TeamMember = require('../models/TeamMember');

async function list(req, res) {
  try {
    const { department, leadership, status, featured } = req.query;
    let query = {};

    if (department) {
      query.department = department;
    }

    if (leadership === 'true') {
      query.isLeadership = true;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Only filter by status if explicitly provided
    if (status) {
      query.status = status;
    }

    const teamMembers = await TeamMember.find(query)
      .populate('department', 'name color')
      .sort({ order: 1, name: 1 });

    // Return raw array to keep AdminTeamPage working as before
    res.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ message: 'Error fetching team members' });
  }
}

async function getByDepartment(req, res) {
  try {
    const { department } = req.params;
    const teamMembers = await TeamMember.find({ 
      department, 
      status: 'active' 
    })
    .populate('department', 'name color')
    .sort({ order: 1, name: 1 });

    res.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members by department:', error);
    res.status(500).json({ message: 'Error fetching team members' });
  }
}

async function getLeadership(req, res) {
  try {
    const leadership = await TeamMember.find({ 
      isLeadership: true, 
      status: 'active' 
    })
    .populate('department', 'name color')
    .sort({ order: 1, name: 1 });

    res.json(leadership);
  } catch (error) {
    console.error('Error fetching leadership team:', error);
    res.status(500).json({ message: 'Error fetching leadership team' });
  }
}

async function getBySlug(req, res) {
  try {
    const { slug } = req.params;
    const teamMember = await TeamMember.findOne({ 
      slug, 
      status: 'active' 
    })
    .populate('department', 'name color');

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.json(teamMember);
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({ message: 'Error fetching team member' });
  }
}

async function create(req, res) {
  try {
    // Generate a unique slug if not provided
    let slug = req.body.slug;
    if (!slug && req.body.name) {
      slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Check if slug already exists and make it unique
      let counter = 1;
      let uniqueSlug = slug;
      while (await TeamMember.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }
      slug = uniqueSlug;
    }

    const teamMemberData = {
      ...req.body,
      slug: slug
    };

    const teamMember = await TeamMember.create(teamMemberData);
    const populatedTeamMember = await TeamMember.findById(teamMember._id)
      .populate('department', 'name color');
    
    res.status(201).json({ data: populatedTeamMember });
  } catch (error) {
    console.error('Error creating team member:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'A team member with this name or slug already exists' });
    } else {
      res.status(500).json({ message: 'Error creating team member' });
    }
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    
    // Generate a unique slug if name is being updated and no slug provided
    let slug = req.body.slug;
    if (req.body.name && !slug) {
      slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Check if slug already exists (excluding current team member)
      let counter = 1;
      let uniqueSlug = slug;
      while (await TeamMember.findOne({ slug: uniqueSlug, _id: { $ne: id } })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }
      slug = uniqueSlug;
    }

    const updateData = {
      ...req.body,
      ...(slug && { slug: slug })
    };

    const teamMember = await TeamMember.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    )
    .populate('department', 'name color');
    
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    res.json({ data: teamMember });
  } catch (error) {
    console.error('Error updating team member:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'A team member with this name or slug already exists' });
    } else {
      res.status(500).json({ message: 'Error updating team member' });
    }
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const teamMember = await TeamMember.findByIdAndDelete(id);
    
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ message: 'Error deleting team member' });
  }
}

module.exports = { 
  list, 
  getByDepartment, 
  getLeadership, 
  getBySlug, 
  create, 
  update, 
  remove
};

