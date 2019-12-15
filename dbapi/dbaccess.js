//dbaccess.js
let sqlite3 = require('sqlite3').verbose()
let md5 = require('md5')
let db = require("./database.js")

exports.getTable = function(tableName, callback){
    let sql = `select * from  ${tableName}`;
    //console.log(sql);
    let resultData = []; //for storing the rows.
    db.serialize(function() {
        //console.log("DB rows ");
        db.each(sql, function(err, row) {
            //console.log(row); 
            resultData.push(row); //pushing rows into array
        }, function(){ // calling function when all rows have been pulled
            callback(resultData);
        });
    });
}

exports.getTableRecord = function(tableName, id, callback) {
    let params = [ id ];
    let sql = `select * from ${ tableName } where id = ?`;
    //console.log(sql); 
    //console.log(`Row by id = ${id}`);     
    db.get(sql,[id], function(err, row) {
        //console.log(row); 
        callback(row);
    });
}

