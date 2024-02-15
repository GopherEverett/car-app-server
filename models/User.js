const { Schema } = require('mongoose');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    passwordDigest: {
        type: String,
        required: true
    },
    resetLink: {
        type: String,
        default: ""
    },
}, { timestamps: true });

module.exports = UserSchema;