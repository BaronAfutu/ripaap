const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
    name: { type: String, required: true },
    si: { type: String, required: true },
    conventional: { type: String, default: null },
    updatedAt: { type: Date, default: Date.now() },
    createdAt: { type: Date, default: Date.now() }
})

const Test = mongoose.model("Test", testSchema);

module.exports = Test;
