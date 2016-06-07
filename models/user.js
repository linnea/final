'use strict';

// getting users
//inserting var 
//validating, updating, or deleting 

var connPool;

var User = {
    // same as getAll : function() {}
    getAll() {
        var sql = 'select * from Users limit 50'
        return conn.queryAsync(sql)
    },
    findEmail(email, password, callback) {
        // finds the user with given email
        var sql = 'select * from Users WHERE User.Email = (?)';
        var params = [email];
        conn.queryAsync(sql, params, function(err, results) {
            if (err) return callback(err);
            if (results.length === 0) return callback();
            
            var user = results[0];
            
            if (!bcrypt.compareSync(password, user.password)) {
                return      callback();
            }
        })
        console.log(userFound);
        callback(null, {
        id: user.id.toString(),
        email: user.email
        });
    },
    insert(user) {
        // VALIDATE HERE 
        var sql = 'insert into Users (username) values (?)';
        var params = [user.username];
        return connPool.queryAsync(sql, params)
            .then(function(results) {
              // select the row from db
              sql = 'select * from Users where id=?';
              // 
              params = [results.insertId];  
              return connPool.queryAsync(sql, params);
            })
            .then(function(rows) {
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
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
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