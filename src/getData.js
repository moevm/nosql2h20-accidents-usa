const mongoose = require('mongoose');
let Accident = require('./accident');

function getData(year, month, state, callback) {
    let start = new Date(Number(year),Number(month)).toISOString();
    let end = new Date(Number(year),Number(month)+1).toISOString();
    mongoose.connect('mongodb://mongo:27017/accidents', {useNewUrlParser: true, useUnifiedTopology: true});
    Accident.find({"time.start": {$gte: start, $lt: end}, "state": state},'start.lat start.lng state time.start', function (err, result) {
        mongoose.disconnect();
        callback(err,result);
    })
}

//example of usage
getData('2020','05','OH',function (err,result) {
    console.log(result);
});

module.exports = getData;
