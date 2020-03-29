const mongoose = require('mongoose');

const BootcampSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Bootcamp should have a name'],
        unique:true,
        trim: true,
        maxlength:[50, 'Enter a name of upto 50 characters']

    },
    slug: String,
    description:{
        type: String,
        required: [true, 'Describe what the bootcamp does'],
        unique:false,
        trim: false,
        maxlength:[500, 'Enter a short description of upto 500 characters']
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 
            'Please start your website address with http:// or https://']
    },
    phone: {
        type:String,
        maxlength: [20, 'Phone number should be 20 characters maximum']
    },
    email: {
        type: String,
        match:[ /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ,'Valid email address has @abc.xyz' ]
    },
    address:{
        type:String,
        required:[true, 'Your address is required']
    },
    location: {
        type: {
            type: String, 
            enum: ['Point'], 
            required: false
          },
          coordinates: {
            type: [Number],
            required: false,
            index: '2dsphere'
          },
          formattedAddress: String,
          street: String,
          city: String,
          state: String,
          zipcode: String,
          country: String
          
    },
    careers:{
        type: [String],
        required:true,
        enum:[
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating:{
        type:Number,
        min:[1, 'Minimum rating is 1'],
        max:[10, 'Maximum rating is 10']
    },

    averageCost:Number,
    photo:{
        type:String,
        default:'no-photo.jpg'
    },
    housing:{
        type: Boolean,
        default:false
    },
    jobAcceptance:{
        type: Boolean,
        default:false
    },
    jobGuarantee:{
        type: Boolean,
        default:false
    },
    acceptanceGi:{
        type: Boolean,
        default:false
    },
    createdAt:{
        type: Date,
        default:Date.now
    },

});

module.exports = mongoose.model('Bootcamp',BootcampSchema);