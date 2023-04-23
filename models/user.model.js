const mongoose = require('mongoose');

// definition of schema for users
const userSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
   },
  login: {
    type: String,
    required: true,
    unique: true
  },
  password : {
    type : String,
    required : true
   },
  borrowedObjects: {
    type: [{
      type: mongoose.ObjectId,
      ref: 'Object'
    }]
  }
});

// exports the schema
module.exports = userSchema;

// model
const dbConnection = require('../controllers/db.controller');
const User = dbConnection.model('User', userSchema, 'users');

module.exports.model = User;


