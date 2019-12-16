
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
    let values = [];
    let sql = 'UPDATE '+ tableName + ' set ';
    let id = '';
    for (let prop in jsonData ) {
        if (prop.startsWith('v_') || prop.toUpperCase() == 'ID') {
            //console.log(prop.toUpperCase());
            //console.log('skip');
        }
        else {
            //console.log(prop.toUpperCase());
            sql += prop + " = ? ," ;
            values.push( prepareData( "'" + jsonData[prop] + "'")) ;
        }
        if ( prop === 'id') {
            id = jsonData[prop];
        }
    }
    if (sql.endsWith(','))
        sql = sql.slice(0, sql.length -1 );
    sql += ' where id = ? '
    values.push(id);    

    sql = sql.split( "'null'" ).join( 'null' );
    console.log(sql);
    return { "sql": sql, "values":values };
}

exports.buildInsertQuery = function(data) {
    let tableName = data.tableName;
    let jsonData = data.data;
    let sql = 'Insert Into '+ tableName ;
    let fields = ' (';
    let format = ' ('
    let values = [];
    for (let prop in jsonData ) {
        if (prop.startsWith('v_') || prop.toUpperCase() == 'ID') {
            //console.log(prop.toUpperCase());
            //console.log('skip');
        }
        else {
            //console.log(prop.toUpperCase());
            fields += prop + "," 
            format += ' ?,'
            values.push( prepareData( "'" + jsonData[prop] + "'") );
        }
    }
    if (fields.endsWith(','))
        fields = fields.slice(0, fields.length -1 );
    if (format.endsWith(','))
        format = format.slice(0, format.length -1 );    
    sql += fields + ' )  values ' + format + ') ' ;   
    sql = sql.split( "'null'" ).join( 'null' );
    //console.log(sql);
    return  { "sql": sql, "values":values };
}

function prepareData(value) {
    return value.split( "'null'" ).join( 'null' );

}
