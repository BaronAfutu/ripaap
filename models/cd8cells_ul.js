const mongoose = require('mongoose');

const cd8cells_ulSchema = mongoose.Schema({
    reference: { type: String, required: true },
    ageGroup: { type: String, required: true,default:"" },
    pediatric: {type:Boolean, default: false},
    adult: {type:Boolean, default: false},
    geriatric: {type:Boolean, default: false},
    lrl: { type: Number, required: true },
    url: { type: Number, required: true},
    mean: { type: Number, required: false },
    sd: { type: Number, required: false },
    cv: { type: Number, required: false },
    analyser: {type:String, required:false, default:""},
    sampleSize: { type: Number, required: false },
    gender: { type: Number, default: false, required: true },
    country: {type: String, required: true},
    link: { type: String, required: false }
}, { timestamps: true })

const cd8cells_ul = mongoose.model("cd8cells_ul", cd8cells_ulSchema);

module.exports = cd8cells_ul;
