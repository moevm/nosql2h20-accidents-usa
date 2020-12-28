const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
//let parseCSV = require('./parseCSV');
let getData = require('./getData');

let states = JSON.parse(JSON.stringify(require('./data/states')));
let months = JSON.parse(JSON.stringify(require('./data/months')));
//do something with this
let _isLoaded = true;
//parseCSV();

//properties for server need
app.use(fileUpload({}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/public', express.static('public'));
app.set("view engine", "pug");
app.set("views", "./views");


//action on loading localhost:3000/
app.get("/", (req,res) => {
    console.log("GET /")
    res.render("startpage");
});
app.get("/map", (req,res) => {
    console.log("GET /map")
    res.render("index",{
        states: states,
        months: months,
        years: [2016,2017,2018,2019,2020]
    });
});
app.get("/table", (req,res) => {
    console.log("GET /table")
    res.render("table",{
        states: states,
        months: months,
        years: [2016,2017,2018,2019,2020]
    });
});

app.get("/Download", (req,res) => {
    console.log("GET /Download")
    res.download(path.resolve(__dirname,"data","US_Accidents_June20.csv"), "US_Accidents_June20.csv", function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('file downloaded successfully');
        }
    })
});

app.post('/map', function(req, res) {
    req.files.file.mv(path.resolve(__dirname,'data',req.files.file.name));
    res.end(req.files.file.name);
    //parseCSV('data/'+req.files.file.name);
    fs.readFile(path.resolve(__dirname,'data',req.files.file.name), "utf8",
        function(error,data){
            if(error) throw error; // если возникла ошибка
            console.log(data);  // выводим считанные данные
            fs.appendFileSync(path.resolve(__dirname,'data','US_Accidents_June20.csv'), data);
        });

});

app.put("/*/giveMePoints", (req,res) => {
    console.log("PUT /map/giveMePoints")
    console.log(req.body)
    let message;
    if (_isLoaded) {
        message = 'DB loaded'
        console.log(message)
        getData(req.body.year, req.body.month, req.body.state,function (err, result) {
            res.json(result)
        });
//        console.log(data);
    } else {
        message = 'DB is loading'
        console.log(message)
        res.json();
    }
});

app.listen(3000);
/*
exports.setLoaded = function(isLoaded){
    _isLoaded = isLoaded;
};
*/


