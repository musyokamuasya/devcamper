const Bootcamp = require('../models/Bootcamp');

// @desc    Get all Bootcamps
// @route   GET api/v1/bootcamps
// @access  Public

exports.getBootcamps = (req, res, next)=>{
    res.status(200).json({success: true, msg: 'Show all Bootcamps'});
};



// @desc    Get Bootcamp
// @route   GET api/v1/bootcamps/:id
// @access  Public

exports.getBootcamp = (req, res, next)=>{
    res.status(200).json({success: true, msg: `Show Bootcamp of id ${req.params.id}`});
};

// @desc    Create Bootcamp
// @route   POST api/v1/bootcamp
// @access  Private

exports.createBootcamp = async (req, res, next)=>{

    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp
        });
    } catch (error) {
        res.status(200).json({
            success: false
        });
    }
  

};


// @desc    Update Bootcamp
// @route   PUT api/v1/bootcamp/:id
// @access  Private

exports.updateBootcamp = (req, res, next)=>{
    res.status(200).json({success: true, msg: `Update Bootcamp of id ${req.params.id}`});
};

// @desc    Get all Bootcamps
// @route   DELETE api/v1/bootcamp/:id
// @access  Private

exports.deleteBootcamp = (req, res, next)=>{
    res.status(200).json({success: true, msg: `Delete Bootcamp of id ${req.params.id}`});
};


