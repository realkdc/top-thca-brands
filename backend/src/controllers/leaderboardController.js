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
    
    // Add EXTREME debugging to see what's happening
    console.log('-------------------- RATING SUBMISSION --------------------');
    console.log('Raw request body:', JSON.stringify(req.body));
    console.log('Brand ID:', brandId);
    
    // Extract values directly - simpler approach
    const potencyRating = Number(req.body.potency_rating);
    const flavorRating = Number(req.body.flavor_rating);
    const effectsRating = Number(req.body.effects_rating);
    const valueRating = Number(req.body.value_rating);
    const overallRating = Number(req.body.overall_rating);
    const comment = req.body.comment || '';
    
    console.log('Parsed rating values:');
    console.log('- potencyRating:', potencyRating);
    console.log('- flavorRating:', flavorRating);
    console.log('- effectsRating:', effectsRating);
    console.log('- valueRating:', valueRating);
    console.log('- overallRating:', overallRating);
    
    // Get a fresh Supabase client to ensure proper authentication
    const freshClient = getSupabaseClient();
    
    // Basic validation
    if (isNaN(potencyRating) || isNaN(flavorRating) || isNaN(effectsRating) || 
        isNaN(valueRating) || isNaN(overallRating)) {
      console.log('VALIDATION ERROR: Invalid number values');
      return res.status(400).json({ 
        message: 'All ratings must be valid numbers' 
      });
    }
    
    // Validate rating range
    const ratings = [potencyRating, flavorRating, effectsRating, valueRating, overallRating];
    for (const rating of ratings) {
      if (rating < 1 || rating > 10) {
        console.log('VALIDATION ERROR: Rating out of range:', rating);
        return res.status(400).json({ 
          message: 'All ratings must be between 1 and 10' 
        });
      }
    }
    
    // Get user IP address for tracking unique votes
    const userIp = req.headers['x-forwarded-for'] || 
                   req.connection.remoteAddress || 
                   req.socket.remoteAddress || 
                   'unknown';
    
    console.log('User IP:', userIp);
    
    // Check if brand exists
    console.log('Checking if brand exists:', brandId);
    const { data: brandData, error: brandError } = await freshClient
      .from('brands')
      .select('id')
      .eq('id', brandId)
      .single();
      
    if (brandError) {
      console.log('Brand error:', brandError);
      if (brandError.code === 'PGRST116') {
        return res.status(404).json({ message: 'Brand not found' });
      }
      throw brandError;
    }
    
    // Check if user has already rated this brand
    console.log('Checking for existing rating from IP:', userIp);
    const { data: existingRating, error: ratingError } = await freshClient
      .from('brand_ratings')
      .select('id')
      .eq('brand_id', brandId)
      .eq('user_ip', userIp)
      .maybeSingle();
      
    if (ratingError && ratingError.code !== 'PGRST116') {
      console.log('Rating lookup error:', ratingError);
      throw ratingError;
    }
    
    // Prepare rating data
    const ratingData = {
      potency_rating: potencyRating,
      flavor_rating: flavorRating,
      effects_rating: effectsRating,
      value_rating: valueRating, 
      overall_rating: overallRating,
      comment
    };
    
    let result;
    
    if (existingRating) {
      // Update existing rating
      console.log('Updating existing rating:', existingRating.id);
      const { data, error } = await freshClient
        .from('brand_ratings')
        .update(ratingData)
        .eq('id', existingRating.id)
        .select()
        .single();
        
      if (error) {
        console.log('Update error:', error);
        throw error;
      }
      
      result = data;
      
    } else {
      // Create new rating
      console.log('Creating new rating for brand:', brandId);
      const insertData = {
        brand_id: brandId,
        user_ip: userIp,
        ...ratingData
      };
      
      const { data, error } = await freshClient
        .from('brand_ratings')
        .insert([insertData])
        .select()
        .single();
        
      if (error) {
        console.log('Insert error:', error);
        throw error;
      }
      
      result = data;
    }
    
    console.log('Rating saved successfully!');
    
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