const mongoose = require('mongoose');

const carAvailabilitySchema = new mongoose.Schema({
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

// Index for efficient querying
carAvailabilitySchema.index({ car: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('CarAvailability', carAvailabilitySchema); 