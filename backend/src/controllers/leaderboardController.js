const supabaseModule = require('../utils/supabaseClient');
const supabase = supabaseModule;
const getSupabaseClient = supabaseModule.getSupabaseClient;

/**
 * Maps Supabase leaderboard data to frontend format
 */
function mapLeaderboardToFrontend(data) {
  return data.map(brand => ({
    _id: brand.id,
    name: brand.name,
    image: brand.logo || '',
    description: brand.description || '',
    website: brand.website_url || '',
    productTypes: brand.product_types || [],
    ratings: {
      potency: parseFloat(brand.avg_potency) || 0,
      flavor: parseFloat(brand.avg_flavor) || 0,
      effects: parseFloat(brand.avg_effects) || 0,
      value: parseFloat(brand.avg_value) || 0,
      overall: parseFloat(brand.avg_overall) || 0
    },
    totalRatings: parseInt(brand.total_ratings) || 0
  }));
}

/**
 * @desc    Get brand leaderboard
 * @route   GET /api/leaderboard
 * @access  Public
 */
exports.getLeaderboard = async (req, res) => {
  try {
    // Check if we have a valid session
    console.log('Getting leaderboard data...');
    
    // Get a fresh Supabase client to ensure proper authentication
    const freshClient = getSupabaseClient();
    
    // Verify supabase connection is valid
    try {
      const { data: healthCheck, error: healthError } = await freshClient.from('brands').select('count');
      if (healthError) {
        console.error('Supabase health check failed:', healthError);
        throw healthError;
      }
      console.log('Supabase connection verified successfully');
    } catch (connError) {
      console.error('Failed to verify Supabase connection:', connError);
      // Continue anyway as we'll try the main query
    }

    const { data, error } = await freshClient
      .from('brand_leaderboard')
      .select('*');

    if (error) throw error;

    // Transform to frontend format
    const leaderboard = mapLeaderboardToFrontend(data);
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Rate a brand
 * @route   POST /api/brands/:id/rate
 * @access  Public
 */
exports.rateBrand = async (req, res) => {
  try {
    const brandId = req.params.id;
    const { 
      potency_rating, 
      flavor_rating, 
      effects_rating, 
      value_rating, 
      overall_rating,
      comment 
    } = req.body;
    
    // Get a fresh Supabase client to ensure proper authentication
    const freshClient = getSupabaseClient();
    
    // Verify supabase connection before proceeding
    console.log('Verifying Supabase connection before rating brand...');
    try {
      const { data: healthCheck, error: healthError } = await freshClient.from('brands').select('count');
      if (healthError) {
        console.error('Supabase health check failed:', healthError);
        throw healthError;
      }
      console.log('Supabase connection verified successfully');
    } catch (connError) {
      console.error('Failed to verify Supabase connection:', connError);
      // Continue anyway as we'll try the main operations
    }
    
    // Get user IP address for tracking unique votes
    const userIp = req.headers['x-forwarded-for'] || 
                   req.connection.remoteAddress || 
                   req.socket.remoteAddress || 
                   req.connection.socket.remoteAddress || 
                   'unknown';
    
    // Ensure all ratings are provided and are numeric values
    if (!potency_rating || !flavor_rating || !effects_rating || !value_rating || !overall_rating) {
      return res.status(400).json({ 
        message: 'All ratings must be provided (potency, flavor, effects, value, and overall)' 
      });
    }
    
    // Convert to numbers if they're strings
    const potencyRating = Number(potency_rating);
    const flavorRating = Number(flavor_rating);
    const effectsRating = Number(effects_rating);
    const valueRating = Number(value_rating);
    const overallRating = Number(overall_rating);
    
    // Validate that all converted values are actual numbers
    if (isNaN(potencyRating) || isNaN(flavorRating) || isNaN(effectsRating) || 
        isNaN(valueRating) || isNaN(overallRating)) {
      return res.status(400).json({ 
        message: 'All ratings must be valid numbers' 
      });
    }
    
    // Validate ratings
    const ratings = [
      potencyRating, 
      flavorRating,
      effectsRating,
      valueRating,
      overallRating
    ];
    
    for (const rating of ratings) {
      if (rating < 1 || rating > 10) {
        return res.status(400).json({ 
          message: 'All ratings must be between 1 and 10' 
        });
      }
    }
    
    // Check if brand exists
    const { data: brandData, error: brandError } = await freshClient
      .from('brands')
      .select('id')
      .eq('id', brandId)
      .single();
      
    if (brandError) {
      if (brandError.code === 'PGRST116') {
        return res.status(404).json({ message: 'Brand not found' });
      }
      throw brandError;
    }
    
    // Check if user has already rated this brand
    const { data: existingRating, error: ratingError } = await freshClient
      .from('brand_ratings')
      .select('id')
      .eq('brand_id', brandId)
      .eq('user_ip', userIp)
      .maybeSingle();
      
    if (ratingError && ratingError.code !== 'PGRST116') {
      throw ratingError;
    }
    
    let result;
    
    if (existingRating) {
      // Update existing rating
      const { data, error } = await freshClient
        .from('brand_ratings')
        .update({
          potency_rating: potencyRating,
          flavor_rating: flavorRating,
          effects_rating: effectsRating,
          value_rating: valueRating, 
          overall_rating: overallRating,
          comment
        })
        .eq('id', existingRating.id)
        .select()
        .single();
        
      if (error) throw error;
      result = data;
      
    } else {
      // Create new rating
      const { data, error } = await freshClient
        .from('brand_ratings')
        .insert([
          {
            brand_id: brandId,
            user_ip: userIp,
            potency_rating: potencyRating,
            flavor_rating: flavorRating,
            effects_rating: effectsRating,
            value_rating: valueRating,
            overall_rating: overallRating,
            comment
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    }
    
    // Fix for debugging - confirm what values were saved
    console.log('Rating saved:', {
      id: result.id,
      potency: result.potency_rating,
      flavor: result.flavor_rating, 
      effects: result.effects_rating,
      value: result.value_rating,
      overall: result.overall_rating
    });
    
    res.status(201).json({
      success: true,
      message: existingRating ? 'Rating updated successfully' : 'Rating submitted successfully',
      data: result
    });
    
  } catch (error) {
    console.error('Rate brand error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get brand lists
 * @route   GET /api/lists
 * @access  Public
 */
exports.getBrandLists = async (req, res) => {
  try {
    // Get a fresh Supabase client to ensure proper authentication
    const freshClient = getSupabaseClient();
    
    const { data: lists, error } = await freshClient
      .from('brand_lists')
      .select(`
        *,
        items:brand_list_items(
          *,
          brand:brands(*)
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Transform to frontend format
    const transformedLists = lists.map(list => ({
      _id: list.id,
      title: list.title,
      description: list.description,
      items: list.items.map(item => ({
        _id: item.id,
        position: item.position,
        upvotes: item.upvotes,
        downvotes: item.downvotes,
        brand: {
          _id: item.brand.id,
          name: item.brand.name,
          image: item.brand.logo || '',
          description: item.brand.description || '',
          website: item.brand.website_url || '',
          productTypes: item.brand.product_types || []
        }
      })).sort((a, b) => a.position - b.position)
    }));
    
    res.json(transformedLists);
  } catch (error) {
    console.error('Get brand lists error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Vote on a brand list item
 * @route   POST /api/lists/:listId/items/:itemId/vote
 * @access  Public
 */
exports.voteOnListItem = async (req, res) => {
  try {
    const { listId, itemId } = req.params;
    const { vote } = req.body;
    
    // Get a fresh Supabase client to ensure proper authentication
    const freshClient = getSupabaseClient();
    
    if (vote !== 'up' && vote !== 'down') {
      return res.status(400).json({ message: "Vote must be 'up' or 'down'" });
    }
    
    // Get the item
    const { data: item, error: itemError } = await freshClient
      .from('brand_list_items')
      .select('*')
      .eq('id', itemId)
      .eq('list_id', listId)
      .single();
      
    if (itemError) {
      if (itemError.code === 'PGRST116') {
        return res.status(404).json({ message: 'List item not found' });
      }
      throw itemError;
    }
    
    // Update vote count
    const updateData = vote === 'up' 
      ? { upvotes: item.upvotes + 1 }
      : { downvotes: item.downvotes + 1 };
      
    const { data, error } = await freshClient
      .from('brand_list_items')
      .update(updateData)
      .eq('id', itemId)
      .select()
      .single();
      
    if (error) throw error;
    
    res.json({
      success: true,
      message: `Vote recorded successfully`,
      data
    });
    
  } catch (error) {
    console.error('Vote on list item error:', error);
    res.status(500).json({ message: error.message });
  }
}; 