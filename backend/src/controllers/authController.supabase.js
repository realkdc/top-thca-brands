const bcrypt = require('bcryptjs');
const supabase = require('../utils/supabaseClient');
const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for the given user ID
 * @param {string} id - The user ID to encode in the token
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'your-jwt-secret',
    { expiresIn: '30d' }
  );
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const { data: existingUsers } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .limit(1);

    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'editor' // Default role
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error when fetching users:', error);
      throw error;
    }

    // Generate JWT
    const token = generateToken(user.id);

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(`Login attempt for email: ${email}`);

    // Check if user exists - ignore case for email
    const { data: users, error } = await supabase
      .from('users')
      .select('*');
      
    if (error) throw error;
    
    console.log(`Found ${users ? users.length : 0} total users in the database`);
    
    // Find user with case-insensitive match
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      console.log('No matching user found with this email');
      return res.status(401).json({ message: 'Invalid credentials (user not found)' });
    }
    
    console.log(`Found user: ${user.name} (${user.email}) with role: ${user.role}`);

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password match result: ${isMatch}`);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials (password mismatch)' });
    }

    // Generate JWT
    const token = generateToken(user.id);
    console.log('Login successful, token generated');

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Login error:', JSON.stringify(error, null, 2));
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
exports.getUserProfile = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('id', req.user.id)
      .single();
    
    if (error) throw error;
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
exports.updateUserProfile = async (req, res) => {
  try {
    // Prepare update data
    const updateData = {
      name: req.body.name,
      email: req.body.email,
      updated_at: new Date().toISOString()
    };

    // If password is provided, hash it
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }

    // Update user in database
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', req.user.id)
      .select()
      .single();
    
    if (error) throw error;

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new token
    const token = generateToken(updatedUser.id);

    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: error.message });
  }
}; 