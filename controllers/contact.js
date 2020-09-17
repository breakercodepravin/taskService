const { validationResult } = require("express-validator/check");
const Contact = require("../models/Contact");
const contact = require("../validation/contact");
const validateContactInput = require('../validation/contact');

exports.test = (req, res) => res.json({ msg: 'Contact Works'})

exports.getAllContact = (req, res) => {
    Contact.find()
    .then(contacts => {
        return res.json(contacts);
    })
    .catch(err => res.status(404).json({ nocontactsfound: 'No contacts found' }));
}

exports.getContact = (req, res) => {
    Contact.findById(req.params.id)
    .then(contact => {
        return res.json(contact)
    })
    .catch(err => res.status(404).json({ nocontactsfound: 'No contacts found' }));
}

exports.createContact = (req, res) => {
    const { errors, isValid } = validateContactInput(req.body);
    // Check Validation
    if (!isValid) {
        // If any errors, send 400 with errors object
        return res.status(400).json(errors);
    }

    const newContact = new Contact({
        name: req.body.name,
        number: req.body.number,
        details: req.body.details,
        location: req.body.location,
        user: req.user.id
    })
    newContact.save().then(contact => res.json(contact));
}

exports.updateContact = (req, res) => {
    const updatedName = req.body.name;
    const updatedNumber = req.body.number;
    const updatedDetails = req.body.details;
    const updatedLocation = req.body.location;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }

    Contact.findById(req.params.id)
    .then(contact => {
        if(contact.user.toString() !== req.user.id) {
            return res
            .status(401)
            .json({ notauthorized: 'User not authorized' });
        }
        contact.name = updatedName? updatedName: contact.name;
        contact.number = updatedNumber? updatedNumber: contact.number;
        contact.details = updatedDetails ? updatedDetails: contact.details;
        contact.location = updatedLocation ? updatedLocation: contact.location;
        return contact.save().then(() => res.json(contact));     
    })
    .catch(err => res.status(404).json({ contactnotfound: 'No contact found' }));
}

exports.deleteContact = (req, res) => {
    Contact.findById(req.params.id)
    .then(contact => {
        if(contact.user.toString() !== req.user.id) {
            return res
            .status(401)
            .json({ notauthorized: 'User not authorized' });
        }

        // Delete
        contact.remove().then(() => res.json({ success: true }));
    })
    .catch(err => res.status(404).json({ contactnotfound: 'No contact found' }));
}