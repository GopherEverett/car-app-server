const mongoose = require('mongoose');
const UserSchema = require('./User');
const CarSchema = require('./Car');
const ModSchema = require('./Mod');


const User = mongoose.model('User', UserSchema);
const Car = mongoose.model('Car', CarSchema);
const Mod = mongoose.model('Mod', ModSchema);

module.exports = {
    Mod,
    Car,
    User
}