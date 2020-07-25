const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PointSchema = new Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true,
    },
    coordinates: {
        type: [Number],
        required: true,
    },
})

const VenueSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageURL: {
        type: String,
        required: true,
    },
    location: {
        type: PointSchema,
        index: '2dsphere',
        required: true,
    },
    adminId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const VenueModel = mongoose.model('venues', VenueSchema);

module.exports = VenueModel;