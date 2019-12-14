let sqlite3 = require('sqlite3').verbose()
let md5 = require('md5')

const dbFile = "midigig.db"

let db = new sqlite3.Database( dbFile, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database file'+ dbFile);
    }
});

// close the database connection
/*db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});
*/

module.exports = db