import express from "express";
import {Order, initOrder, cancelOrder} from "../../models/Order.js";
import OrderStorage from "../../models/dummyStorage/OrderStorage.js";
import ProductStorage from "../../models/dummyStorage/ProductStorage.js";
import OrderService from "../../service/OrderService.js";

export const router = express.Router();
router.use(express.json());

const orderService = new OrderService();

router.get("/", (req, res) => {
    res.send("🍀 hello!! ");
});

router.get("/db/orders", (req, res) => {
    Order.find()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err);
        })
});

// with dummy data in memory.
const orderStorage = new OrderStorage();
const productStorage = new ProductStorage();
const products = productStorage.products;
const productsIdList = []
for (const product of products) {
    productsIdList.push(product.productId);
}

router.get("/dummy/orders", (req, res) => {
    res.send(orderStorage.findAll());
});

router.get("/dummy/products", (req, res) => {
    res.send(products);
});

// loadtest에서 다루려고... 임시적으로 만든...😂
router.get(`/dummy/products/1`, (req, res) => {
    res.send(products[1]);
});

router.post("/dummy/orders", (req, res) => {
    res.json(orderService.initOrder(req.body));
});

//uri 이렇게 쓰면 안 된다고 했는데 ..
router.post("/dummy/orders/cancel", (req, res) => {
    res.json(cancelOrder(req.body));
});

// router.post("/dummy/orders/cancel")
//
//
