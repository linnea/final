'use strict';

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var bluebird = require('bluebird');
var mysql = require('mysql');
var dbConfig = require('./secret/config-maria.json');
var connPool = bluebird.promisifyAll(mysql.createPool(dbConfig));

var finalApi = require('./controllers/final-api');
var User = require('./models/users.js').Model(connPool);

var app = express();
// require passport authentication strategies
require('./config/passport')(app, passport, connPool, User);
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/static'));

app.use(morgan('dev'));

// parse JSON post bodies
// puts on body of request, req.body as fully parsed version
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
    
app.set('views', __dirname + '/static/views');


app.listen(80, function() {
        console.log("server is listening");
    });
    
// API ROUTES
app.use('/api/v1', finalApi.Router(User));

// EVERYTHING BELOW HERE IS SECURED/LOGGED IN
require('./app/routes.js')(app, passport);

app.use('/api/v1', finalApi.authRouter(User));