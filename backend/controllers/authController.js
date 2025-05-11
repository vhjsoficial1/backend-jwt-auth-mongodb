const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');

const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (password.length < 6) {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'Password must be at least 6 characters' 
      });
    }

    const newUser = await User.create({ name, email, password });
    newUser.password = undefined;
    
    const token = signToken(newUser._id);
    
    console.log(`New user registered: ${email}`);
    res.status(201).json({ status: 'success', token, data: { user: newUser } });

  } catch (err) {
    console.error('Registration error:', err.message);
    
    if (err.code === 11000) {
      return res.status(400).json({ status: 'fail', message: 'Email already in use' });
    }
    
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'Please provide email and password' 
      });
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      console.log(`Failed login attempt for: ${email}`);
      return res.status(401).json({ 
        status: 'fail', 
        message: 'Incorrect email or password' 
      });
    }

    const token = signToken(user._id);
    user.password = undefined;
    
    console.log(`User logged in: ${email}`);
    res.status(200).json({ status: 'success', token, data: { user } });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        status: 'fail', 
        message: 'You are not logged in! Please log in.' 
      });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    
    if (!currentUser) {
      return res.status(401).json({ 
        status: 'fail', 
        message: 'User no longer exists' 
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    console.error('Protect middleware error:', err.message);
    res.status(401).json({ status: 'fail', message: 'Invalid token' });
  }
};