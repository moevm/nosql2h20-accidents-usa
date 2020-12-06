//const ol = require('ol');
const express = require('express')
const app = express();
const mongoose = require("mongoose");
const csv = require('csv-parser')
const fs = require('fs')
const Accident = require('./accident');

app.use('/public', express.static('public'));
app.set("view engine", "pug");
app.set("views", "./views");


//adding to mongodb example
let url = "mongodb://localhost:27017/accidentsdb";
mongoose.connect("mongodb://localhost:27017/accidentsdb", { useNewUrlParser: true }, function(err){
    if(err) return console.log(err);
    app.listen(3000, function(){
        console.log("Сервер ожидает подключения...");


        const filepath = "US_Accidents_June20.csv"//"US_Accidents_June20.csv"
        let c = 0;
        let acci = [];

        fs.createReadStream(filepath)
            .on('error', () => {
                console.log("error with opening file");
            })

            .pipe(csv())
            .on('data', (row) => {
               // console.log(row);
                let acc = {
                    severity: `${row["Severity"]}`,
                    start: `${row["Start_Time"]}`,
                    end: `${row["End_Time"]}`,
                    start_lat: `${row["Start_Lat"]}`,
                    start_lng: `${row["Start_Lng"]}`,
                    end_lat: `${row["End_Lat"]}`,
                    end_lng: `${row["End_Lng"]}`,
                    distance: `${row["Distance(mi)"]}`,
                    description: `${row["Description"]}`,
                    country: `${row["Country"]}`,
                    state: `${row["State"]}`,
                    county: `${row["County"]}`,
                    city: `${row["City"]}`,
                    number: `${row["Number"]}`,
                    street: `${row["Street"]}`,
                    side: `${row["Side"]}`,
                    temperature: `${row["Temperature(F)"]}`,
                    wind_chill: `${row["Wind_Chill(F)"]}`,
                    humidity: `${row["Humidity(%)"]}`,
                    pressure: `${row["Pressure(in)"]}`,
                    visibility: `${row["Visibility(mi)"]}`,
                    wind_direct: `${row["Wind_Direction"]}`,
                    wind_speed: `${row["Wind_Speed(mph)"]}`,
                    precipation: `${row["Precipitation(in)"]}`,
                    condition: `${row["Weather_Condition"]}`,
                    amenity: `${row["Amenity"]}`,
                    bump: `${row["Bump"]}`,
                    crossing: `${row["Crossing"]}`,
                    give_way: `${row["Give_Way"]}`,
                    junction: `${row["Junction"]}`,
                    no_exit: `${row["No_Exit"]}`,
                    railway: `${row["Railway"]}`,
                    roundabout: `${row["Roundabout"]}`,
                    station: `${row["Station"]}`,
                    stop: `${row["Stop"]}`,
                    traffic_calming: `${row["Traffic_Calming"]}`,
                    traffic_signal: `${row["Traffic_Signal"]}`,
                    turning_loop: `${row["Turning_Loop"]}`,
                    day_period: `${row["Civil_Twilight"]}`
                };
                acci.push(acc);
                if (acci.length == 10000){
                    Accident.insertMany(acci, function(error, docs) {});
                    console.log("Сохранен объект length: ", acci.length, c);
                    c++;
                    acci = [];
                }

            })

            .on('end', () => {
                // handle end of CSV (i don't know what to do here :()
            })

    });
});

//checking

Accident.find({severity: "3"}, function(err, docs){
    mongoose.disconnect();

    if(err) return console.log(err);

   // console.log(docs);
});
