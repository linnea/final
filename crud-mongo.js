'use strict';

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
   username: String,
   accounts: [{
       currency: {type: Number, default: 1000},
   }]
});

var User = mongoose.model('User', '')