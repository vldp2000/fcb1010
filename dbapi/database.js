var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "midigig.db"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
//        db.each("SELECT id, name FROM song", function(err, row) {
//            console.log(row.id + ": " + row.name);
//        });
    }
});


module.exports = db