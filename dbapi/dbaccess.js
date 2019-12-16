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


exports.buildUpdateQuery = function(tableName, jsonData) {
    let sql = 'UPDATE '+ tableName + ' set ';
    let id = '';
    for (let prop in jsonData ) {
        if (prop.startsWith('v_') || prop.toUpperCase() == 'ID') {
            //console.log(prop.toUpperCase());
            //console.log('skip');
        }
        else {
            //console.log(prop.toUpperCase());
            sql += prop + " = '" + jsonData[prop]+ "' ,";
        }
        if ( prop === 'id') {
            id = jsonData[prop];
        }
    }
    if (sql.endsWith(','))
        sql = sql.slice(0, sql.length -1 );
    sql += ' where id = '+ id;    
    sql = sql.split( "'null'" ).join( 'null' );
    console.log(sql);
    return sql;
}

exports.buildInsertQuery = function(tableName, jsonData) {
    let sql = 'Insert Into '+ tableName ;
    let fields = ' (';
    let values = ' (';
    for (let prop in jsonData ) {
        if (prop.startsWith('v_') || prop.toUpperCase() == 'ID') {
            //console.log(prop.toUpperCase());
            //console.log('skip');
        }
        else {
            //console.log(prop.toUpperCase());
            fields += prop + "," 
            values += "'" + jsonData[prop] + "' ,";
        }

        if ( prop === 'id') {
            id = jsonData[prop];
        }
    }
    if (fields.endsWith(','))
        fields = fields.slice(0, fields.length -1 );
    if (values.endsWith(','))
        values = values.slice(0, values.length -1 );    
    sql += fields + ' )  values (' + values + ') ' ;   
    sql = sql.split( "'null'" ).join( 'null' );

    //console.log(sql);
    return sql;

    /*
    last_insert_rowid()
    The last_insert_rowid() function returns the ROWID of the last 
    row insert from the database connection which invoked the function. 
    The last_insert_rowid() SQL function is a wrapper around the 
    sqlite3_last_insert_rowid() C/C++ interface function.
    */
}
