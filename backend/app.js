const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Database connected successfully!");
    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`)
    });
}).catch((error) => console.error(error));

app.get("/", (req, res) => {
    res.json({ "message": "Hello, welcome to Inventory." })
})
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
