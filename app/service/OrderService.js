import OrderStorage from "../models/OrderStorage.js";
import {Order} from "../models/Order.js";
import ProductStorage from "../models/ProductStorage.js";
import UserStorage from "../models/UserStorage.js";

const orderStorage = new OrderStorage();
const productStorage = new ProductStorage();
const userStorage = new UserStorage();

export default class OrderService {

    initOrder(body) {
        let result;
        const product = productStorage.findProductById(body.productId);
        if (product === null) {
            result = {ok: false, errorMessage: "해당 id의 상품이 없습니다."};
        } else if (product.subStock() === false) {
            result = {ok: false, errorMessage: "재고 부족!"};
        } else {
            orderStorage.orders.push(new Order(body));
            result = {ok: true, data: orderStorage.orders};
        }
        return result;
    }

}