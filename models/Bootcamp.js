const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

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
BootcampSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower:true});
    next();
    
});

// Geocode and create location fields
BootcampSchema.pre('save', async function(next){
const loc = await geocoder.geocode(this.address);
this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
    state: loc[0].stateCode

};
this.address = undefined;
    next();
});

module.exports = mongoose.model('Bootcamp',BootcampSchema);