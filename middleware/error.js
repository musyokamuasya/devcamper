const ErrrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next)=>{

    let error = {...err}
    error.message = err.message;
    console.log(err.stack.red);

    // Mongoose bad objectId Error
     if (err.name === 'CastError') {
         const message = `Resource not found with id of ${err.value}`;
         error = new ErrrorResponse (message, 404);
     }

    //  Duplicate value error
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrrorResponse(message, 400);
        
    }
    //Validation Error handling
    if (err.message === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrrorResponse(message, 400);
        
    } 


    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};
module.exports = errorHandler;