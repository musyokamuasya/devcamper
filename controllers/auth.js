const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
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


// @desc    Get the current logged in user
// @route   POST api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler( async (req, res, next)=>{
        const user = await User.findById(req.user.id);

        res.status(200).json({ success: true, data: user });
});

// @desc    Forgot password
// @route   POST api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler( async (req, res, next)=>{
        const user = await User.findOne({email: req.body.email});

        if (!user) {
            return next (new ErrorResponse(`There is no user with that email`, 404));  
        }

        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // Create reset url
        const resetUrl =`${req.protocol}://${req.get('host')}/api/v1/resetpassword/${resetToken}`;

        const message = `You have received this message because you have requested/ someone has requested to change email. Please make a PUT request to : \n\n${resetUrl}`;

        try {
                await sendEmail({
                        email: user.email,
                        subject: 'Reset Email Token',
                        message
                }); 

                res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
                console.log(err);
                user.resetPasswordToken = undefined;
                user.resetPasswordExpiry = undefined;

                await user.save({ validateBeforeSave: false });

                return next(new ErrorResponse('Email could not be sent', 500));
        }
        

        res.status(200).json({ success: true, data: user });
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
