const app = require('express')();
app.set("view engine", "pug");
app.set("views", "./views");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("userdb");
    var myobj = {content: "Hello world", purpose: "start"};
    dbo.collection("greetings").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        console.log(res.ops);
        db.close();
    });
});

app.get("/", (req,res) => {
    let resultArray = [];
    console.log("on the main page");
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("userdb");
        dbo.collection("greetings").find({}, { projection: { _id: 0, purpose: 0} }).toArray(function(err, result) {
            if (err) throw err;
            res.render("index", {title: result[0].content})
            db.close();
        });
    });
});
app.listen(3000);