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

        res.status(200).json({ success: true , token});
});

// @desc    Login in user
// @route   POST api/v1/auth/login
// @access  Public

exports.register = asyncHandler(async (req, res, next)=>{
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
        const token = user.getSignedJwtToken();

        
  
          res.status(200).json({ success: true , token});
  });