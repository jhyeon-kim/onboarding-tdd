import {Order, ORDER_STATE} from "../Order.js";
import ProductStorage from "./ProductStorage.js";

const productStorage = new ProductStorage();
const products = productStorage.products;
const productsIdList = []
for (const product of products) {
    productsIdList.push(product.productId);
}

const orderStarted = new Order({
    userId: "user1",
    productId: productsIdList[0],
    price: 10000,
    state: ORDER_STATE.STARTED
})

const orderPaid = new Order({
    userId: "user2",
    productId: productsIdList[1],
    price: 10000,
    state: ORDER_STATE.PAID
})

const orderCancelRequested = new Order({
    userId: "user3",
    productId: productsIdList[2],
    price: 10000,
    state: ORDER_STATE.CANCEL_REQUESTED
})

const orderCancelCompleted = new Order({
    userId: "user4",
    productId: productsIdList[3],
    price: 10000,
    state: ORDER_STATE.CANCEL_COMPLETED
})

export default class OrderStorage {
    orders = [orderStarted, orderPaid, orderCancelRequested, orderCancelCompleted];
    findAll() {
        return this.orders;
    }
};

