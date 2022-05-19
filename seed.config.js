require("@babel/register");
require('dotenv').config();
var seeder = require('mongoose-seed');
var fs = require('fs');

var cities = {};
try {
    var cityJSONString = fs.readFileSync("./src/seeders/cities.json");
    cities = JSON.parse(cityJSONString);
  } catch (err) {
    console.log(err);
    return;
  }

console.log("env mongo url ",process.env.MONGODB_URL);
const db = process.env.MONGODB_URL;

// Data array containing seed data - documents organized by Model
const data = [cities, {
    'model': 'User',
    'documents': [
        {
            'firstName': 'Huzefa',
            'lastName': 'Ratlamwala',
            'email': 'huzefa.ratlamwala@lmsin.com',
            'userType': 'student'
        },
        {
            'firstName': 'Rubed',
            'lastName': 'Khan',
            'email': 'rubed.khan@xyz.com',
            'userType': 'student'
        }
    ]}
];

// Connect to MongoDB via Mongoose
seeder.connect(db, function() {

    // Load Mongoose models
    seeder.loadModels([
        './src/models/User',
        './src/models/City'
    ]);

     // Clear specified collections
    seeder.clearModels(['User','City'], function() {
 
        // Callback to populate DB once collections have been cleared
        seeder.populateModels(data, function() {
            seeder.disconnect();
        });
 
    });
});