const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Load dotenv files
dotenv.config({path: './config/config.env'});

// Load models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');

// Connect to the database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true

});

// Read JSON file for the bootcamps
const bootcamps = JSON.parse(
fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);
// Read JSON file for the courses
const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
    );

// Import data into db
const importData = async ()=>{
    try {
        await Bootcamp.create(bootcamps);
        // await Course.create(courses);
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
        await Course.deleteMany();
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