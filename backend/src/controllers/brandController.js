const Brand = require('../models/Brand');

/**
 * @desc    Get all brands
 * @route   GET /api/brands
 * @access  Public
 */
exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ order: 1, featured: -1, rating: -1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get single brand by slug
 * @route   GET /api/brands/:slug
 * @access  Public
 */
exports.getBrandBySlug = async (req, res) => {
  try {
    const brand = await Brand.findOne({ slug: req.params.slug });

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create a brand
 * @route   POST /api/brands
 * @access  Private/Admin
 */
exports.createBrand = async (req, res) => {
  try {
    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    // Create relative path for image URL
    const imagePath = `/uploads/${req.file.filename}`;

    // Create the brand with image path
    const brand = await Brand.create({
      ...req.body,
      image: imagePath
    });

    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update a brand
 * @route   PUT /api/brands/:id
 * @access  Private/Admin
 */
exports.updateBrand = async (req, res) => {
  try {
    let brandData = { ...req.body };

    // If a new image was uploaded, update the image path
    if (req.file) {
      brandData.image = `/uploads/${req.file.filename}`;
    }

    // Find and update the brand
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      brandData,
      { new: true, runValidators: true }
    );

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete a brand
 * @route   DELETE /api/brands/:id
 * @access  Private/Admin
 */
exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    await brand.deleteOne();
    res.json({ message: 'Brand removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update brand order
 * @route   PUT /api/brands/reorder
 * @access  Private/Admin
 */
exports.updateBrandOrder = async (req, res) => {
  try {
    const { brandOrders } = req.body;

    // Check if brandOrders is provided and is an array
    if (!brandOrders || !Array.isArray(brandOrders)) {
      return res.status(400).json({ 
        message: 'Brand orders must be provided as an array' 
      });
    }

    // Update each brand's order value
    const updatePromises = brandOrders.map(({ id, order }) => {
      return Brand.findByIdAndUpdate(id, { order });
    });

    await Promise.all(updatePromises);

    res.json({ message: 'Brand order updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 