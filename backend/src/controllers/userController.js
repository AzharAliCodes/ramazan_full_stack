const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findByEmail, findByUucms, createUser } = require('../models/userModel');
const { successResponse, errorResponse } = require('../utils/response');

// POST /api/auth/signup
const signup = async (req, res, next) => {
  try {
    const { name, email, password, uucms, stream, year, gender } = req.body;

    // Validate required fields
    if (!name || !email || !password || !uucms) {
      return errorResponse(res, 400, 'Name, email, password and UUCMS are required.');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse(res, 400, 'Please provide a valid email address.');
    }

    // Validate password length
    if (password.length < 4) {
      return errorResponse(res, 400, 'Password must be at least 4 characters.');
    }

    // Validate gender
    if (gender && !['male', 'female'].includes(gender)) {
      return errorResponse(res, 400, 'Gender must be either male or female.');
    }

    // Validate year
    if (year && ![1, 2, 3, '1', '2', '3'].includes(year)) {
      return errorResponse(res, 400, 'Year must be 1, 2, or 3.');
    }

    // Check if email already exists
    const existingEmail = await findByEmail(email);
    if (existingEmail) {
      return errorResponse(res, 409, 'An account with this email already exists.');
    }

    // Check if UUCMS already exists
    const existingUucms = await findByUucms(uucms);
    if (existingUucms) {
      return errorResponse(res, 409, 'An account with this UUCMS number already exists.');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      uucms,
      stream,
      year,
      gender,
    });

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    return successResponse(res, 201, 'Account created successfully!', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        uucms: user.uucms,
        stream: user.stream,
        year: user.year,
        gender: user.gender,
      },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    next(error);
  }
};

// POST /api/auth/signin
const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return errorResponse(res, 400, 'Email and password are required.');
    }

    // Find user
    const user = await findByEmail(email);
    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password.');
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid email or password.');
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    return successResponse(res, 200, 'Signed in successfully!', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        uucms: user.uucms,
        stream: user.stream,
        year: user.year,
        gender: user.gender,
      },
      token,
    });
  } catch (error) {
    console.error('Signin error:', error.message);
    next(error);
  }
};

module.exports = { signup, signin };
