const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/userModels");
dotenv.config();

const protectRouteMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ "error": "Unauthorized, please login to access the url." });
        }
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!verifyToken) {
            return res.status(401).json({ "error": "Session has expired, please login." });
        }

        const user = await User.findById(verifyToken.userId).select(['-password',]);
        if (!user) {
            return res.status(404).json({ "error": "User not found" });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({ "error": "Server error" });
    }
}

module.exports = { protectRouteMiddleware };
