const mongoose = require('mongoose');

const plateletSchema = mongoose.Schema({
    reference: { type: String, required: true },
    ageGroup: { type: String, required: true },
    pediatric: {type:Boolean, default: false},
    adult: {type:Boolean, default: false},
    geriatric: {type:Boolean, default: false},
    lrl: { type: Number, required: true },
    url: { type: Number, required: true},
    mean: { type: Number, required: false },
    sd: { type: Number, required: false },
    cv: { type: Number, required: false },
    analyser: {type:String, required:false},
    sampleSize: { type: Number, required: false },
    gender: { type: Number, default: false, required: true },
    country: {type: String, required: true},
    link: { type: String, required: false }
}, { timestamps: true })

const platelet = mongoose.model("platelet", plateletSchema);

module.exports = platelet;