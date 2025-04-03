const bcrypt = require('bcryptjs');
const supabase = require('../utils/supabaseClient');
const generateToken = require('../utils/generateToken');
const { v4: uuidv4 } = require('uuid');

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
exports.getUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create a new user
 * @route   POST /api/admin/users
 * @access  Private/Admin
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate UUID for new user
    const userId = uuidv4();

    // Create new user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          name,
          email,
          password: hashedPassword,
          role: role || 'editor',
          created_at: new Date().toISOString()
        }
      ])
      .select('id, name, email, role')
      .single();

    if (error) throw error;

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .eq('id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'User not found' });
      }
      throw error;
    }

    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update user
 * @route   PUT /api/admin/users/:id
 * @access  Private/Admin
 */
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password, role } = req.body;
    
    // Check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return res.status(404).json({ message: 'User not found' });
      }
      throw checkError;
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    
    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    
    // Set updated timestamp
    updateData.updated_at = new Date().toISOString();

    // Update user
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select('id, name, email, role')
      .single();

    if (error) throw error;

    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const { data: user, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return res.status(404).json({ message: 'User not found' });
      }
      throw checkError;
    }

    // Prevent deleting yourself
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // Delete user
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) throw error;

    res.json({ message: 'User removed successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: error.message });
  }
}; 