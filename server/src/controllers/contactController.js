const Contact = require('../models/Contact');
const Service = require('../models/Service');
const Department = require('../models/Department');
const { sendEmail } = require('../lib/mailer');

// Submit contact form
async function submitContact(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      jobTitle,
      enquiryType,
      serviceCategory,
      specificService,
      department,
      vehicleType,
      vehicleDetails,
      urgency,
      message
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !phone || !enquiryType || !message) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['firstName', 'lastName', 'email', 'phone', 'enquiryType', 'message']
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Get additional metadata
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'];
    const referrer = req.headers.referer || req.headers.referrer;
    const pageUrl = req.headers.origin + req.originalUrl;

    // Create contact record
    const contactData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      company: company ? company.trim() : undefined,
      jobTitle: jobTitle ? jobTitle.trim() : undefined,
      enquiryType,
      serviceCategory: serviceCategory || undefined,
      specificService: specificService || undefined,
      department: department || undefined,
      vehicleType: vehicleType || undefined,
      vehicleDetails: vehicleDetails ? vehicleDetails.trim() : undefined,
      urgency: urgency || undefined,
      message: message.trim(),
      ipAddress,
      userAgent,
      referrer,
      pageUrl,
      source: 'website'
    };

    const contact = await Contact.create(contactData);

    // Populate references for email
    const populatedContact = await Contact.findById(contact._id)
      .populate('serviceCategory', 'title')
      .populate('specificService', 'title')
      .populate('department', 'name');

    // Send notification emails
    try {
      await sendContactNotification(populatedContact);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the contact submission if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your enquiry! We will get back to you within 24 hours.',
      contactId: contact._id
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ 
      message: 'There was an error submitting your enquiry. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Get all contacts (admin only)
async function getAllContacts(req, res) {
  try {
    const { 
      status, 
      enquiryType, 
      priority, 
      page = 1, 
      limit = 20,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by enquiry type
    if (enquiryType) {
      query.enquiryType = enquiryType;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const contacts = await Contact.find(query)
      .populate('serviceCategory', 'title')
      .populate('specificService', 'title')
      .populate('department', 'name')
      .populate('assignedTo', 'username email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(query);

    res.json({
      contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ 
      message: 'Error fetching contacts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Get single contact (admin only)
async function getContact(req, res) {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id)
      .populate('serviceCategory', 'title')
      .populate('specificService', 'title')
      .populate('department', 'name')
      .populate('assignedTo', 'username email');

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(contact);

  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ 
      message: 'Error fetching contact',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Update contact status (admin only)
async function updateContact(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const contact = await Contact.findByIdAndUpdate(id, updateData, { new: true })
      .populate('serviceCategory', 'title')
      .populate('specificService', 'title')
      .populate('department', 'name')
      .populate('assignedTo', 'username email');

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(contact);

  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ 
      message: 'Error updating contact',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Delete contact (admin only)
async function deleteContact(req, res) {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });

  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ 
      message: 'Error deleting contact',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Get contact statistics (admin only)
async function getContactStats(req, res) {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          contacted: { $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] } },
          urgent: { $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] } }
        }
      }
    ]);

    const enquiryTypeStats = await Contact.aggregate([
      {
        $group: {
          _id: '$enquiryType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('serviceCategory', 'title')
      .populate('department', 'name');

    res.json({
      overall: stats[0] || {
        total: 0,
        new: 0,
        inProgress: 0,
        contacted: 0,
        urgent: 0
      },
      enquiryTypes: enquiryTypeStats,
      recent: recentContacts
    });

  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({ 
      message: 'Error fetching contact statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Send reply to contact
async function sendReply(req, res) {
  try {
    const { id } = req.params;
    const { subject, message, responseMethod } = req.body;

    // Validation
    if (!subject || !message) {
      return res.status(400).json({ 
        message: 'Subject and message are required' 
      });
    }

    const contact = await Contact.findById(id)
      .populate('serviceCategory', 'title')
      .populate('specificService', 'title')
      .populate('department', 'name');

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Update contact status
    await Contact.findByIdAndUpdate(id, {
      status: 'contacted',
      respondedAt: new Date(),
      responseMethod: responseMethod || 'email'
    });

    // Send reply email
    try {
      const replyEmail = {
        to: contact.email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">HIDRIVE</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Mobile Workspace Solutions</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-bottom: 20px;">Re: ${subject}</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Dear ${contact.firstName} ${contact.lastName},
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 20px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
              
              <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #1976d2; margin-top: 0;">Your Original Enquiry</h3>
                <p style="color: #666; margin-bottom: 10px;"><strong>Enquiry Type:</strong> ${contact.enquiryType}</p>
                <p style="color: #666; margin-bottom: 10px;"><strong>Service:</strong> ${contact.serviceCategory?.title || 'N/A'}</p>
                <p style="color: #666; margin-bottom: 10px;"><strong>Submitted:</strong> ${new Date(contact.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #666; margin-bottom: 15px;">Need further assistance?</p>
                <div style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 0 10px;">
                  📞 Call: 1300 368 161
                </div>
                <div style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 0 10px;">
                  📧 Email: info@hidrive.com.au
                </div>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
              
              <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
                This email was sent in response to your enquiry submitted on ${new Date(contact.createdAt).toLocaleDateString()}.<br>
                If you have any questions, please don't hesitate to contact us.
              </p>
            </div>
          </div>
        `
      };

      await sendEmail(replyEmail);

      res.json({
        success: true,
        message: 'Reply sent successfully',
        contactId: contact._id
      });

    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      res.status(500).json({ 
        message: 'Reply saved but email sending failed',
        error: process.env.NODE_ENV === 'development' ? emailError.message : undefined
      });
    }

  } catch (error) {
    console.error('Send reply error:', error);
    res.status(500).json({ 
      message: 'Error sending reply',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Helper function to send email notifications
async function sendContactNotification(contact) {
  try {
    // Email to admin
    const adminEmail = {
      to: process.env.ADMIN_EMAIL || 'admin@hidrive.com.au',
      subject: `🚨 NEW ENQUIRY - ${contact.enquiryType.toUpperCase()} - ${contact.priority.toUpperCase()} Priority`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">HIDRIVE</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">New Contact Enquiry</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: ${contact.priority === 'urgent' ? '#ffebee' : contact.priority === 'high' ? '#fff3e0' : '#e8f5e8'}; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid ${contact.priority === 'urgent' ? '#f44336' : contact.priority === 'high' ? '#ff9800' : '#4caf50'};">
              <h3 style="margin: 0; color: ${contact.priority === 'urgent' ? '#c62828' : contact.priority === 'high' ? '#e65100' : '#2e7d32'};">
                ${contact.priority.toUpperCase()} PRIORITY - ${contact.enquiryType.toUpperCase()}
              </h3>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div style="background: white; padding: 20px; border-radius: 8px;">
                <h3 style="color: #333; margin-top: 0;">Contact Information</h3>
                <p><strong>Name:</strong> ${contact.fullName}</p>
                <p><strong>Email:</strong> <a href="mailto:${contact.email}" style="color: #667eea;">${contact.email}</a></p>
                <p><strong>Phone:</strong> <a href="tel:${contact.phone}" style="color: #667eea;">${contact.phone}</a></p>
                ${contact.company ? `<p><strong>Company:</strong> ${contact.company}</p>` : ''}
                ${contact.jobTitle ? `<p><strong>Job Title:</strong> ${contact.jobTitle}</p>` : ''}
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px;">
                <h3 style="color: #333; margin-top: 0;">Enquiry Details</h3>
                <p><strong>Type:</strong> ${contact.enquiryType}</p>
                <p><strong>Service:</strong> ${contact.serviceCategory?.title || 'N/A'}</p>
                <p><strong>Specific:</strong> ${contact.specificService?.title || 'N/A'}</p>
                <p><strong>Department:</strong> ${contact.department?.name || 'N/A'}</p>
                ${contact.vehicleType ? `<p><strong>Vehicle:</strong> ${contact.vehicleType}</p>` : ''}
                ${contact.urgency ? `<p><strong>Urgency:</strong> ${contact.urgency}</p>` : ''}
              </div>
            </div>
            
            ${contact.vehicleDetails ? `
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #333; margin-top: 0;">Vehicle Details</h3>
                <p style="white-space: pre-wrap; color: #666;">${contact.vehicleDetails}</p>
              </div>
            ` : ''}
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #333; margin-top: 0;">Message</h3>
              <div style="background: #f5f5f5; padding: 15px; border-radius: 6px; white-space: pre-wrap; color: #333; line-height: 1.6;">
                ${contact.message}
              </div>
            </div>
            
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #1976d2; margin-top: 0;">Quick Actions</h3>
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <a href="mailto:${contact.email}?subject=Re: ${contact.enquiryType} enquiry" style="background: #667eea; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">📧 Reply via Email</a>
                <a href="tel:${contact.phone}" style="background: #4caf50; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">📞 Call Now</a>
                <span style="background: #ff9800; color: white; padding: 10px 20px; border-radius: 6px;">🕒 Submitted: ${new Date(contact.createdAt).toLocaleString()}</span>
              </div>
            </div>
            
            <div style="text-align: center; color: #666; font-size: 12px;">
              <p>Enquiry ID: ${contact._id}</p>
              <p>IP Address: ${contact.ipAddress || 'N/A'}</p>
              <p>Source: ${contact.source}</p>
            </div>
          </div>
        </div>
      `
    };

    // Email to customer (auto-reply)
    const customerEmail = {
      to: contact.email,
      subject: 'Thank you for your enquiry - HIDRIVE',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">HIDRIVE</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Mobile Workspace Solutions</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background: #4caf50; color: white; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 20px;">
                ✓
              </div>
              <h2 style="color: #333; margin-bottom: 10px;">Thank You!</h2>
              <p style="color: #666; font-size: 18px;">We've received your enquiry</p>
            </div>
            
            <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
              <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
                Dear <strong>${contact.firstName} ${contact.lastName}</strong>,
              </p>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
                Thank you for contacting HIDRIVE. We have received your <strong>${contact.enquiryType}</strong> enquiry and our specialist team is reviewing it now.
              </p>
              
              <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                <p style="margin: 0; color: #2e7d32;"><strong>What happens next?</strong></p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #2e7d32;">
                  <li>Our team will review your requirements within 24 hours</li>
                  <li>We'll contact you with a detailed response or quote</li>
                  <li>If urgent, we may call you directly</li>
                </ul>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 0;">
                We aim to respond to all enquiries within 24 hours during business hours (Monday - Friday, 8AM-6.30PM AEST).
              </p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">Your Enquiry Details</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                <div>
                  <p style="margin: 5px 0; color: #666;"><strong>Reference:</strong> ${contact._id}</p>
                  <p style="margin: 5px 0; color: #666;"><strong>Type:</strong> ${contact.enquiryType}</p>
                  <p style="margin: 5px 0; color: #666;"><strong>Service:</strong> ${contact.serviceCategory?.title || 'N/A'}</p>
                </div>
                <div>
                  <p style="margin: 5px 0; color: #666;"><strong>Submitted:</strong> ${new Date(contact.createdAt).toLocaleDateString()}</p>
                  <p style="margin: 5px 0; color: #666;"><strong>Priority:</strong> ${contact.priority}</p>
                  ${contact.urgency ? `<p style="margin: 5px 0; color: #666;"><strong>Urgency:</strong> ${contact.urgency}</p>` : ''}
                </div>
              </div>
            </div>
            
            <div style="text-align: center; margin-bottom: 25px;">
              <p style="color: #666; margin-bottom: 15px;">Need immediate assistance?</p>
              <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <a href="tel:1300368161" style="background: #4caf50; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                  📞 1300 368 161
                </a>
                <a href="mailto:info@hidrive.com.au" style="background: #667eea; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                  📧 info@hidrive.com.au
                </a>
              </div>
            </div>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center;">
              <h4 style="color: #333; margin-top: 0; margin-bottom: 10px;">Why Choose HIDRIVE?</h4>
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; font-size: 14px;">
                <div>
                  <div style="font-size: 20px; margin-bottom: 5px;">⚡</div>
                  <strong>Fast Service</strong><br>
                  <span style="color: #666;">Quick turnaround times</span>
                </div>
                <div>
                  <div style="font-size: 20px; margin-bottom: 5px;">🏆</div>
                  <strong>Quality</strong><br>
                  <span style="color: #666;">Premium solutions</span>
                </div>
                <div>
                  <div style="font-size: 20px; margin-bottom: 5px;">🇦🇺</div>
                  <strong>Australian</strong><br>
                  <span style="color: #666;">Local expertise</span>
                </div>
              </div>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0; line-height: 1.5;">
              <strong>HIDRIVE</strong><br>
              Mobile Workspace Solutions<br>
              1300 368 161 | info@hidrive.com.au<br>
              <br>
              This is an automated response to your enquiry submitted on ${new Date(contact.createdAt).toLocaleDateString()}.<br>
              Please do not reply to this email. For urgent matters, call us directly.
            </p>
          </div>
        </div>
      `
    };

    // Send emails
    await Promise.all([
      sendEmail(adminEmail),
      sendEmail(customerEmail)
    ]);

  } catch (error) {
    console.error('Email notification error:', error);
    throw error;
  }
}

module.exports = {
  submitContact,
  getAllContacts,
  getContact,
  updateContact,
  deleteContact,
  getContactStats,
  sendReply
}; 