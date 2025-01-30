const express = require('express')
const uploadFile = require('../middlewares/multer.js')
const createImg = require('../controller/imgControllers.js')
const Authentication = require("../middlewares/Authentication.js")
const router = express.Router();
router.post("/new", Authentication, uploadFile, createImg)
module.exports = router;