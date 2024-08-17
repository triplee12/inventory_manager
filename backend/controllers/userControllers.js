const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/userModels");
dotenv.config();

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select(["-password", "-resetPasswordExpires", "-resetPasswordToken"])
        if (!user) {
            return res.status(404).json({ "error": "User found" });
        }
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ "error": err.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findByIdAndUpdate(userId, req.body, { new: true }).select("-password");
        if (!user) {
            return res.status(404).json({ "error": "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ "error": "Server error" });
    }
};

const updateUserPassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ "error": "User not found" });
        }
        if (!req.body.old_password || !req.body.password || req.body.password < 8) {
            return res.status(400).json({ "error": "Old password is required and password must be at least 8 characters" });
        }
        const old_password = await bcrypt.compare(req.body.old_password, user.password);
        if (!old_password) {
            return res.status(400).json({ "error": "Invalid old password" });
        }
        user.password = req.body.password;
        await user.save();
        return res.status(201).json({ "message": "Password updated successfully" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ "error": "Server error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ "error": "User not found" });
        }
        return res.status(204).json({ message: 'Blog post deleted successfully' });
    } catch (err) {
        return res.status(500).json({ "error": "Server error" });
    }
};

module.exports = {
    getUserProfile,
    updateUser,
    updateUserPassword,
    deleteUser
}
