const SiteSettings = require('../models/SiteSettings');

// Get all settings
async function get(req, res) {
  try {
    let settings = await SiteSettings.findOne({});
    
    if (!settings) {
      // Create default settings if none exist
      settings = new SiteSettings();
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
}

// Get specific section of settings
async function getSection(req, res) {
  try {
    const { section } = req.params;
    const settings = await SiteSettings.findOne({});
    
    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    
    if (!settings[section]) {
      return res.status(404).json({ error: `Section '${section}' not found` });
    }
    
    res.json(settings[section]);
  } catch (error) {
    console.error('Error fetching settings section:', error);
    res.status(500).json({ error: 'Failed to fetch settings section' });
  }
}

// Get page-specific settings
async function getPageSettings(req, res) {
  try {
    const { page } = req.params;
    const settings = await SiteSettings.findOne({});
    
    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    
    if (!settings.pages || !settings.pages[page]) {
      return res.status(404).json({ error: `Page settings for '${page}' not found` });
    }
    
    res.json(settings.pages[page]);
  } catch (error) {
    console.error('Error fetching page settings:', error);
    res.status(500).json({ error: 'Failed to fetch page settings' });
  }
}

// Update all settings
async function upsert(req, res) {
  try {
    const updated = await SiteSettings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true
    });
    
    res.json(updated);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
}

// Update specific section
async function updateSection(req, res) {
  try {
    const { section } = req.params;
    const updateData = {};
    
    // Process the data to handle color picker objects
    let processedData = req.body;
    
    // If this is the appearance section, handle color picker objects
    if (section === 'appearance') {
      processedData = { ...req.body };
      
      // Convert color picker objects to hex strings
      const colorFields = ['primaryColor', 'secondaryColor', 'accentColor', 'textColor', 'backgroundColor'];
      colorFields.forEach(field => {
        if (processedData[field] && typeof processedData[field] === 'object') {
          try {
            // Handle color picker object format
            if (processedData[field].metaColor) {
              const { r, g, b, a } = processedData[field].metaColor;
              if (typeof r === 'number' && typeof g === 'number' && typeof b === 'number') {
                if (a === 1 || a === undefined) {
                  // Convert RGB to hex
                  processedData[field] = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
                } else {
                  // Convert RGBA to hex
                  processedData[field] = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}${Math.round(a * 255).toString(16).padStart(2, '0')}`;
                }
              }
            } else if (processedData[field].hex) {
              // Handle hex format
              processedData[field] = processedData[field].hex;
            } else if (processedData[field].rgb) {
              // Handle RGB format
              const { r, g, b } = processedData[field].rgb;
              if (typeof r === 'number' && typeof g === 'number' && typeof b === 'number') {
                processedData[field] = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
              }
            } else if (processedData[field].toHexString) {
              // Handle Ant Design ColorPicker format
              processedData[field] = processedData[field].toHexString();
            } else if (typeof processedData[field] === 'string' && processedData[field].startsWith('#')) {
              // Already a hex string, keep as is
              // No conversion needed
            } else {
              console.warn(`Unknown color format for field ${field}:`, processedData[field]);
              // Set a default color if we can't parse it
              processedData[field] = '#000000';
            }
          } catch (colorError) {
            console.error(`Error processing color for field ${field}:`, colorError);
            // Set a default color if there's an error
            processedData[field] = '#000000';
          }
        }
      });
    }
    
    updateData[section] = processedData;
    
    console.log('Updating settings section:', section);
    console.log('Original data:', req.body);
    console.log('Processed data:', processedData);
    
    const updated = await SiteSettings.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true
    });
    
    if (!updated) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    
    // Check if the section exists in the updated document
    if (!updated[section]) {
      return res.status(404).json({ error: `Section '${section}' not found in settings` });
    }
    
    console.log('Settings updated successfully:', updated[section]);
    res.json(updated[section]);
  } catch (error) {
    console.error('Error updating settings section:', error);
    res.status(500).json({ error: 'Failed to update settings section: ' + error.message });
  }
}

// Update page-specific settings
async function updatePageSettings(req, res) {
  try {
    const { page } = req.params;
    const updateData = {};
    updateData[`pages.${page}`] = req.body;
    
    const updated = await SiteSettings.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true
    });
    
    res.json(updated.pages[page]);
  } catch (error) {
    console.error('Error updating page settings:', error);
    res.status(500).json({ error: 'Failed to update page settings' });
  }
}

// Reset settings to defaults
async function resetToDefaults(req, res) {
  try {
    const { section } = req.params;
    
    if (section) {
      // Reset specific section
      const settings = await SiteSettings.findOne({});
      if (settings && settings[section]) {
        settings[section] = new SiteSettings()[section];
        await settings.save();
        res.json(settings[section]);
      } else {
        res.status(404).json({ error: `Section '${section}' not found` });
      }
    } else {
      // Reset all settings
      await SiteSettings.deleteMany({});
      const newSettings = new SiteSettings();
      await newSettings.save();
      res.json(newSettings);
    }
  } catch (error) {
    console.error('Error resetting settings:', error);
    res.status(500).json({ error: 'Failed to reset settings' });
  }
}

// Export settings
async function exportSettings(req, res) {
  try {
    const settings = await SiteSettings.findOne({});
    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    
    const exportData = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      settings: settings.toObject()
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="site-settings.json"');
    res.json(exportData);
  } catch (error) {
    console.error('Error exporting settings:', error);
    res.status(500).json({ error: 'Failed to export settings' });
  }
}

// Import settings
async function importSettings(req, res) {
  try {
    const { settings } = req.body;
    
    if (!settings) {
      return res.status(400).json({ error: 'Settings data is required' });
    }
    
    // Validate the imported data structure
    const testSettings = new SiteSettings(settings);
    await testSettings.validate();
    
    // Update existing settings or create new ones
    const updated = await SiteSettings.findOneAndUpdate({}, settings, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true
    });
    
    res.json(updated);
  } catch (error) {
    console.error('Error importing settings:', error);
    res.status(500).json({ error: 'Failed to import settings: ' + error.message });
  }
}

// Get settings summary for dashboard
async function getSummary(req, res) {
  try {
    const settings = await SiteSettings.findOne({});
    
    if (!settings) {
      return res.json({
        siteName: 'Not configured',
        email: 'Not configured',
        phone: 'Not configured',
        socialAccounts: 0,
        lastUpdated: null
      });
    }
    
    const socialAccounts = Object.values(settings.social || {}).filter(url => url).length;
    
    res.json({
      siteName: settings.general?.siteName || settings.siteName || 'Not configured',
      email: settings.contact?.email || 'Not configured',
      phone: settings.contact?.phone || 'Not configured',
      socialAccounts,
      lastUpdated: settings.updatedAt,
      maintenanceMode: settings.general?.maintenanceMode || false,
      analyticsEnabled: !!(settings.seo?.googleAnalytics || settings.seo?.googleTagManager)
    });
  } catch (error) {
    console.error('Error fetching settings summary:', error);
    res.status(500).json({ error: 'Failed to fetch settings summary' });
  }
}

module.exports = { 
  get, 
  getSection, 
  getPageSettings,
  upsert, 
  updateSection, 
  updatePageSettings,
  resetToDefaults,
  exportSettings,
  importSettings,
  getSummary
};

