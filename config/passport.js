var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var LocalStrategy = require('passport-local').Strategy;

module.exports = function(app, passport, connection, users) {
    // set cookie
    var cookieSigSecret = process.env.COOKIE_SIG_SECRET;
    if(!cookieSigSecret) {
        console.error('Please set COOKIE_SIG_SECRET');
        process.exit(1);
    }

    // serialization and deserialization
    passport.serializeUser(function(user, done) {
        // after user authenticated by strategy
        // before writes user to session store
        // only once after authentication
        
        // SHOULD only serialize user id, not the entire user
    
    
        done(null, user); 
    });

    // called at every request to server
    passport.deserializeUser(function(user, done) {
        done(null, user); 
    });


    // set session
    app.use(session({
        secret: cookieSigSecret,
        resave: false,
        saveUninitialized: false
        //store: new RedisStore()
        //{host: 'ec2-52-40-242-0.us-west-2.compute.amazonaws.com'}
    }));

    ///////////////////////
    // LOCAL STRATEGY /////
    ///////////////////////
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            
            var user = {
                email: email,
                password: password
            };
            users.findUser(user).done(function(res) {
                if (res.email) {
                    return done(null, user);
                } else {
                    return new Error('user not found');
                }
                
            });
        })
    }
));
 

    ///////////////////////
    // GITHUB STRATEGY ////
    ///////////////////////
    var GitHubStrategy = require('passport-github').Strategy;

    var ghConfig = require('../secret/oauth-github.json');
    ghConfig.callbackURL = '/signin/github/callback';

    var ghStrategy = new GitHubStrategy(ghConfig, 
        function(accessToken, refreshToken, profile, done) {
            console.log('Authentication Successful!');
            console.dir(profile);
            
            // create user and insert information
            // into memberships profile
            done(null, profile);
        });
        
    passport.use(ghStrategy);


    ///////////////////////////////
    /// INITIALIZE & SET SESSION //
    ///////////////////////////////
    app.use(passport.initialize());
    app.use(passport.session());
}
