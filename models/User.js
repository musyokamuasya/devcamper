const mongoose = require('mongoose');

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
                minlangth: 6,
                select: false
        },
        resetPasswordToken: String,
        resetPasswordExpiry: Date,
        createdAt: {
                type: Date,
                default: Date.now
        }

});

module.exports = mongoose.model('User', UserSchema);