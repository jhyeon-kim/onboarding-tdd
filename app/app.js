import express from "express";
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import {Order, ORDER_STATE} from "./models/Order.js";
const DATABASE_URI = process.env.DATABASE_URI;
mongoose.connect(DATABASE_URI)
    .then((response) => console.log("Connected to database"))
    .catch((err) => console.log(err));

export const app = express();
const PORT = process.env.PORT;

// todo 주문상태 변경들에 대해 api 만들어보기

app.get("/add-order", (req, res) => {
    const order = new Order({
        userId: "user1",
        productId: "product1",
        price: 10000,
        state: ORDER_STATE.STARTED
    });
    order.save()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err);
        })
});

app.get("/get-orders", (req, res) => {
    Order.find()
        .then((result) => {
            res.send(result[0]._id)
        })
        .catch((err) => {
            console.log(err);
        })
});

app.get("/", (req, res) => {
    res.send("여기는 루트!");
});


export const server = app.listen(PORT, function () {
    console.log(PORT);
    console.log('서버 구동 얍');
});

