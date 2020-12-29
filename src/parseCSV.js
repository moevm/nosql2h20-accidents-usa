const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const mongoose = require('mongoose');
let Accident = require('./accident');
//let app = require('./app');


function parseCSV(file) {
    //connection
    mongoose.connect('mongodb://mongo:27017/accidents', {useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.set('useCreateIndex', true);   //without it warning occurs
   
        console.time();
        let counter = 0;
        let block = 0;
        let csvStream = fs.createReadStream(path.resolve(__dirname, 'data', file));

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
                    mongoose.disconnect();
                    console.log('success')
                    console.timeEnd();
                });
                console.log(`Parsed ${rowCount} rows`);
            });
}

module.exports = parseCSV;
