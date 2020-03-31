const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get Courses
// @route   GET api/v1/courses
// @route   GET api/v1/bootcamps/:bootcampId/courses
// @access  Public

exports.getCourses = asyncHandler (async (req, res, next)=>{
    let query;

    if (req.params.bootcampId) {
       query = Course.find({ bootcamp: req.params.bootcampId});
    }
    else{
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });
    }
    const courses = await query;
    
    res.status(200).json({
        success: true,
        count: courses.length, 
        data: courses
    });
});

// @desc    Get Course
// @route   GET api/v1/course/:id
// @access  Public

exports.getCourse = asyncHandler( async (req, res, next)=>{
    
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });
    

    if (!course) {
        next (new ErrorResponse(`No course with id of ${req.params.id} was found`, 404));
    }
    res.status(200).json({success: true, data: course});
});

// @desc    Create Course
// @route   GET api/v1/bootcamps/:bootcampId/courses
// @access  Private

exports.createCourse = asyncHandler( async (req, res, next)=>{
    req.body.bootcamp = req.params.bootcampId;
    
    const bootcamp = await Bootcamp.findById(req.params.bootcampId).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    const course = await Course.create(req.body);
    res.status(200).json({success: true, data: course});

    if (!bootcamp) {
        next (new ErrorResponse(`No bootcamp with id of ${req.params.bootcampId} was found`, 404));
    }
});

// @desc    Update Course
// @route   UPDATE api/v1/course/:id
// @access  Private

exports.updateCourse = asyncHandler( async (req, res, next)=>{
    
  let course = await Course.findById(req.params.id);
    

    if (!course) {
        next (new ErrorResponse(`No course with id of ${req.params.id} was found`, 404));
    }
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators: true
    });
    res.status(200).json({success: true, data: course});
});
// @desc    Delete Course
// @route   DELETE api/v1/course/:id
// @access  Private

exports.deleteCourse = asyncHandler( async (req, res, next)=>{
    
   const course = await Course.findById(req.params.id);
      
  
      if (!course) {
          next (new ErrorResponse(`No course with id of ${req.params.id} was found`, 404));
      }
     await course.remove();
      res.status(200).json({success: true, data: {}});
  });
  

