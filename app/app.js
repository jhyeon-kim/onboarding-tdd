import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
const DATABASE_URI = process.env.DATABASE_URI;
mongoose.connect(DATABASE_URI)
    .then((response) => console.log("Connected to database"))
    .catch((err) => console.log(err));

export const app = express();
import {router} from "./routes/home/order.js";

app.use("/", router);

const PORT = process.env.PORT;

export const server = app.listen(PORT, function () {

});

