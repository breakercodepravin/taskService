const express = require('express');
const { body } = require('express-validator/check');
const auth = require('../middleware/auth')

const contactController = require('../controllers/contact');

const router = express.Router();

router.get('/test', contactController.test);

router.get('/', auth, contactController.getAllContact);

router.get('/:id', auth, contactController.getContact)

router.post('/', auth, contactController.createContact);

router.put('/:id', auth, contactController.updateContact)

router.delete('/:id', auth, contactController.deleteContact);

module.exports = router ;