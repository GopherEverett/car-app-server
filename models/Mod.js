const { Schema } = require('mongoose');

const ModSchema = new Schema({
    car: {
        type: Schema.Types.ObjectId,
        ref: 'Car'
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    parts: [String],
    images: [String]
}, { timestamps: true });

module.exports = ModSchema;