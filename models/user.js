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
    }
};

module.exports.Model = function(connectionPool) {
    // dependency injection
    // flexibly and reusable, and testable
    connPool = connectionPool;
    return User;
}