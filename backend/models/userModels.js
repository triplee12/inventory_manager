const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    phoneNumber: { type: String, required: false },
    bio: { type: String, required: false },
    password: { type: String, required: true },
    image: {type: String, required: false, default: "https://pixabay.com/photos/little-egret-bird-profile-5826070/"},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const hashPassword = await bcrypt.hash(this.password, 10);
    this.password = hashPassword;
    next();
})

const User = mongoose.model("User", userSchema);

module.exports = User;