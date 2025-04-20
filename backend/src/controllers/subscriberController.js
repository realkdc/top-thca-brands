const supabase = require('../utils/supabaseClient');
const crypto = require('crypto');

// Subscribe to newsletter
const subscribe = async (req, res) => {
  const { email, name, source } = req.body;
  
  // Validate email
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Valid email is required' });
  }
  
  try {
    // Generate confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    
    // Get IP address from request
    const ipAddress = req.headers['x-forwarded-for'] || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress || 
                     req.connection.socket?.remoteAddress;
    
    // Check if the email already exists
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('subscribers')
      .select('id, confirmed, unsubscribed')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking subscriber:', checkError);
      return res.status(500).json({ 
        success: false, 
        message: 'Error processing your request. Please try again.' 
      });
    }
    
    // If subscriber exists but is unsubscribed, resubscribe them
    if (existingSubscriber) {
      if (existingSubscriber.unsubscribed) {
        const { error: updateError } = await supabase
          .from('subscribers')
          .update({ 
            unsubscribed: false, 
            unsubscribed_at: null,
            confirmation_token: confirmationToken,
            confirmed: false,
            name: name || existingSubscriber.name
          })
          .eq('id', existingSubscriber.id);
        
        if (updateError) {
          console.error('Error updating subscriber:', updateError);
          return res.status(500).json({ 
            success: false, 
            message: 'Error processing your request. Please try again.' 
          });
        }
        
        return res.status(200).json({
          success: true,
          message: 'You have been resubscribed to our newsletter!',
          data: { email, requiresConfirmation: true }
        });
      }
      
      // If already subscribed and confirmed
      if (existingSubscriber.confirmed) {
        return res.status(200).json({
          success: true,
          message: 'You are already subscribed to our newsletter!',
          data: { email, alreadySubscribed: true }
        });
      }
      
      // If already subscribed but not confirmed
      return res.status(200).json({
        success: true,
        message: 'Please check your email to confirm your subscription.',
        data: { email, requiresConfirmation: true }
      });
    }
    
    // Add new subscriber
    const { data, error } = await supabase
      .from('subscribers')
      .insert([
        { 
          email: email.toLowerCase(),
          name,
          source,
          ip_address: ipAddress,
          confirmation_token: confirmationToken
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating subscriber:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error processing your request. Please try again.' 
      });
    }
    
    // In a real system, you would send a confirmation email here
    // For now, we'll just confirm them automatically
    const { error: confirmError } = await supabase
      .from('subscribers')
      .update({ confirmed: true })
      .eq('id', data.id);
    
    if (confirmError) {
      console.error('Error confirming subscriber:', confirmError);
    }
    
    res.status(201).json({
      success: true,
      message: 'You have been subscribed to our newsletter!',
      data: { email }
    });
  } catch (error) {
    console.error('Error in subscribe controller:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing your request. Please try again.' 
    });
  }
};

// Unsubscribe from newsletter
const unsubscribe = async (req, res) => {
  const { email, token } = req.query;
  
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }
  
  try {
    // Update subscriber
    const { error } = await supabase
      .from('subscribers')
      .update({ 
        unsubscribed: true, 
        unsubscribed_at: new Date().toISOString() 
      })
      .eq('email', email.toLowerCase());
    
    if (error) {
      console.error('Error unsubscribing:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error processing your request. Please try again.' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'You have been unsubscribed from our newsletter.'
    });
  } catch (error) {
    console.error('Error in unsubscribe controller:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing your request. Please try again.' 
    });
  }
};

module.exports = {
  subscribe,
  unsubscribe
}; 