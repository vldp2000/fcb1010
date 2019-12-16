
exports.parceJsonData = function(resultdata) {
    console.log("Parce JSON");
    console.log(resultdata);

    for (var key in resultdata) {
        if (resultdata.hasOwnProperty(key)) {
            //console.log(resultdata[key]);
            obj = resultdata[key];
            //console.log(obj);
            if ( obj !== null && obj !== undefined ) {
                if (Array.isArray(obj)){
                    for (let item of obj){
                        console.log('array item ')
                        console.log(item);
                        parceJsonObject(item);
                    }
                }
                else {
                    console.log('<Data> ')
                    Object.keys(obj).forEach(key => {
                        console.log(key);
                        console.log(obj[key]);
                    
                    });
                }
            }
        }
     }
}

exports.parceJsonObject = function(jsonData) {
    for (let prop in jsonData ) {
        console.log("prop =" , prop);
        console.log(jsonData[prop]);
    }
}

exports.buildUpdateQuery = function(data) {
    let tableName = data.tableName;
    let jsonData = data.data;

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

exports.buildInsertQuery = function(data) {
    let tableName = data.tableName;
    let jsonData = data.data;
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
}