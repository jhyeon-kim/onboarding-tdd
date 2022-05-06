import OrderStorage from "../models/dummyStorage/OrderStorage.js";
import {Order} from "../models/Order.js";
import ProductStorage from "../models/dummyStorage/ProductStorage.js";
import {subStock} from "../models/Product.js";

const orderStorage = new OrderStorage();
const productStorage = new ProductStorage();

export default class OrderService {

    initOrder(body) {
        let result;
        const product = productStorage.findProductById(body.productId);
        if (product === null) {
            result = {ok: false, errorMessage: "해당 id의 상품이 없습니다."};
        } else if (subStock(product) === false) {
            result = {ok: false, errorMessage: "재고 부족!"};
        } else {
            orderStorage.orders.push(new Order(body));
            result = {ok: true, data: orderStorage.orders};
        }
        return result;
    }

}