const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for the given user ID
 * @param {string} id - The user ID to encode in the token
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' } // Token expires in 30 days
  );
};

module.exports = generateToken; 