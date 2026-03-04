const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./../models/userSchema.js');
const authenticate = require('../auth');

// POST REQUEST: Signup
router.post('/signup', async (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.email || !data.password) {
      return res.status(401).json({ message: 'name, email and password are mandatory' });
    }
    const newUser = new User(data);
    const response = await newUser.save();
    console.log('Data saved');
    res.status(200).json({
      message: 'Data saved',
      data: {
        _id: response._id,
        name: response.name,
        email: response.email,
        role: response.role
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const msg = Object.values(error.errors).map(v => v.message);
      return res.status(400).json({ message: 'Validation Error', msg: msg });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Duplication error', error: 'This email is already registered' });
    }
    res.status(500).json({ error: 'internal server error' });
  }
});

// POST REQUEST: Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials.' });
    const payload = {
      id: user._id,
      role: user.role
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET); // ← FIXED
    res.json({ token: token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET REQUEST: Current logged in user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(500).json({ error: 'internal server error' });
  }
});

// Update user
router.put('/update/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const UpdatedData = req.body;
    const response = await User.findByIdAndUpdate(userId, UpdatedData, {
      new: true,
      runValidators: true
    }).select('-password');
    if (!response) return res.status(404).json({ message: 'User not found' });
    console.log('Data Updated');
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user
router.delete('/delete/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await User.findByIdAndDelete(userId);
    if (!response) return res.status(404).json({ message: 'User not found' });
    console.log('Data Deleted');
    res.status(200).json({ message: 'Data removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
