// Create express app
const express = require("express")
const app = express()
const db = require("./database.js")

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


app.get("/api/data/:table", (req, res, next) => {
    let table = req.params.table;
    let sql = `select * from  ${table}`;
    console.log(sql);
    let params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({ "data":rows });
      });
});

app.get("/api/databyid/:table/:id", (req, res, next) => {
    let params = [ req.params.id ];
    let sql = `select * from ${ req.params.table } where id = ?`;
    console.log(sql);
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({ "data":row });
    });
});

// Default response for any other request
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

app.use(function(req, res){
    res.status(404);
});