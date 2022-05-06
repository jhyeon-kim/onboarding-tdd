import express from "express";
import {Order} from "../../models/Order.js";
import OrderStorage from "../../models/OrderStorage.js";
import ProductStorage from "../../models/ProductStorage.js";
import UserStorage from "../../models/UserStorage.js";
import OrderService from "../../service/OrderService.js";

export const router = express.Router();
router.use(express.json());

const orderService = new OrderService();

// todo 어떤 api 들이 필요한가?

// 1. 주문 개시 요청


// 2. 주문 취소 요청


//
// router.get("/add-order", (req, res) => {
//     const order = new Order({
//         userId: "user1",
//         productId: "product1",
//         price: 10000,
//         state: ORDER_STATE.STARTED
//     });
//     order.save()
//         .then((result) => {
//             res.send(result)
//         })
//         .catch((err) => {
//             console.log(err);
//         })
// });

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

const userStorage = new UserStorage();

router.get("/dummy/orders", (req, res) => {
    res.send(orderStorage.findAll());
});

router.get("/dummy/products", (req, res) => {
    res.send(products);
});

router.post("/dummy/orders", (req, res) => {
    const body = req.body;
    const result =  orderService.initOrder(body);
    res.json(result);

    //
    // const product = productStorage.findProductById(body.productId);
    // if (product === null) {
    //     res.json({ok: false, errorMessage: "해당 id의 상품이 없습니다."})
    // }
    // if (product.subStock() === false) {
    //     res.json({ok: false, errorMessage: "재고 부족!"})
    // }
    //
    // orderStorage.orders.push(new Order(req.body));
    // res.json({ok: true, data: orderStorage.orders});

});

// router.post("dummy/")
//

