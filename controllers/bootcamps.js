const Bootcamp = require('../models/Bootcamp');

// @desc    Get all Bootcamps
// @route   GET api/v1/bootcamps
// @access  Public

exports.getBootcamps = async (req, res, next)=>{
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({success: true, data: bootcamps});
        
    } catch (err) {
        res.status(400).json({success: false});
    }
};



// @desc    Get Bootcamp
// @route   GET api/v1/bootcamps/:id
// @access  Public

exports.getBootcamp = async (req, res, next)=>{
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        res.status(200).json({success: true, data: bootcamp});

        if (!bootcamp) {
            return res.status(400).json({success: false});}
    } catch (err) {
        res.status(400).json({success: false}); 
    }

};
//
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
    } catch (err) {
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


