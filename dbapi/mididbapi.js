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
        //parceJsonObject(data);
        //console.log(resultdata);
        res.json(data);
    });
});

function parceJsonData(resultdata){
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

function parceJsonObject(jsonData) {
    for (let prop in jsonData ) {
        console.log("prop =" , prop);
        console.log(jsonData[prop]);
    }
}


app.get("/api/update/:table/", (req, res, next) => {
    const songdata = { id: 1, name: 'The Star', tempo: null , v_dummy1:'qqqqq', v_dummy2:'zzzzzz' }
    dbaccess.buildQuery(req.params.table, songdata);
    res.json({"message":"Ok"});
    //{
        //buildQuery(data);
        //res.json(data);
    //}
});

app.get("/api/databyid/:table/:id", (req, res, next) => {
    dbaccess.getTableRecord(req.params.table, req.params.id, function(data){
        res.json(data);
    });
});

// Default response for any other request
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

app.use(function(req, res){
    res.status(404);
});