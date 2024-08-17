const express = require("express");
const { signUp, login, logout, requestPasswordReset, resetPassword } = require("../controllers/authControllers");

const router = express.Router();

router.post("/register", signUp);
router.post("/login", login);
router.get("/logout", logout);
router.post('/request-password-reset', requestPasswordReset);
router.put('/reset-password/:token', resetPassword);


module.exports = router;
