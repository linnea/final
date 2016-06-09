'use strict';

var express = require('express');           //sub-routers 
var request = require('request');           //request URLs
var htmlparser = require('htmlparser2');    //parse html
var dbConfig = require('../secret/config-maria.json');
var app = express();
var passport = require('passport');
var bluebird = require('bluebird');
var mysql = require('mysql');
var connPool = bluebird.promisifyAll(mysql.createPool(dbConfig));

require('../config/passport')(app, passport, connPool);

module.exports.Router = function(users) {
    
    //create a new Express Router
    //an Express application is a router, but we can also
    //create sub-routers that we can add to the application
    //this router will handle all routes related to stories
    var router = express.Router();
    
    //GET /stories
    router.post('/users/login', passport.authenticate('local-login', {
        successRedirect : '/profile'
    }));
    
    //POST new user
    router.post('/users', function(req, res, next) {
        //insert a new story into the database
        //and return the data with default values
        //applied
        console.log("req body" + req.body);
        users.insert(req.body)
            .then(function(row) {
                req.login(row, function(err) {
                    if (err) { 
                        return next(err); 
                    }
                    res.json(row);
                });
            })
            .catch(next);
    });
    
    //POST /stories/1234/votes
    //the :id is like a wildcard--it matches any value
    //and express will make the value it matches available as req.params.id
    router.post('/users/:id/currency', function(req, res, next) {
        //upvote the story and return the
        //full story with current number of votes
        //the property on req.params will have the same name as whatever
        //you had following the : in the URL
        users.increaseCurrency(req.params.id)
            .then(function(row) {
                res.json(row);
            })
            .catch(next);
    });
    
    return router;
};


module.exports.authRouter = function(users) {
    var router = express.Router();
    // only called if user is authed
    return router;
};