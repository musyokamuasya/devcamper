const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc    Register user
// @route   POST api/v1/auth/register
// @access  Public

exports.register = asyncHandler(async (req, res, next)=>{
      const  { name, email, password, role } = req.body;

      const user = await User.create({
              name, 
              email,
              password,
              role
      });

      const token = user.getSignedJwtToken();

      getTokenResponse(user, 200, res);
});

// @desc    Login in user
// @route   POST api/v1/auth/login
// @access  Public

exports.login = asyncHandler(async (req, res, next)=>{
        const  { email, password } = req.body;

        if (!(email || password)) {
                next (new ErrorResponse(`Please provide an email and password`, 400));     
        }

        const user = await User.findOne({ email }).select('+password');
        console.log(user);

        if (!user) {
                next (new ErrorResponse(`Authentication error: Email is not registered`, 401));     
        }
        // Check if the passwords match
        const isMatch = await user.matchPasswords(password);

        if (!isMatch) {
                next (new ErrorResponse(`Authentication error: Enter correct email and password`, 401));    
        }
       
     getTokenResponse(user, 200, res);
  });

//   Get token from model, create cookie and send response
  const getTokenResponse = (user, statusCode, res)=>{
        const token = user.getSignedJwtToken();
        const options ={
        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
        };
        // Secure cookies in production
        if (process.env.NODE_ENV === 'production') {
              options.secure =true;  
        }

        res.status(statusCode).cookie('token', token, options).json({success: true, token});
  };