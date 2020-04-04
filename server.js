const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet  = require('helmet');
const xssClean = require('xss-clean');
const cookieParcer = require('cookie-parser');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/error');
// const logger = require('./middleware/logger');
const connectDB = require('./config/db');
dotenv.config({path:'./config/config.env'});
const app = express();
app.use(express.json());
app.use(cookieParcer());

const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

// Connect the Database
connectDB();

// Security
// Mongo sanitize
app.use(mongoSanitize());

// Helmet
app.use(helmet());

// XSS-clean to prevent cross site scripting
app.use(xssClean());

// Logging using morgan
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
// Middlewares

// File upload

app.use(fileupload());

// set static folder for the files
app.use(express.static(path.join(__dirname, 'public')));

// Mount Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users );
app.use('/api/v1/reviews', reviews );


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