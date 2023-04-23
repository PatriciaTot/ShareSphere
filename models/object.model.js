const mongoose = require('mongoose');

// definition of schema for objects
const objectSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  isBorrowed: {
    type: Boolean,
    default: false
  },
  borrower: {
    type: mongoose.ObjectId,
    ref: 'User',
    default: null
  }
});

// exports the schema
const dbConnection = require('../controllers/db.controller');
const Object = dbConnection.model('Object', objectSchema);

module.exports = { model: Object };
