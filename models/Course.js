// The courses schema
const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Course title is required']
    },
    description: {
        type: String,
        required: [true, 'Provide a short description for the course']
    },
    weeks: {
        type: String,
        required: [true, 'State how long the bootcamp will take in weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Provide the amount of tuition fees']
    },
    minimumSkill:{
        type: String,
        required: [true, 'Provide the minimum required skill for the camp'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default:false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: [true, 'Every course needs a bootcamp']
    }

});

module.exports = mongoose.model('Course', CourseSchema);