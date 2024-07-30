const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '2d'
    })
    res.cookie("jwt", token, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.COOKIE_MODE !== 'development'
    });
}

module.exports = generateTokenAndSetCookie;