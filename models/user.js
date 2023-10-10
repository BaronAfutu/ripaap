const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    title: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, index: true },
    institution: { type: String, required: false },
    position: { type: String, required: false },
    city: { type: String, required: true },
    country: { type: String, required: true },
    isInternalUser: { type: Boolean, default: false, required: true },
    password: { type: String, required: true }
}, { timestamps: true })

const User = mongoose.model("User", userSchema);

module.exports = User;
