// Create express app
let express = require("express")
let app = express()
let express = require("express")
let app = express()
let db = require("./database.js")

let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port
let HTTP_PORT = 8000 
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


app.get('/apio/songs', function (req, res, next) {
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

app.get('/api/gigs', function (req, res, next) {
    let result = [1,2,3,4,5]
    console.log(result)
    res.json(result)
})
  
app.get("/api/song/:id", (req, res, next) => {
    let sql = "select * from user where id = ?"
    let params = [req.params.id]
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

