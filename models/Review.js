// The courses schema
const mongoose = require('mongoose');
const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Reviewitle for the review'],
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
// // Static method to calculate the average tuition cost of the bootcamp
// CourseSchema.statics.getAverageCost = async function(bootcampId){
    
//     const obj = await this.aggregate([
//         {
//             $match: { bootcamp: bootcampId}

//         },
//         {
//             $group: {
//                 _id:'$bootcamp',
//                 averageCost: { $avg: '$tuition'}
//             }
//         }
//     ]);

//     try {
//         await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
//                 averageCost: Math.ceil(obj[0].averageCost / 10)*10
//         });
//     } catch (err) {
//         console.error(err);
//     }
// };

// // Call average cost method after save
// CourseSchema.post('save', function(){
//     this.constructor.getAverageCost(this.bootcamp);
// });
// // Call average cost method before remove

// CourseSchema.pre('remove', function(){
//     this.constructor.getAverageCost(this.bootcamp);
// });

module.exports = mongoose.model('Review', ReviewSchema);