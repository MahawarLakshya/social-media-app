const jwt = require('jsonwebtoken')
const User = require("../model/userModel.js")
const dotenv = require('dotenv');
dotenv.config();
const TryCatch = require('../utils/TryCatch');
const cookies = require('cookie-parser');

const Authentication = TryCatch(async(req, resp, next) => {
    const token = req.cookies.token
    if (!token)
        return resp.send(400).json({ message: "Login unsuccessfull" });
    const decodedData = jwt.verify(token, process.env.JWT_KEY);
    if (!decodedData)
        return resp.send(400).json({ message: "Token not verified" });
    req.user = await User.findById(decodedData.id);
    next();
})

module.exports = Authentication;