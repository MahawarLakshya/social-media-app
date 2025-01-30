const express = require('express');
const dotenv = require('dotenv')
const connectdb = require("./model/database")
const userRoutes = require("./routes/userRoutes")
const imgRoutes = require('./routes/imgRoutes')
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary')

dotenv.config();
cloudinary.v2.config({
    cloud_name: process.env.cloud_Name,
    api_key: process.env.cloud_apiKey,
    api_secret: process.env.cloud_apiSecret
})
const port = process.env.PORT;

const app = express();

app.use(express.json()); //to take json resp form user
app.use(cookieParser())
    //using routes
app.use('/api/user', userRoutes)
app.use('/api/img', imgRoutes)



app.listen(port, () => {
    connectdb()
    console.log(`Server is running on port ${port}  : http://localhost:${port}`);
})