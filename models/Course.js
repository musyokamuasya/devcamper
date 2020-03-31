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
// Static method to calculate the average tuition cost of the bootcamp
CourseSchema.statics.getAverageCost = async function(bootcampId){
    
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId}

        },
        {
            $group: {
                _id:'$bootcamp',
                averageCost: { $avg: '$tuition'}
            }
        }
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
                averageCost: Math.ceil(obj[0].averageCost / 10)*10
        });
    } catch (err) {
        console.error(err);
    }
};

// Call average cost method after save
CourseSchema.post('save', function(){
    this.constructor.getAverageCost(this.bootcamp);
});
// Call average cost method before remove

CourseSchema.pre('remove', function(){
    this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);