const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Brand name is required'],
    trim: true,
    maxlength: [100, 'Brand name cannot be more than 100 characters']
  },
  image: {
    type: String,
    required: [true, 'Brand image is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Flower', 'Concentrate', 'Edibles', 'Vape', 'Other']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  featured: {
    type: Boolean,
    default: false
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  website: {
    type: String,
    trim: true
  },
  productTypes: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Create slug from name before saving
BrandSchema.pre('save', function(next) {
  this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  next();
});

module.exports = mongoose.model('Brand', BrandSchema); 