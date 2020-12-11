let mongoose = require('mongoose');
require('mongoose-double')(mongoose)
let SchemaTypes = mongoose.Schema.Types;

let accidentSchema = mongoose.Schema({
    time: {
        start: Date,
        end: Date,
    },
    start: {
        lat: SchemaTypes.Double,
        lng: SchemaTypes.Double,
    },
    country: String,
    state: String,
    county: String,
    city: String,
});

let Accident = mongoose.model('Accident', accidentSchema);

module.exports = Accident;
