const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();
const generateToken = (id, res) => {
    const token = jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: '5h' });
    res.cookie(
        "token",
        token, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpsOnly: true,
            sameSite: "strict"
        },
    )
}
module.exports = generateToken;