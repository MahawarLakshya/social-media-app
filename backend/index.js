const express = require('express');
const dotenv = require('dotenv')
const connectdb = require("./model/database")
const userRoutes = require("./routes/userRoutes")
const cookieParser = require('cookie-parser');

dotenv.config();
const port = process.env.PORT;

const app = express();

app.use(express.json()); //to take json resp form user
app.use(cookieParser())
app.use('/api/user', userRoutes)



app.listen(port, () => {
    connectdb()
    console.log(`Server is running on port ${port}  : http://localhost:${port}`);
})