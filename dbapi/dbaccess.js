//dbaccess.js
let sqlite3 = require('sqlite3').verbose()
let md5 = require('md5')
let db = require("./database.js")
const utils = require("./utils.js")

exports.getTable = function (tableName, callback) {
    let sql = `select * from  ${tableName}`;
    //console.log(sql);
    let resultData = []; //for storing the rows.
    db.serialize(function () {
        //console.log("DB rows ");
        db.each(sql, function (err, row) {
            //console.log(row); 
            resultData.push(row); //pushing rows into array
        }, function () { // calling function when all rows have been pulled
            callback(resultData);
        });
    });
}

exports.getTableRecord = function (tableName, id, callback) {
    let params = [id];
    let sql = `select * from ${ tableName } where id = ?`;
    //console.log(sql); 
    //console.log(`Row by id = ${id}`);     
    db.get(sql, [id], function (err, row) {
        //console.log(row); 
        callback(row);
    });
}

exports.updateTableRecord = function (data, callback) {
    const sql = utils.buildUpdateQuery(data);
    let id = -1;
    db.serialize(function () {
        try {
            db.run(sql, function (err) {
                if (err) {
                    callback({
                        "status": false,
                        "val": err
                    });
                } else {
                    console.log("val  " + this.lastID);
                    callback({
                        "status": true,
                        "val": "Ok"
                    });
                }
            });
        } catch (ex) {
            callback({
                "status": false,
                "val": ex
            });
        }

    });
}



/*
db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS users (nom TEXT, prenom TEXT, sexe TEXT, email TEXT)");

    var stmt = db.prepare("INSERT INTO users VALUES (?, ?, ?, ?)");
    stmt.run(users[id].nom, users[id].prenom, users[id].sexe, users[id].email);
    stmt.finalize();
   });

    last_insert_rowid()
    The last_insert_rowid() function returns the ROWID of the last 
    row insert from the database connection which invoked the function. 
    The last_insert_rowid() SQL function is a wrapper around the 
    sqlite3_last_insert_rowid() C/C++ interface function.
*/