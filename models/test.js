const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true},
    si: { type: String, required: true },
    conventional: { type: String, default: null }
}, { timestamps: true })

const Test = mongoose.model("Test", testSchema);

module.exports = Test;
