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
    let tableName = req.params.table;
    let dataset = [];
    dbaccess.getTable(tableName,function(data){
            console.log(`Callback Result = ${data}`);
            dataset = data;
        }
    );
    console.log("API result " + dataset);
    res.json({ "tableName" : dataset });
});

app.get("/api/databyid/:table/:id", (req, res, next) => {
    let result = dbaccess.getTableRecord(req.params.table, req.params.id);
    console.log("API result " + result);
    res.json({ "tableName" : result });    
});

// Default response for any other request
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

app.use(function(req, res){
    res.status(404);
});