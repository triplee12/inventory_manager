const bcrypt = require("bcryptjs");
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

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashPassword });
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
        const isCorrectPassword = bcrypt.compare(password, user.password);
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

module.exports = { signUp, login, logout };
