const supabase = require('../utils/supabaseClient');

// Mapping function to convert frontend field names to Supabase column names
function mapToSupabaseColumns(data) {
  // Show raw data for debugging
  console.log('Original data from frontend:', data);
  
  // For Supabase tables, use a sanitized version of the original names
  // Keep most field names as they are, just handle special cases
  const mappedData = {};
  
  // Add product types array if it doesn't exist
  mappedData.product_types = [];
  
  // Loop through all properties and add them to mapped data
  Object.keys(data).forEach(key => {
    // Handle special cases with different naming in frontend vs database
    if (key === 'featured') {
      // Skip featured field as it doesn't exist in the database
      // We'll use this information in product_types instead
      if (data[key] === 'true' || data[key] === true) {
        mappedData.product_types.push('featured');
      }
    } else if (key === 'productTypes') {
      // Handle product types as an array
      if (data[key]) {
        const types = data[key].split(',').map(t => t.trim()).filter(t => t);
        mappedData.product_types = [...mappedData.product_types, ...types];
      }
    } else if (key === 'website') {
      mappedData.website_url = data[key];
    } else if (key === 'category') {
      // Store category as a product type if there's no category column
      if (data[key]) {
        mappedData.product_types.push(data[key]);
      }
    } else if (key === 'rating') {
      // Skip rating field if it doesn't exist in the database
      // Could store as metadata or in a separate table if needed
    } else if (key === 'image') {
      // Skip image field as we'll handle it separately
      // In Supabase we use 'logo' instead of 'image'
    } else if (key === 'location') {
      // Skip location field as it doesn't exist in the database
    } else if (key === 'name' || key === 'description') {
      // Include standard fields that exist in the database
      mappedData[key] = data[key];
    } else {
      // For any other fields, only include if they match the schema
      // Limits what gets sent to Supabase to avoid column errors
      if (['thc_percentage', 'cbd_percentage'].includes(key)) {
        mappedData[key] = data[key];
      }
    }
  });
  
  // Ensure required fields are set
  mappedData.is_active = true;
  
  console.log('Mapped data for Supabase (keeping original names):', mappedData);
  return mappedData;
}

/**
 * Convert Supabase brand data to MongoDB format for frontend compatibility
 */
function mapToFrontendFormat(brands) {
  if (!Array.isArray(brands)) {
    // Handle single brand object
    return mapSingleBrandToFrontend(brands);
  }
  
  // Handle array of brands
  return brands.map(mapSingleBrandToFrontend);
}

/**
 * Convert a single Supabase brand to MongoDB format
 */
function mapSingleBrandToFrontend(brand) {
  if (!brand) return null;
  
  // Extract main category from product_types if available
  let category = 'Other';
  const mainCategories = ['Flower', 'Concentrate', 'Edibles', 'Vape'];
  if (brand.product_types && Array.isArray(brand.product_types)) {
    // Find the first main category in product_types
    const foundCategory = brand.product_types.find(type => mainCategories.includes(type));
    if (foundCategory) {
      category = foundCategory;
    }
  }
  
  // Check if brand is featured based on product_types
  const featured = brand.product_types && Array.isArray(brand.product_types) 
    ? brand.product_types.includes('featured') 
    : false;
  
  // Generate a slug if not present
  const slug = brand.slug || brand.name.toLowerCase().replace(/\s+/g, '-');
  
  // Return brand in MongoDB format that frontend expects
  return {
    _id: brand.id,
    name: brand.name,
    image: brand.logo || '',
    category: category,
    rating: 5, // Default rating
    description: brand.description || '',
    featured: featured,
    slug: slug,
    website: brand.website_url || '',
    productTypes: brand.product_types || [],
    location: '',
    // Keep Supabase fields for debugging
    original_id: brand.id,
    rank: brand.rank,
    is_active: brand.is_active
  };
}

/**
 * @desc    Get all brands
 * @route   GET /api/brands
 * @access  Public
 */
