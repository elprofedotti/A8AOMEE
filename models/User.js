const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  profilePicture: String,
  facebookId: String,
  googleId: String,
  isSeller: { type: Boolean, default: false },
  sellerRating: { type: Number, default: 0 },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  preferences: {
    categories: [String],
    maxDistance: Number
  },
  notifications: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true }
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);