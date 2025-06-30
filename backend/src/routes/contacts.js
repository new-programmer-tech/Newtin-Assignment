const express = require('express');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');
const {
  validateContact,
  validateContactUpdate,
  validateObjectId
} = require('../middleware/validation');

const router = express.Router();

// @route   POST /api/contacts
// @desc    Create a new contact
// @access  Private
router.post('/contacts', auth, validateContact, async (req, res) => {
  try {
    const { name, email, phone, type } = req.body;

    const existingContact = await Contact.findOne({
      email,
      user: req.user._id
    });

    if (existingContact) {
      return res.status(400).json({
        success: false,
        message: 'A contact with this email already exists'
      });
    }

    // Create new contact
    const contact = new Contact({
      name,
      email,
      phone,
      type,
      user: req.user._id
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      data: contact
    });

  } catch (error) {
    console.error('Create contact error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A contact with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating contact'
    });
  }
});

// @route   GET /api/contacts
// @desc    Get all contacts for the authenticated user
// @access  Private
router.get('/contacts', auth, async (req, res) => {
  try {
    const { type, search, page = 1, limit = 10 } = req.query;

    const query = { user: req.user._id };

    if (type && ['personal', 'work'].includes(type.toLowerCase())) {
      query.type = type.toLowerCase();
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalContacts = await Contact.countDocuments(query);

    // Get contacts
    const contacts = await Contact.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-user');

    res.json({
      success: true,
      data: contacts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalContacts / parseInt(limit)),
        totalContacts,
        hasNextPage: skip + contacts.length < totalContacts,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching contacts'
    });
  }
});

// @route   GET /api/contacts/:id
// @desc    Get a single contact by ID
// @access  Private
router.get('/contacts/:id', auth, validateObjectId, async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      user: req.user._id
    }).select('-user');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching contact'
    });
  }
});

// @route   PUT /api/contacts/:id
// @desc    Update a contact
// @access  Private
router.put('/contacts/:id', auth, validateObjectId, validateContactUpdate, async (req, res) => {
  try {
    const { name, email, phone, type } = req.body;

    // Find the contact
    const contact = await Contact.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    if (email && email !== contact.email) {
      const existingContact = await Contact.findOne({
        email,
        user: req.user._id,
        _id: { $ne: req.params.id }
      });

      if (existingContact) {
        return res.status(400).json({
          success: false,
          message: 'Another contact with this email already exists'
        });
      }
    }

    if (name !== undefined) contact.name = name;
    if (email !== undefined) contact.email = email;
    if (phone !== undefined) contact.phone = phone;
    if (type !== undefined) contact.type = type;

    await contact.save();

    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: contact
    });

  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating contact'
    });
  }
});

// @route   DELETE /api/contacts/:id
// @desc    Delete a contact
// @access  Private
router.delete('/contacts/:id', auth, validateObjectId, async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting contact'
    });
  }
});

module.exports = router;