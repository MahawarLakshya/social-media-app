const express = require('express');
const router = express.Router()
const { registerUser, getuser, loginUser, myProfile, userProfile, follow_unfollow, logout } = require('../controller/userController.js');
const Authentication = require('../middlewares/Authentication.js');

router.post("/register", registerUser)
router.get("/get", getuser)
router.post("/login", loginUser)
router.post("/logout", logout)
router.get("/me", Authentication, myProfile)
router.get("/:id", Authentication, userProfile)
router.post("/follow/:id", Authentication, follow_unfollow)


module.exports = router