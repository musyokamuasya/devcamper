// The courses schema
const mongoose = require('mongoose');
const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Provide a title for the review'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, 'Provide a short text of your review']
    },
    rating: {
        type: Number,
        required: [true, 'Give a review of between 1 and 10'],
        maxlength:10,
        minlength: 1
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: [true, 'Every review is associated to a bootcamp']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Every review is associated  to a bootcamp']
    }

});
// Limit one review per user per bootcamp

ReviewSchema.index({ bootcamp:1, user:1 }, { unique:true });


// // Static method to calculate the average tuition cost of the bootcamp
ReviewSchema.statics.getAverageRating = async function(bootcampId){
    
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId}

        },
        {
            $group: {
                _id:'$bootcamp',
                averageCost: { $avg: '$rating'}
            }
        }
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
                averageRating: obj[0].averageCost 
        });
    } catch (err) {
        console.error(err);
    }
};

// Call average cost method after save
ReviewSchema.post('save', function(){
    this.constructor.getAverageReview(this.bootcamp);
});
// Call average cost method before remove

CourseSchema.pre('remove', function(){
    this.constructor.getAverageReview(this.bootcamp);
});

module.exports = mongoose.model('Review', ReviewSchema);