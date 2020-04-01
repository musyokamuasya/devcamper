const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get all Bootcamps
// @route   GET api/v1/bootcamps
// @access  Public

exports.getBootcamps = asyncHandler( async (req, res, next)=>{

        res.status(200).json(res.advancedResults);

});



// @desc    Get Bootcamp
// @route   GET api/v1/bootcamps/:id
// @access  Public

exports.getBootcamp = asyncHandler( async (req, res, next)=>{
    
        const bootcamp = await Bootcamp.findById(req.params.id);
        res.status(200).json({success: true, data: bootcamp});

        if (!bootcamp) {
            next (new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }
    });
//
// @desc    Create Bootcamp
// @route   POST api/v1/bootcamp
// @access  Private

exports.createBootcamp = asyncHandler( async (req, res, next)=>{
    req.body.user = req.user.id;

    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

// If the user is not an admin, they can publish only one bootcamp
    if (publishedBootcamp && req.user.role !== 'admin') {
        next (new ErrorResponse(`The user with id ${req.user.id} has already published a bootcamp`, 400));
    }


        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp
        });

  

        
});


// @desc    Update Bootcamp
// @route   PUT api/v1/bootcamp/:id
// @access  Private

exports.updateBootcamp = asyncHandler( async (req, res, next)=>{
   
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new:true,
            runValidators:true
        });
        if (!bootcamp) {
            next (new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: bootcamp
        });
   
      
});

// @desc    Delete Bootcamp
// @route   DELETE api/v1/bootcamp/:id
// @access  Private

exports.deleteBootcamp = asyncHandler( async (req, res, next)=>{

        const bootcamp = await Bootcamp.findById(req.params.id);

         if (!bootcamp) {
            next (new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }
        bootcamp.remove();
        res.status(200).json({
            success: true,
            data: {}
        });
    
});

// @desc    Get Bootcamp within location
// @route   GET api/v1/bootcamp/radius/:zipcode/:distance
// @access  Public

exports.getBootcampsWithinRadius = asyncHandler( async (req, res, next)=>{

    const { zipcode, distance} = req.params;
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const log = loc[0].longitude;

    // Calculate the radius using radians
    const radius = distance/6378; //Get the distance in Km
    const bootcamps = await Bootcamp.find({
        location: {$geoWithin: {$centerSphere: [[log, lat], radius]}}
    });

    res.status(200).json({
        success: true, 
        count: bootcamps.length,
        data: bootcamps
    });
 
});

// @desc    Upload Bootcamp Photo
// @route   PUT api/v1/bootcamp/:id/photos
// @access  Private

exports.uploadBootcampPhoto = asyncHandler( async (req, res, next)=>{

    const bootcamp = await Bootcamp.findById(req.params.id);

     if (!bootcamp) {
        next (new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    // Photo upload
    if (!req.files) {
        next (new ErrorResponse(`Please upload a bootcamp photo`, 400));
    }

    const file = req.files.file;

    // Make sure the file is a photo
    if(!file.mimetype.startsWith('image')){
        return next (new ErrorResponse(`Please upload an image for the bootcamp photo`, 400));
    }

    if (file.size > process.env.MAX_FILE_SIZE) {
        return next (new ErrorResponse(`Please upload a photo less than ${process.env.MAX_FILE_SIZE}`, 400));
    }
// Create a custom  file name to match the name of the bootcamp
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

    // Actual moving of the file
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err=>{
        if (err) {
            console.error(err)
            return next (new ErrorResponse(`The photo was not uploaded`, 500))
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name})
        res.status(200).json({
            success: true,

            data: file.name
        })
    })
});
