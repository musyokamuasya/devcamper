const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
// const logger = require('./middleware/logger');
const connectDB = require('./config/db');
dotenv.config({path:'./config/config.env'});
const app = express();
app.use(express.json());

const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

// Connect the Database
connectDB();

// Logging using morgan
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
// Mount Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

// Handle Errors
app.use(errorHandler);




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