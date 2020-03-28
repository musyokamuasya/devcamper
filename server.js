const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
// const logger = require('./middleware/logger');
const connectDB = require('./config/db');
dotenv.config({path:'./config/config.env'});
const app = express();
const bootcamps = require('./routes/bootcamps');


// Connect the Database
connectDB();

// Logging using morgan
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use('/api/v1/bootcamps', bootcamps);




const PORT = process.env.PORT || 5000;
const server = app.listen(
    PORT,
     console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold));

// Handle Undhandled Promise Rejection
process.on('unhandledRejection', (err, promise)=>{
    console.log(`Error: ${err}`.red);
    // Close server and exit
    server.close(()=> (process.exit(1)));
});