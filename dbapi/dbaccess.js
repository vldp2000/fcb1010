//dbaccess.js
let sqlite3 = require('sqlite3').verbose()
let md5 = require('md5')
let db = require("./database.js")

exports.getTable = function(tableName, callback){
    let sql = `select * from  ${tableName}`;
    console.log(sql);
    let params = [];
    let resultData = []; //for storing the rows.
    db.serialize(function() {
        db.each(sql, function(err, row) {
            console.log("DB row =  " + row); 
            resultData.push(row); //pushing rows into array
        }, function(){ // calling function when all rows have been pulled
            console.log("data before callback  =  " + resultData); 
            callback(resultData);
        });
    });
}

/*
function getTableRecord(tableName, id){
    let params = [ id ];
    let sql = `select * from ${ tableName } where id = ?`;
    db.get(sql, params, (err, row) => {
        if (err) {
            console.log("DB error " + err);  
            return;
         }
         console.log("DB result " + row); 
         return row;
    });
}

module.exports.getTableRecord = getTableRecord;
*/