const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.registerUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  return await User.create(userData);
};

exports.loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Incorrect email or password');
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  return { token, user };
};

exports.verifyToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  
  if (!user) {
    throw new Error('User not found');
  }

  return user;
};