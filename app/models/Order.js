import StateError from "../error/StateError.js";
import mongoose from "mongoose";

import NiceApiError from "../error/NiceApiError.js";
import StockError from "../error/StockError.js";
import {findProduct} from "./User.js";
import {subStock} from "./Product.js";

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        required: true
    }
}, {timestamps: true});

export const Order = mongoose.model('Order', orderSchema);

export const ORDER_STATE = {
    STARTED: "orderStarted",
    PAID: "orderPaid",
    CANCEL_REQUESTED: "cancelRequested",
    CANCEL_COMPLETED: "cancelCompleted"
}

// -> STARTED
export const initOrder = (userObject, productObject) => {
    if (checkIfPaidBefore(userObject, productObject)) {
        throw new Error("User has bought this product before.");
    }
    const subtracted = subStock(productObject);
    if (subtracted === false) {
        throw new StockError();
    }
    return new Order({
        userId: userObject._userId,
        productId: productObject.productId,
        price: productObject.price,
        state: ORDER_STATE.STARTED
    });
}

// -> PAID
export const completeOrder = (orderObject) => {
    checkState(orderObject, ORDER_STATE.STARTED);
    if (checkNiceApiResponse().statusCode !== 3001) {
        throw new NiceApiError(checkNiceApiResponse.statusCode);
    }
    orderObject.state = ORDER_STATE.PAID;
    return orderObject;
}

// -> CANCEL_REQUESTED
export const cancelOrder = (orderObject) => {
    checkState(orderObject, ORDER_STATE.PAID);
    orderObject.state = ORDER_STATE.CANCEL_REQUESTED;
    return orderObject;
}

// -> CANCEL_COMPLETED
export const completeCancel = (orderObject) => {
    checkState(orderObject, ORDER_STATE.CANCEL_REQUESTED);
    orderObject.state = ORDER_STATE.CANCEL_COMPLETED;
    return orderObject;
}

// helper codes
function checkState(orderObject, state) {
    if (orderObject.state !== state) {
        throw new StateError(`PAID 이전 상태는 ${state} 이어야 한다.`);
    }
}

function checkIfPaidBefore(userObject, productObject) {
    const productId = productObject.id;
    // return !!userObject.findProduct(productId);
    return findProduct(userObject, productId);
}

export const checkNiceApiResponse = () => {
    // axios post 요청해야 하는. 현재로서는 비어있는 함수.
    return {success: true, statusCode: 3001};
}
