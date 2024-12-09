const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const connectdb = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "Pintrest-Clone"
        })
        console.log("MongoDB connected successfully")
    } catch (e) {
        console.log("Some error occured", e);
    }
}
module.exports = connectdb