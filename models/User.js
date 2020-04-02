
const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
        name: {
                type: String,
                required: [true, 'Please add user name']
        },
        email: {
                type: String,
                match:[ /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Valid email address has @abc.xyz' ],
                unique: true

        },
        role: {
                type: String,
                enum: ['user', 'publisher'],
                default: 'user'
        },
        password: {
                type: String,
                required: [true, 'Password is needed for authentication'],
                minlength: 6,
                select: false
        },
        resetPasswordToken: String,
        resetPasswordExpiry: Date,
        createdAt: {
                type: Date,
                default: Date.now
        }

});

// Encrypt password
UserSchema.pre('save', async function (next){

        if (!this.isModified('password')) {
                next();
        }
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
});
// Get a signed JWToke
UserSchema.methods.getSignedJwtToken = function(){
       return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
               expiresIn: process.env.JWT_EXPIRE
       });
};
// Match user entered password with the entered password
UserSchema.methods.matchPasswords= async function(enteredPassword){
        return await bcrypt.compare(enteredPassword, this.password);
};


// Generate and hash passwords
UserSchema.methods.getResetPasswordToken = /*async*/ function(){
        // Create random hex value
      const resetToken = crypto.randomBytes(20).toString('hex');
      
//       Create hash 
        this.resetPasswordToken =crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

//    Reset token expiry
        this.resetPasswordExpiry = Date.now() + 10*60*1000;

        return resetToken;

};

module.exports = mongoose.model('User', UserSchema);