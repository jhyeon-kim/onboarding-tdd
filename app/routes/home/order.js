import express from "express";
import {Order, ORDER_STATE} from "../../models/Order.js";

export const router = express.Router();

router.get("/add-order", (req, res) => {
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

router.get("/get-orders", (req, res) => {
    Order.find()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err);
        })
});