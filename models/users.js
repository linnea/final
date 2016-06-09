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
    findUser(user) {
        // finds the user with given email
        var sql = 'select * from Users WHERE Users.Email = (?)';
        var params = [user.email];
        return connPool.queryAsync(sql, params).then(function(results) {
                if (results.length === 0) {
                    console.log("username not found");
                    return new Error("username not found");
                }
                var currUser = results[0];
                console.log(currUser);
                if (bcrypt.compareSync(user.password, currUser.PassHash)) {
                    console.log("They matched!");
                    return user;
                } else {
                    console.log("they didn't match");
                    return new Error("Password didn't match");
                }
            });
    },
    insert(user) {
        // VALIDATE HERE 
        var sql = 'insert into Users (Email, FirstName, LastName, PassHash) values (?, ?)';
        
        var hash = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
        
        var params = [user.email, user.firstName, user.lastName, hash];
  
        return connPool.queryAsync(sql, params)
            .then(function(results) {
              // select the row from db
              sql = 'select * from Users where id=?';
              // 
              params = [results.insertId];  
              return connPool.queryAsync(sql, params);
            })
            .then(function(rows) {
                console.log(rows);
                return rows.length > 0 ? rows[0] : null;
            })
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