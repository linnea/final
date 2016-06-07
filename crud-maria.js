'use strict';

var mysql = require('mysql');
var bluebird = require('bluebird');
// load connection info
var dbConfig = require('./secret/config-maria.json');
var bcrypt = require('bcrypt-nodejs');


var conn = bluebird.promisifyAll(mysql.createConnection(dbConfig));

function logRow(row) {
    console.log(row);
}

function createUser(username, firstName, lastName, email, password) {
    // create salt
    var salt = bcrypt.genSaltSync(10);
    // Hash the password with the salt
    var hash = bcrypt.hashSync(password, salt);
    var sql = "insert into Users (UserName, FirstName, LastName, Email, PassSalt, PassHash) values (?)";
    var params = [username, firstName, lastName, email, salt,hash];
    conn.queryAsync(sql, params)
    .then(function(results) {
        console.log('row inserted, new id = %s', results.insertId);
        id = results.insertId;
        return conn.queryAsync('select * from Users where id=?', [results.insertId]);
    })
    .then(function(rows) {
        logRow(rows[0]);
        return conn.queryAsync('update Users set currency = currency+1 where id = ?', [id])
    })
    .then(function(results) {
        console.log('%d rows affected', results.affectedRows);
        return conn.queryAsync('select * from Users where id=?', [id]);
    })
    .then(function(rows) {
        logRow(rows[0]);
    })
    .then(function() {
        conn.end();
    })
    .catch(function(err) {
        console.error(err);
        conn.end();
    });
}

createUser('linneakw', 'linnea', 'Watson', 'linnea_watsonhotmail.com', 'password');