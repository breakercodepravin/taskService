const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ContactSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
      },
    name: {
        type: String,
        required:true
    },
    number: {
        type: Number,
        required:true
    },
    location: {
        type: String,
    },
    details: {
        ICC: {
            type: Number
        },
        OCC: {
            type: Number
        },
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = User = mongoose.model('contact', ContactSchema);