const User = require("../models/User");
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require("config");
const secretOrKey = config.get('jwtSecret'); 

// Load Input Validation
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
exports.test = (req, res) => res.json({ msg: 'Users Works' });


exports.getCurrentUser =(req, res) => {
    User.findById(req.user.id,'-password')
    .then(user => {
        return res.json(user);
    })
    .catch(err => res.status(404).json({ nouserfound: 'No user found' }));
  }

// @route   GET api/users/register
// @desc    Register user
// @access  Public
 exports.createUser = (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
  
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200', // Size
          r: 'pg', // Rating
          d: 'mm' // Default
        });
  
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });
  
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
  }

  // @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
exports.getUser = (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
  
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  
    const email = req.body.email;
    const password = req.body.password;
  
    // Find user by email
    User.findOne({ email }).then(user => {
      // Check for user
      if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }
  
      // Check Password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User Matched
          const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT Payload
  
          // Sign Token
          jwt.sign(
            payload,
            secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              });
            }
          );
        } else {
          errors.password = 'Password incorrect';
          return res.status(400).json(errors);
        }
      });
    });
  }