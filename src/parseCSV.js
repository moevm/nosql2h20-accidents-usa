const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const mongoose = require('mongoose');
let Accident = require('./accident');
//let app = require('./app');


function parseCSV() {
    //connection
    mongoose.connect('mongodb://localhost:27017/accidents', {useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.set('useCreateIndex', true);   //without it warning occurs
    //checker (use for check if this function worked before)
    let checkerSchema = mongoose.Schema({
        isFull: {
            type: Boolean,
            unique: true
        }});
    const Check = mongoose.model('Check',checkerSchema);
    Check.findOne({isFull: true}, function(err,result){
        if(err) return console.log(err);
        if (result) {
            console.log("Your collection is full already.");
            mongoose.disconnect();
            //app.setLoaded(true);
            return;
        }
        console.time();
        let counter = 0;
        let block = 0;
        let csvStream = fs.createReadStream(path.resolve(__dirname, 'data', 'US_Accidents_June20.csv'));

        let data = [];
        csvStream
            .pipe(csv.parse({headers: true/*, maxRows: 600*/})
                .transform(data => ({
                    time: {
                        start: data.Start_Time,
                        end: data.End_Time,
                    },
                    start: {
                        lat: parseFloat(data.Start_Lat),
                        lng: parseFloat(data.Start_Lng),
                    },
                    country: data.Country,
                    state: data.State,
                    county: data.County,
                    city: data.City
                })))
            .on('error', error => console.error(error))
            .on('data', row => {
                //console.log(row);
                data.push(row);
                counter++;
                if (counter == 500) {
                    counter = 0;
                    block++;
                    Accident.insertMany(data);
                    data = [];
                    console.log("Block #", block,"/ 7027");
                }
            })
            .on('end', rowCount => {
                Accident.insertMany(data).then(() => {
                    let success = new Check({ isFull: true });
                    success.save().then(() => {
                        mongoose.disconnect();
                        console.log('success')
                        console.timeEnd();
                    });
                });
                console.log(`Parsed ${rowCount} rows`);
            });
    })
}

parseCSV();


module.exports = parseCSV;