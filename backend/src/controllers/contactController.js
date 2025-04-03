const Contact = require('../models/Contact');

/**
 * @desc    Submit a contact form
 * @route   POST /api/contact
 * @access  Public
 */
exports.submitContact = async (req, res) => {
  try {
    const { name, email, brandName, website, message } = req.body;

    // Create contact submission
    const contact = await Contact.create({
      name,
      email,
      brandName,
      website,
      message
    });

    res.status(201).json({ 
      success: true, 
      message: 'Your submission has been received. We will review it and get back to you soon.' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all contact submissions
 * @route   GET /api/contact
 * @access  Private/Admin
 */
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get single contact submission
 * @route   GET /api/contact/:id
 * @access  Private/Admin
 */
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact submission not found' });
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update contact submission status
 * @route   PUT /api/contact/:id
 * @access  Private/Admin
 */
exports.updateContactStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact submission not found' });
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete contact submission
 * @route   DELETE /api/contact/:id
 * @access  Private/Admin
 */
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact submission not found' });
    }

    await contact.deleteOne();
    res.json({ message: 'Contact submission removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 