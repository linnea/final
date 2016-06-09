'use strict';

var bcrypt = require('bcrypt-nodejs');

// getting users
//inserting var 
//validating, updating, or deleting 

var connPool;

var User = {
    // same as getAll : function() {}
    /*getAll() {
        var sql = 'select * from Users limit 50'
        return conn.queryAsync(sql)
    },*/
    findUser(user, loggingIn) {
        // finds the user with given email
        var sql = 'select * from Users WHERE Users.Email = (?)';
        var params = [user.email];
        return connPool.queryAsync(sql, params).then(function(results) {
            // if there are no users
                if (results.length === 0) {
                    console.log("username not found");
                    if (loggingIn) {
                        throw new Error('User does not exist');
                    }
                    return results;
                } else {
            // otherwise that email is in use 
                    user.taken = true;
                    if (bcrypt.compareSync(user.password, results[0].PassHash)) {
                        user.match = true;
                        console.log("They matched!");
                    } else {
                        user.match = false;
                        console.log("they didn't match");
                        if(loggingIn) {
                          throw new Error('Passwords did not match');  
                        }
                    }
                    return user;
            }
        }).catch(function(error) {
            console.error(error);
            
            return error;
        });
    },
   
    // ALLOWS USERS who have existing credentials to log in  just in case they forgot they've already made an account
    // restricts existing emails from being made with new credentials
    insert(user) {
        // if the user already exists, 
        return this.findUser(user)
            .then(function(result) {
                if (result.taken) {
                    // the username is already taken on signup
                    if (result.match) {
                        // if the user inputted correct credentials on signup
                        return result;
                    } else {
                        // otherwise, don't make an account
                        console.log("already in use");
                        throw new Error("That username is already in use.");
                    };
                }
            }).then(function(result) {
                console.log("inserting...");
                var sql = 'insert into Users (Email, FirstName, LastName, displayName, PassHash) values (?, ?, ?, ?, ?)';
        
                var hash = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
                
                var params = [user.email, user.firstName, user.lastName, user.firstName + ' ' + user.lastName, hash];
        
                return connPool.queryAsync(sql, params)
                    .then(function(results) {
                        console.log("results", results);
                    // select the row from db
                    sql = 'select * from Users where id=?';
                    // 
                    params = [results.insertId];  
                    return connPool.queryAsync(sql, params);
                    }).then(function(rows) {
                        console.log("ROWS " + rows);
                        return rows.length > 0 ? rows[0] : null;
                    });
            }).catch(function(error) {
                console.error(error);
            });
    },
    
    increaseCurrency(id) {
        var sql = 'update Users set currency = currency+1 where id=?';
        var params = [id];
        
        return connPool.queryAsync(sql, params)
            .then(function(results) {
                sql = 'select * from Users where id = ?';
                return connPool.queryAsync(sql, params)
            })
            .then(function(rows) {
                return rows.length > 0 ? rows[0] : null;
            });
    },
    generateHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    },

    // check if password is valid
    validPassword(password) {
        return bcrypt.compareSync(password, this.local.password);
    }
};

module.exports.Model = function(connectionPool) {
    // dependency injection
    // flexibly and reusable, and testable
    connPool = connectionPool;
    return User;
}