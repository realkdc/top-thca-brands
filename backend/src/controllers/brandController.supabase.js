const supabase = require('../utils/supabaseClient');

/**
 * @desc    Get all brands
 * @route   GET /api/brands
 * @access  Public
 */
exports.getBrands = async (req, res) => {
  try {
    // Query all active brands ordered by rank
    const { data: brands, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_active', true)
      .order('rank', { ascending: true });

    if (error) throw error;

    res.json(brands);
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all brands (including inactive ones) for admin
 * @route   GET /api/brands/admin
 * @access  Private/Admin
 */
exports.getAdminBrands = async (req, res) => {
  try {
    // Query all brands ordered by rank for admin
    const { data: brands, error } = await supabase
      .from('brands')
      .select('*')
      .order('rank', { ascending: true });

    if (error) throw error;

    res.json(brands);
  } catch (error) {
    console.error('Get admin brands error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get brand by ID
 * @route   GET /api/brands/:id
 * @access  Public
 */
exports.getBrandById = async (req, res) => {
  try {
    const brandId = req.params.id;

    // Query brand by ID
    const { data: brand, error } = await supabase
      .from('brands')
      .select('*')
      .eq('id', brandId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Brand not found' });
      }
      throw error;
    }

    res.json(brand);
  } catch (error) {
    console.error('Get brand by ID error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get brand by slug
 * @route   GET /api/brands/:slug
 * @access  Public
 */
exports.getBrandBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;

    // Query brand by slug
    const { data: brand, error } = await supabase
      .from('brands')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Brand not found' });
      }
      throw error;
    }

    res.json(brand);
  } catch (error) {
    console.error('Get brand by slug error:', error);
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
    const brandData = req.body;
    
    // Set initial rank if not provided
    if (!brandData.rank) {
      // Get the highest current rank
      const { data: lastBrand, error: rankError } = await supabase
        .from('brands')
        .select('rank')
        .order('rank', { ascending: false })
        .limit(1);
      
      if (rankError) throw rankError;
      
      // Set new brand rank to highest + 1 or start at 1
      brandData.rank = lastBrand && lastBrand.length > 0 ? lastBrand[0].rank + 1 : 1;
    }

    // Handle image upload if provided
    if (req.file) {
      // Get file extension
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('brand-images')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          cacheControl: '3600'
        });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('brand-images')
        .getPublicUrl(fileName);
      
      brandData.logo = urlData.publicUrl;
    }

    // Create brand in database
    const { data: brand, error } = await supabase
      .from('brands')
      .insert([brandData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(brand);
  } catch (error) {
    console.error('Create brand error:', error);
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
    const brandId = req.params.id;
    const updateData = req.body;
    
    // Check if brand exists
    const { data: existingBrand, error: checkError } = await supabase
      .from('brands')
      .select('*')
      .eq('id', brandId)
      .single();
    
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return res.status(404).json({ message: 'Brand not found' });
      }
      throw checkError;
    }

    // Handle image upload if provided
    if (req.file) {
      // Get file extension
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('brand-images')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          cacheControl: '3600'
        });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('brand-images')
        .getPublicUrl(fileName);
      
      updateData.logo = urlData.publicUrl;
      
      // Delete old image if exists
      if (existingBrand.logo) {
        const oldFileName = existingBrand.logo.split('/').pop();
        await supabase.storage.from('brand-images').remove([oldFileName]);
      }
    }

    // Update brand in database
    const { data: updatedBrand, error } = await supabase
      .from('brands')
      .update(updateData)
      .eq('id', brandId)
      .select()
      .single();

    if (error) throw error;

    res.json(updatedBrand);
  } catch (error) {
    console.error('Update brand error:', error);
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
    const brandId = req.params.id;
    
    // Check if brand exists and get logo path
    const { data: brand, error: checkError } = await supabase
      .from('brands')
      .select('logo')
      .eq('id', brandId)
      .single();
    
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return res.status(404).json({ message: 'Brand not found' });
      }
      throw checkError;
    }

    // Delete from database
    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', brandId);

    if (error) throw error;

    // Delete logo from storage if exists
    if (brand.logo) {
      const fileName = brand.logo.split('/').pop();
      await supabase.storage.from('brand-images').remove([fileName]);
    }

    res.json({ message: 'Brand removed' });
  } catch (error) {
    console.error('Delete brand error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update brand ranks
 * @route   PUT /api/brands/ranks
 * @access  Private/Admin
 */
exports.updateBrandRanks = async (req, res) => {
  try {
    const { brands } = req.body;
    
    if (!Array.isArray(brands)) {
      return res.status(400).json({ message: 'Brands must be an array' });
    }

    // Use a transaction to update all ranks
    const updatePromises = brands.map(brand => 
      supabase
        .from('brands')
        .update({ rank: brand.rank })
        .eq('id', brand.id)
    );

    await Promise.all(updatePromises);

    res.json({ message: 'Ranks updated successfully' });
  } catch (error) {
    console.error('Update ranks error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update brand display order
 * @route   PUT /api/brands/reorder
 * @access  Private/Admin
 */
exports.updateBrandOrder = async (req, res) => {
  try {
    const { brandOrders } = req.body;

    if (!brandOrders || !Array.isArray(brandOrders)) {
      return res.status(400).json({ message: 'Invalid brand order data' });
    }

    // For each brand update the rank
    for (const item of brandOrders) {
      const { id, rank } = item;
      
      const { error } = await supabase
        .from('brands')
        .update({ rank })
        .eq('id', id);
      
      if (error) throw error;
    }

    res.json({ message: 'Brand order updated successfully' });
  } catch (error) {
    console.error('Update brand order error:', error);
    res.status(500).json({ message: error.message });
  }
}; 