const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    phoneNumber: { type: String, required: false },
    bio: { type: String, required: false },
    password: { type: String, required: true },
    image: {type: String, required: false, default: "https://pixabay.com/photos/little-egret-bird-profile-5826070/"}
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;