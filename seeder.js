const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Load dotenv files
dotenv.config({path: './config/config.env'});

// Load models
const Bootcamp = require('./models/Bootcamp');

// Connect to the database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true

});

// Read JSON files
const bootcamps = JSON.parse(
fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

// Import data into db
const importData = async ()=>{
    try {
        await Bootcamp.create(bootcamps);
    console.log('Data imported....'.green.inverse);
    process.exit();
    } catch (err) {
        console.error(err);
    }
};

// Delete data from the database

const deleteData = async ()=>{
    try {
        await Bootcamp.deleteMany();
    console.log('Data deleted....'.red.inverse);
    process.exit();
    } catch (err) {
        console.error(err);
    }
};

// Create arguments for deleting and importing data
if (process.argv[2]=== '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}