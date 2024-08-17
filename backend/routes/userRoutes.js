const express = require('express');
const { getUserProfile, updateUser, updateUserPassword, deleteUser } = require("../controllers/userControllers");
const { protectRouteMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/profile", protectRouteMiddleware, getUserProfile);
router.put("/profile/update", protectRouteMiddleware, updateUser);
router.patch("/profile/update/password", protectRouteMiddleware, updateUserPassword);
router.delete("/profile/delete/account", protectRouteMiddleware, deleteUser);

module.exports = router;
