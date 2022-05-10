import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
const DATABASE_URI = process.env.DATABASE_URI;
// mongoose.connect(DATABASE_URI)
mongoose.connect('mongodb://db_container:27017')
    .then((response) => console.log("Connected to database"))
    .catch((err) => console.log(err));

export const app = express();
import {router as orderRouter} from "./routes/home/order.js";
import {router as userRouter} from "./routes/home/user.js";

app.use("/", orderRouter);
app.use("/user", userRouter);

const PORT = process.env.PORT;

export const server = app.listen(PORT, function () {

});

