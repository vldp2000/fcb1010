// Create express app
const express = require("express")
const app = express()
const dbaccess = require("./dbaccess.js")

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
    dbaccess.getTable(req.params.table,function(data){
        console.log("getTable result ");
        console.log(data);
        res.json({ tableName : data });
    });
});

app.get("/api/databyid/:table/:id", (req, res, next) => {
    dbaccess.getTableRecord(req.params.table, req.params.id, function(data){
        console.log("getTableRecord result ");
        console.log(data);
        res.json({ "tableName" : data });
    });
});

// Default response for any other request
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

app.use(function(req, res){
    res.status(404);
});