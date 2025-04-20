const supabase = require('../utils/supabaseClient');

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
    const { data, error } = await supabase
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
    
    // Get user IP address for tracking unique votes
    const userIp = req.headers['x-forwarded-for'] || 
                   req.connection.remoteAddress || 
                   req.socket.remoteAddress || 
                   req.connection.socket.remoteAddress || 
                   'unknown';
    
    // Validate ratings
    const ratings = [
      potency_rating, 
      flavor_rating, 
      effects_rating, 
      value_rating, 
      overall_rating
    ];
    
    for (const rating of ratings) {
      if (rating && (rating < 1 || rating > 10)) {
        return res.status(400).json({ 
          message: 'All ratings must be between 1 and 10' 
        });
      }
    }
    
    // Check if brand exists
    const { data: brandData, error: brandError } = await supabase
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
    const { data: existingRating, error: ratingError } = await supabase
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
      const { data, error } = await supabase
        .from('brand_ratings')
        .update({
          potency_rating,
          flavor_rating,
          effects_rating,
          value_rating, 
          overall_rating,
          comment
        })
        .eq('id', existingRating.id)
        .select()
        .single();
        
      if (error) throw error;
      result = data;
      
    } else {
      // Create new rating
      const { data, error } = await supabase
        .from('brand_ratings')
        .insert([
          {
            brand_id: brandId,
            user_ip: userIp,
            potency_rating,
            flavor_rating,
            effects_rating,
            value_rating,
            overall_rating,
            comment
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    }
    
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
    const { data: lists, error } = await supabase
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
    
    if (vote !== 'up' && vote !== 'down') {
      return res.status(400).json({ message: "Vote must be 'up' or 'down'" });
    }
    
    // Get the item
    const { data: item, error: itemError } = await supabase
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
      
    const { data, error } = await supabase
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