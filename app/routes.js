
module.exports = function(app, passport) {
    // tutorial referenced 
    // https://scotch.io/tutorials/easy-node-authentication-setup-and-local
    var express = require('express');
    
    /*
    // public files
    app.use(express.static(__dirname + '/static/public'));
    app.use(express.static(__dirname + '/static/secure')); 
    */
    // HOME PAGE
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });
    
    // LOG IN
    app.get('/login', function(req, res) {
        res.render('login.ejs');
    });    
    
    // SIGN UP
    app.get('/signup', function(req, res) {
        res.render('signup.ejs');
    });
    
    // PROFILE
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user: req.user
        });
    });
    
    // LOGOUT
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    
    // GITHUB
    app.get('/signin/github', passport.authenticate('github'));
    app.get('/signin/github/callback', passport.authenticate('github'), 
        function(req, res) {
            res.redirect('/secure.html');
        });
        
  
    
    // private access
    /*
    app.use(function(req, res, next) {
            //req.isAuthenticated()
            if (req.isAuthenticated()) {
                next();
            } else {
                // notify the user they're not allowed to access
            }
        });
        */
    function isLoggedIn(req, res, next) {
        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
       
    }
    
    
}
