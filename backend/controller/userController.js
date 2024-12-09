const User = require("../model/userModel.js")
const cookie = require('cookie-parser')
const bcrypt = require("bcrypt")
const TryCatch = require("../utils/TryCatch.js");
const generateToken = require("../utils/generateToken.js");
const registerUser = TryCatch(async(req, resp) => {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email })
    if (user) {


        return resp.status(400).json({
                message: "Already registerd user",
            }

        );
    }
    const hashPassword = await bcrypt.hash(password, 10);
    user = await User.create({
        name,
        email,
        password: hashPassword
    });
    generateToken(user._id, resp);
    return resp.send({
        user,
        message: "user created successfully"
    })

})

const getuser = TryCatch(async(req, resp) => {
    const { token } = req.cookies.token
    if (!token) {
        return resp.status(400).json({ message: 'Token not found in cookies' });
    }
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user)
        return resp.status(200).json(user, token);
    else
        return resp.status(404).json({ message: 'User not found' });
})

const loginUser = TryCatch(async(req, resp) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return resp.status(400).json({ message: "User not existed" });
    }
    const compPassword = await bcrypt.compare(password, user.password);
    if (!compPassword) {
        return resp.status(400).json({ message: "Invalid Password" });
    }
    generateToken(user._id, resp);
    return resp.status(200).send({
        user,
        message: "LoggedIn successfully"
    })


})

const myProfile = TryCatch(async(req, res) => {
    const user = await User.findById(req.user._id);
    res.json(user);
})

const userProfile = TryCatch(async(req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    res.json(user);
})

const follow_unfollow = TryCatch(async(req, res) => {
    //user to follow
    const user = await User.findById(req.params.id).select("-password")
        //my profile
    const loggedInUser = await User.findById(req.user._id);
    if (!loggedInUser)
        return res.status(400).json({ message: "User not logged in" })
            //If you try to folllow your id then 
    if (user._id.toString() === loggedInUser._id.toString()) {
        return res.status(400).json({
            message: "You can't follow yourself"
        })
    }
    //user is followed already or not
    //If I already follow the user then I had my usename in there followers list
    if (user.followers.includes(loggedInUser._id)) {
        //find the value of user in the following list of my and then remove it form my following list
        const indexofUser = loggedInUser.following.indexOf(user._id);
        //find the value of my in the follower list of user and then remove it form user's follower list
        const indexofme = user.followers.indexOf(loggedInUser._id)
            //delete my name in the follower list of user
        user.followers.splice(indexofme, 1)
            //delete the user's name in the following list of me
        loggedInUser.following.splice(indexofUser, 1)

        await loggedInUser.save();
        await user.save();

        return res.json({ message: "Unfollow the user successfully" });

    }
    //user not already follower
    else if (!user.followers.includes(loggedInUser._id)) {
        loggedInUser.following.push(user._id);
        user.followers.push(loggedInUser._id);

        await loggedInUser.save();
        await user.save();

        return res.json({ message: "Followed the user successfully" });
    }
})
const logout = TryCatch(async(req, res) => {
    const cookie = await req.cookies.token;
    if (cookie) {
        res.cookie("token", "", { maxAge: 0 })
        return res.status(200).json({ message: "User Logged out successfully" })
    } else
        return res.status(400).json({ message: "User not present" })
})
module.exports = { registerUser, getuser, loginUser, myProfile, userProfile, follow_unfollow, logout }