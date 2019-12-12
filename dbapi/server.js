// Create express app
var express = require("express")
var app = express()
var express = require("express")
var app = express()
var db = require("./database.js")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// Insert here other API endpoints

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});


app.get('/apio/songss', function (req, res, next) {
    db.connect(conString, function (err, client, done) {
      if (err) {
        // pass the error to the express error handler
        return next(err)
      }
      client.query('select id, name from song;', [], function (err, result) {
        done()
  
        if (err) {
          // pass the error to the express error handler
          return next(err)
        }
  
        res.json(result.rows)
      })
    })
  })
  
  app.get("/api/songs/:id", (req, res, next) => {
    var sql = "select * from user where id = ?"
    var params = [req.params.id]
    db.each("SELECT id, name FROM song", function(err, row) {
        console.log(row.id + ": " + row.name);
    });
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

