const supabase = require('../utils/supabaseClient');

/**
 * @desc    Submit a contact form
 * @route   POST /api/contact
 * @access  Public
 */
const { sendLeadNotification } = require("../utils/emailService");

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, brandName, website, message, source } = req.body;

    // Validate input
    if (!name || !email || !brandName || !message) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const now = new Date().toISOString();

    // Create contact submission
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          name,
          email,
          brand_name: brandName,
          website: website || null,
          message,
          created_at: now,
          updated_at: now,
          status: 'pending' // Default status
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data
    });

    // Fire-and-forget email notification
    sendLeadNotification({
      name,
      email,
      brandName,
      website,
      source:
        source ||
        (message?.includes("SMS")
          ? "SMS Playbook"
          : "Retention Calculator"),
    }).catch((notifyErr) => {
      console.error("Lead alert failed:", notifyErr);
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all contact submissions
 * @route   GET /api/contact
 * @access  Private/Admin
 */
exports.getContactSubmissions = async (req, res) => {
  try {
    // Query all contact submissions, ordered by creation date (newest first)
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform data for frontend compatibility
    const transformedData = data.map(item => ({
      _id: item.id,
      name: item.name,
      email: item.email,
      brandName: item.brand_name,
      website: item.website,
      message: item.message,
      status: item.status,
      adminNotes: item.admin_notes,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));

    res.json(transformedData);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get contact by ID
 * @route   GET /api/contact/:id
 * @access  Private/Admin
 */
exports.getContactById = async (req, res) => {
  try {
    const contactId = req.params.id;

    // Query contact by ID
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Contact not found' });
      }
      throw error;
    }

    // Transform data for frontend compatibility
    const transformedData = {
      _id: data.id,
      name: data.name,
      email: data.email,
      brandName: data.brand_name,
      website: data.website,
      message: data.message,
      status: data.status,
      adminNotes: data.admin_notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    res.json(transformedData);
  } catch (error) {
    console.error('Get contact by ID error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update contact status
 * @route   PUT /api/contact/:id
 * @access  Private/Admin
 */
exports.updateContactStatus = async (req, res) => {
  try {
    const contactId = req.params.id;
    const { status, adminNotes } = req.body;

    // Validate status
    const validStatuses = ['pending', 'reviewed', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const now = new Date().toISOString();

    // Update contact status
    const { data, error } = await supabase
      .from('contacts')
      .update({ 
        status,
        admin_notes: adminNotes || null,
        updated_at: now
      })
      .eq('id', contactId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Contact not found' });
      }
      throw error;
    }

    // Transform data for frontend compatibility
    const transformedData = {
      _id: data.id,
      name: data.name,
      email: data.email,
      brandName: data.brand_name,
      website: data.website,
      message: data.message,
      status: data.status,
      adminNotes: data.admin_notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    res.json(transformedData);
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete contact
 * @route   DELETE /api/contact/:id
 * @access  Private/Admin
 */
exports.deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;

    // Delete contact
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', contactId);

    if (error) throw error;

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ message: error.message });
  }
}; 