exports.getBrands = async (req, res) => {
  try {
    // Query all active brands ordered by rank
    const { data: brandsData, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_active', true)
      .order('rank', { ascending: true });

    if (error) throw error;

    // Transform to frontend format
    const brands = mapToFrontendFormat(brandsData);
    
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
    const { data: brandsData, error } = await supabase
      .from('brands')
      .select('*')
      .order('rank', { ascending: true });

    if (error) throw error;

    // Transform to frontend format
    const brands = mapToFrontendFormat(brandsData);
    
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
    const { data: brandData, error } = await supabase
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

    // Transform to frontend format
    const brand = mapSingleBrandToFrontend(brandData);
    
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
    const { data: brandData, error } = await supabase
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

    // Transform to frontend format
    const brand = mapSingleBrandToFrontend(brandData);
    
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
    console.log('Start creating brand');
    const frontendData = req.body;
    
    // Debug auth state
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('Current auth user:', user ? user.id : 'Not authenticated');
    console.log('Auth error:', authError);
    
    // Get service role key for admin operations that bypass RLS
    // Only use this in trusted server environments
    console.log('Using service role for database operations to bypass RLS');
    const supabaseAdmin = supabase;
    
    // Map frontend field names to Supabase column names
    const brandData = mapToSupabaseColumns(frontendData);
    
    // Set initial rank if not provided - ALWAYS set rank as it's NOT NULL
    // Get the highest current rank
    const { data: lastBrand, error: rankError } = await supabaseAdmin
      .from('brands')
      .select('rank')
      .order('rank', { ascending: false })
      .limit(1);
    
    if (rankError) {
      console.error('Error fetching ranks:', rankError);
      throw rankError;
    }
    
    // Set new brand rank to highest + 1 or start at 1
    brandData.rank = lastBrand && lastBrand.length > 0 ? (lastBrand[0].rank + 1) : 1;

    // Handle image upload if provided
    if (req.file) {
      console.log('Processing file upload');
      console.log('File details:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        buffer: req.file.buffer ? 'Buffer present' : 'No buffer'
      });
      
      // Get file extension
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      console.log('Uploading file to storage:', fileName);
      
      try {
        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('brand-images')
          .upload(fileName, req.file.buffer, {
            contentType: req.file.mimetype,
            cacheControl: '3600'
          });
        
        if (uploadError) {
          console.error('Storage upload error:', uploadError);
          throw uploadError;
        }
        
        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
          .from('brand-images')
          .getPublicUrl(fileName);
        
        // Use logo field instead of image to match database schema
        brandData.logo = urlData.publicUrl;
        console.log('File uploaded successfully, URL:', brandData.logo);
      } catch (uploadErr) {
        console.error('Error during file upload process:', uploadErr);
        throw uploadErr;
      }
    } else {
      console.log('No file uploaded with the request');
    }

    console.log('Inserting brand into database with these fields:', Object.keys(brandData).join(', '));
    // Create brand in database
    const { data: brandDataResult, error } = await supabaseAdmin
      .from('brands')
      .insert([brandData])
      .select()
      .single();

    if (error) {
      console.error('Database insert error:', error);
      throw error;
    }

    // Transform to frontend format for response
    const brand = mapSingleBrandToFrontend(brandDataResult);
    
    console.log('Brand created successfully:', brand._id);
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
    console.log('Start updating brand');
    const brandId = req.params.id;
    const frontendData = req.body;
    
    // Debug auth state
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('Current auth user:', user ? user.id : 'Not authenticated');
    console.log('Auth error:', authError);
    
    // Get service role for admin operations that bypass RLS
    console.log('Using service role for database operations to bypass RLS');
    const supabaseAdmin = supabase;
    
    // Check if brand exists
    const { data: existingBrand, error: checkError } = await supabaseAdmin
      .from('brands')
      .select('*')
      .eq('id', brandId)
      .single();
    
    if (checkError) {
      console.error('Error checking for existing brand:', checkError);
      if (checkError.code === 'PGRST116' || checkError.message?.includes('No rows found')) {
        return res.status(404).json({ message: 'Brand not found' });
      }
      throw checkError;
    }

    // Map frontend field names to Supabase column names - careful to only include fields that exist
    const mappedData = {};
    
    // Process category as product_types
    let productTypes = [...(existingBrand.product_types || [])];
    
    // Filter out old category values to avoid duplicates
    const mainCategories = ['Flower', 'Concentrate', 'Edibles', 'Vape', 'Other'];
    productTypes = productTypes.filter(type => !mainCategories.includes(type));
    
    // Add new category 
    if (frontendData.category) {
      productTypes.push(frontendData.category);
    }
    
    // Handle featured status in product_types
    if (frontendData.featured !== undefined) {
      // Remove 'featured' if it exists
      productTypes = productTypes.filter(type => type !== 'featured');
      
      // Add 'featured' back if it should be featured
      if (frontendData.featured === true || frontendData.featured === 'true') {
        productTypes.push('featured');
      }
    }
    
    // Set the confirmed fields that exist in the database
    mappedData.name = frontendData.name;
    mappedData.description = frontendData.description;
    mappedData.product_types = productTypes;
    
    // Map website if provided
    if (frontendData.website) {
      mappedData.website_url = frontendData.website;
    }
    
    console.log('Original data from frontend:', frontendData);
    console.log('Mapped data for update:', mappedData);

    // Handle image upload if provided
    if (req.file) {
      console.log('Processing file upload for update');
      // Get file extension
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      console.log('Uploading new file to storage:', fileName);
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('brand-images')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          cacheControl: '3600'
        });
      
      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }
      
      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from('brand-images')
        .getPublicUrl(fileName);
      
      mappedData.logo = urlData.publicUrl;
      console.log('New file uploaded successfully, URL:', mappedData.logo);
      
      // Delete old image if exists
      if (existingBrand.logo) {
        console.log('Deleting old image');
        const oldFileName = existingBrand.logo.split('/').pop();
        const { error: deleteImageError } = await supabaseAdmin.storage
          .from('brand-images')
          .remove([oldFileName]);
          
        if (deleteImageError) {
          console.log('Warning: Could not delete old image:', deleteImageError);
          // Continue with update even if image deletion fails
        }
      }
    }

    console.log('Updating brand in database with these fields:', Object.keys(mappedData).join(', '));
    // Update brand in database
    const { data: updatedBrandData, error } = await supabaseAdmin
      .from('brands')
      .update(mappedData)
      .eq('id', brandId)
      .select()
      .single();

    if (error) {
      console.error('Database update error:', error);
      throw error;
    }

    // Transform to frontend format
    const updatedBrand = mapSingleBrandToFrontend(updatedBrandData);
    
    console.log('Brand updated successfully:', updatedBrand._id);
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
    console.log('Start deleting brand');
    const brandId = req.params.id;
    
    // Debug auth state
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('Current auth user:', user ? user.id : 'Not authenticated');
    console.log('Auth error:', authError);
    
    // Get service role for admin operations that bypass RLS
    console.log('Using service role for database operations to bypass RLS');
    const supabaseAdmin = supabase;
    
    // Check if brand exists and get image path
    const { data: brand, error: checkError } = await supabaseAdmin
      .from('brands')
      .select('logo')
      .eq('id', brandId)
      .single();
    
    if (checkError) {
      console.error('Error checking for existing brand:', checkError);
      if (checkError.code === 'PGRST116') {
        return res.status(404).json({ message: 'Brand not found' });
      }
      throw checkError;
    }

    console.log('Deleting brand from database');
    // Delete from database
    const { error } = await supabaseAdmin
      .from('brands')
      .delete()
      .eq('id', brandId);

    if (error) {
      console.error('Database delete error:', error);
      throw error;
    }

    // Delete image from storage if exists
    if (brand.logo) {
      console.log('Deleting brand image from storage');
      const fileName = brand.logo.split('/').pop();
      const { error: deleteImageError } = await supabaseAdmin.storage
        .from('brand-images')
        .remove([fileName]);
        
      if (deleteImageError) {
        console.log('Warning: Could not delete image:', deleteImageError);
        // Continue even if image deletion fails
      }
    }

    console.log('Brand deleted successfully');
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