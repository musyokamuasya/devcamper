const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get reviews
// @route   GET api/v1/reviews
// @route   GET api/v1/bootcamps/:bootcampId/reviews
// @access  Public

exports.getReviews = asyncHandler (async (req, res, next)=>{


    if (req.params.bootcampId) {
       const reviews = await Review.find({ bootcamp: req.params.bootcampId});
       return res.status(200).json({
        success: true,
        count: reviews.length, 
        data: reviews
       });
    }
    else{
       res.status(200).json(res.advancedResults);
    }
   
});

// @desc    Get review
// @route   GET api/v1/reviews
// @access  Public

exports.getReview = asyncHandler (async (req, res, next)=>{

const review = await Review.findById(req.params.id).populate({
   path: 'bootcamp',
   select: 'name description'
});

if (!review) {
   next(new ErrorResponse(`No review found with the id ${req.params.id}`, 404));
}
res.status(200).json({
   success: true,
   count: review.length,
   data: review
});
  
});

// @desc    create review
// @route   POST api/v1/bootcamps/:bootcampId/reviews
// @access  Public

exports.createReview = asyncHandler (async (req, res, next)=>{

   req.body.bootcamp = req.params.bootcampId;
   req.body.user = req.user.id;

const bootcamp = await Bootcamp.findById(req.params.bootcampId);

// Check if the bootcamp exists
if (!bootcamp) {
   return next(new ErrorResponse(`No bootcamp found with bootcamp id of ${req.params.bootcampId}`, 404));
}

const review = Review.create(req.body);

   res.status(201).json({
      success: true,
      data: review
   });
     
   });

// @desc    update review
// @route   PUT api/v1/reviews
// @access  Private

exports.updateReview = asyncHandler (async (req, res, next)=>{

   let review = await Review.findById(req.params.id);
   
   if (!review) {
      next(new ErrorResponse(`No review found with the id ${req.params.id}`, 404));
   }

   // Ensure the review belongs to the user updating/ the user in an admin

   if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`The ${req.user.role} with id ${req.user.id} is not allowed to modify this rating`, 401));
   }
   review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
   });
   res.status(200).json({
      success: true,
      count: review.length,
      data: review
    });
     
   });

// @desc    Delete review
// @route   DELETE api/v1/reviews
// @access  Private

exports.deleteReview = asyncHandler (async (req, res, next)=>{

   const review = await Review.findById(req.params.id);
   
   if (!review) {
      next(new ErrorResponse(`No review found with the id ${req.params.id}`, 404));
   }

   // Ensure the review belongs to the user updating/ the user in an admin

   if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`The ${req.user.role} with id ${req.user.id} is not allowed to delete this rating`, 401));
   }
   await review.remove();
   res.status(200).json({
      success: true,
      data: {}
    });
     
   });