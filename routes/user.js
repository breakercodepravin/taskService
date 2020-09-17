const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/user');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/test', userController.test);

router.get('/current', auth ,userController.getCurrentUser)

router.post('/register', userController.createUser);

router.post('/login', userController.getUser);

module.exports = router ;