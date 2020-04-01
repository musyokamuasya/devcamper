const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');

// Protect routes

exports.protect = asyncHandler(async (req, res, next) =>{
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.split(' ')[1];
        }
        // } else if(req.cookies.token){
        //       token=  req.cookies.token;
        // }
        // verify if the token exists
        if (!token) {
             return next(new ErrorResponse(`Not authorised to access`), 401) ;  
        }

        //Verify the token
        try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                // console.log(decoded);
                req.user = await User.findById(decoded.id);

                next();
        } catch (error) {
         return next(new ErrorResponse('Unauthorised access'), 401);     
        }

});