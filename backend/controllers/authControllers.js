const bcrypt = require("bcryptjs");
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const generateTokenAndSetCookie = require("../utils/generateJWT");
const User = require("../models/userModels");

const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username) {
            return res.status(400).json({ message: "username can not blank" });
        }

        if (username < 3 || username < 12) {
            return res.status(400).json({ message: "username can not be less than 3 or greater than 12" });
        }

        if (!email) {
            return res.status(400).json({ message: "email can not blank" });
        }

        if (!password) {
            return res.status(400).json({ message: "password can not blank" });
        }

        if (password.length < 8 || password.length > 18) {
            return res.status(400).json({ message: "password can not less than 8 or greater than 18 characters" });
        }

        const user = await User.findOne({ username });
        if (user) return res.status(422).json({ message: "User already exists" });
        const userEmail = await User.findOne({ email });
        if (userEmail) return res.status(422).json({ message: "User already exists" });

        const newUser = new User({ username, email, password });
        await newUser.save();
        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            return res.status(201).json({
                "_id": newUser._id,
                "username": username,
                "phoneNumber": newUser.phoneNumber,
                "profileImage": newUser.image,
                "bio": newUser.bio,
                "created_at": newUser.createdAt,
                "updated_at": newUser.updatedAt
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "error": "server error" });
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({"error": "Invalid username or password"})
        }
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword) {
            return res.status(400).json({"error": "Invalid username or password"})
        }
        generateTokenAndSetCookie(user._id, res);
        return res.status(200).json({
            "_id": user._id,
            "username": user.username,
            "profileImage": user.image,
            "bio": user.bio,
            "phoneNumber": user.phoneNumber,
            "created_at": user.createdAt,
            "updated_at": user.updatedAt
        });
    } catch (error) {
        return res.status(500).json({ "error": "server error" });
    }
};

const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        return res.status(200).json({"message": "Account logged out successfully"})
    } catch (error) {
        return res.status(500).json({"error": error.message})
    }
};

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
    
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        const token = crypto.randomBytes(20).toString('hex') + user._id;
        const hashToken = crypto.createHash("sha256").update(token).digest("hex");
        user.resetPasswordToken = hashToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();
    
        const resetUrl = `http://localhost:8000/api/v1/auth/reset-password/${hashToken}`;
        const message = `<h3>Hello, ${user.username}</h3>
        <p>You are receiving this email because you (or someone else) has requested a password reset.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it: 
        ${resetUrl}</p>
        <a href="${resetUrl}" clicktracking="off">Reset Password</a>`;
        console.log(message);
    
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            message,
        });

        res.status(200).json({ message: 'Email sent' });
    } catch (error) {
        console.error(`Error Requesting For An Account Reset: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
    
        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }
    
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
    
        res.status(200).json({ message: 'Password has been reset' });
    } catch (error) {
        console.error(`Error Reseting An Account: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { signUp, login, logout, requestPasswordReset, resetPassword };
